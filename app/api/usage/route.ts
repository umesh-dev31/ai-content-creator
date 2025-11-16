import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import db from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user email if available
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // Fetch all history for this user (by userId or email)
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

    // Calculate total usage (word count from all AI responses)
    let totalWords = 0;
    let totalCharacters = 0;
    
    history.forEach((item) => {
      if (item.aiResponse) {
        // Remove HTML tags before counting
        const plainText = item.aiResponse.replace(/<[^>]*>/g, '');
        const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
        totalWords += words.length;
        totalCharacters += plainText.length;
      }
    });

    // Total credits limit (10,000 words as an example)
    const totalCredits = 10000;
    const usedCredits = totalWords;
    const percentage = Math.min((usedCredits / totalCredits) * 100, 100);

    return NextResponse.json({ 
      success: true, 
      data: {
        used: usedCredits,
        total: totalCredits,
        percentage: percentage.toFixed(1),
        totalGenerations: history.length,
        totalCharacters: totalCharacters
      }
    });

  } catch (error: any) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch usage', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

