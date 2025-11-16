import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import db from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { eq, desc, or } from 'drizzle-orm';

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

    // Fetch history for this user (by userId or email)
    let history;
    if (userEmail) {
      // Fetch by either email or userId to cover all cases
      history = await db
        .select()
        .from(AIOutput)
        .where(
          or(
            eq(AIOutput.createdBy, userEmail),
            eq(AIOutput.createdBy, userId)
          )
        )
        .orderBy(desc(AIOutput.id))
        .limit(50);
    } else {
      history = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.createdBy, userId))
        .orderBy(desc(AIOutput.id))
        .limit(50);
    }

    return NextResponse.json({ 
      success: true, 
      data: history 
    });

  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch history', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

