import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({ 
      success: true, 
      content: fullText 
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

