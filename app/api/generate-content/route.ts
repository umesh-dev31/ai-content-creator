import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { formData, aiPrompt } = await request.json();

    console.log('API Route - Received request:', { formData, aiPrompt });

    // Check if API key is set
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API Key not found in environment variables');
      return NextResponse.json(
        { error: 'Google Gemini API key is not configured' },
        { status: 500 }
      );
    }

    console.log('API Key found, initializing Google GenAI...');

    // Initialize Google GenAI
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Build the prompt - format it better
    const userInputText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    const finalPrompt = `${userInputText}\n\n${aiPrompt}`;

    console.log('Final prompt:', finalPrompt);

    // Configure the model - use a simpler model name for text generation
    const model = 'gemini-2.0-flash-exp';

    // Create contents array
    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
    ];

    console.log('Calling AI model...');

    // Generate content stream
    const response = await ai.models.generateContentStream({
      model,
      contents,
    });

    console.log('AI response received, processing stream...');

    // Collect the text response
    let fullText = '';
    for await (const chunk of response) {
      console.log('Chunk received:', chunk);
      
      // Try different ways to access the text
      if (chunk.text) {
        // Direct text access (as in AiModal.tsx)
        console.log('Text chunk (direct):', chunk.text);
        fullText += chunk.text;
      } else if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
        // Nested text access
        const text = chunk.candidates[0].content.parts[0].text;
        console.log('Text chunk (nested):', text);
        fullText += text;
      } else {
        console.log('Skipping chunk - no text found');
      }
    }

    console.log('Full text generated:', fullText.substring(0, 100) + '...');

    if (!fullText) {
      console.error('No text was generated from the AI response');
      return NextResponse.json(
        { error: 'No content generated from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      content: fullText 
    });

  } catch (error: any) {
    console.error('Error generating content:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to generate content', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

