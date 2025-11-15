import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/utils/db';
import { AIOutput } from '@/utils/schema';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { formData, templateSlug, aiResponse, userEmail } = await request.json();

    if (!formData || !templateSlug || !aiResponse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const createdAt = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format
    const createdBy = userEmail || userId; // Use email if provided, fallback to userId

    // Save to database
    const result = await db.insert(AIOutput).values({
      formData: JSON.stringify(formData),
      templateSlug: templateSlug,
      aiResponse: aiResponse,
      createdBy: createdBy,
      createdAt: createdAt,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: result 
    });

  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save content', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

