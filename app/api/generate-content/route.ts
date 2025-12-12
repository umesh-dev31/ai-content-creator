import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Groq from 'groq-sdk';
import db from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { eq, or, gte } from 'drizzle-orm';

// In-memory rate limiter: Map<userId, { count: number, resetTime: number }>
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_REQUESTS = 10; // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Helper function to check rate limit
function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or initialize
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: userLimit.resetTime - now 
    };
  }

  // Increment count
  userLimit.count++;
  rateLimitMap.set(userId, userLimit);
  return { 
    allowed: true, 
    remaining: RATE_LIMIT_REQUESTS - userLimit.count, 
    resetIn: userLimit.resetTime - now 
  };
}

// Helper function to check credit limits
async function checkCreditLimit(userEmail: string | null, userId: string): Promise<{ 
  allowed: boolean; 
  used: number; 
  total: number; 
  remaining: number;
  isSubscribed: boolean;
}> {
  // Get user's history to calculate usage
  let history;
  if (userEmail) {
    history = await db
      .select()
      .from(AIOutput)
      .where(
        or(
          eq(AIOutput.createdBy, userEmail),
          eq(AIOutput.createdBy, userId)
        )
      );
  } else {
    history = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, userId));
  }

  // Calculate total words used
  let totalWords = 0;
  history.forEach((item) => {
    if (item.aiResponse) {
      const plainText = item.aiResponse.replace(/<[^>]*>/g, '');
      const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
      totalWords += words.length;
    }
  });

  // Check subscription status
  let isSubscribed = false;
  if (userEmail) {
    const subscription = await db
      .select({ status: UserSubscription.status })
      .from(UserSubscription)
      .where(eq(UserSubscription.email, userEmail))
      .limit(1);
    isSubscribed = Boolean(subscription[0]?.status);
  }

  const totalCredits = isSubscribed ? 100000 : 10000;
  const remaining = Math.max(0, totalCredits - totalWords);

  return {
    allowed: remaining > 0,
    used: totalWords,
    total: totalCredits,
    remaining,
    isSubscribed
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to generate content.' },
        { status: 401 }
      );
    }

    // Get user email
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || null;

    // Check rate limit
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      const resetSeconds = Math.ceil(rateLimit.resetIn / 1000);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          details: `Too many requests. Please try again in ${resetSeconds} seconds.`,
          retryAfter: resetSeconds
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetSeconds.toString(),
            'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + rateLimit.resetIn).toISOString()
          }
        }
      );
    }

    // Check credit limit
    const creditCheck = await checkCreditLimit(userEmail, userId);
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Credit limit exceeded', 
          details: `You have used all ${creditCheck.total.toLocaleString()} credits. Please upgrade your plan to continue generating content.`,
          used: creditCheck.used,
          total: creditCheck.total
        },
        { status: 403 }
      );
    }

    const { formData, aiPrompt } = await request.json();

    console.log('API Route - Received request:', { formData, aiPrompt });

    // Check if API key is set (try both NEXT_PUBLIC and server-side env vars)
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      console.error('API Key not found in environment variables');
      return NextResponse.json(
        { error: 'Groq API key is not configured. Please set GROQ_API_KEY in your .env file.' },
        { status: 500 }
      );
    }

    console.log('API Key found, initializing Groq...');

    // Initialize Groq client
    const groq = new Groq({
      apiKey: apiKey,
    });

    // Build the prompt - format it better
    const userInputText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    const finalPrompt = `${userInputText}\n\n${aiPrompt}`;

    console.log('Final prompt:', finalPrompt);

    // Groq model options - using fast and reliable models
    const model = 'llama-3.3-70b-versatile'; // Fast and capable model
    
    console.log(`Calling Groq model: ${model}...`);

    // Generate content using Groq streaming
    const stream = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: finalPrompt,
        },
      ],
      stream: true,
    });

    console.log('Groq response stream received, processing...');

    // Collect the text response from stream
    let fullText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullText += content;
      }
    }

    if (!fullText) {
      console.error('No text was generated from Groq response');
      return NextResponse.json(
        { error: 'No content generated from AI' },
        { status: 500 }
      );
    }

    console.log('Full text generated:', fullText.substring(0, 100) + '...');

    // Calculate word count of generated content
    const plainText = fullText.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Check if adding this content would exceed the limit
    const newTotal = creditCheck.used + wordCount;
    if (newTotal > creditCheck.total) {
      return NextResponse.json(
        { 
          error: 'Credit limit would be exceeded', 
          details: `This content would use ${wordCount} words, exceeding your ${creditCheck.total.toLocaleString()} credit limit. Please upgrade your plan.`,
          wordCount,
          used: creditCheck.used,
          total: creditCheck.total
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      content: fullText,
      wordCount,
      creditsRemaining: creditCheck.total - newTotal,
      rateLimitRemaining: rateLimit.remaining
    }, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + rateLimit.resetIn).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error generating content:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause
    });
    return NextResponse.json(
      { 
        error: 'Failed to generate content', 
        details: error.message || 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

