// /api/create-subscription
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST() {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;
    const planId = process.env.SUBSCRIPTION_PLAN_ID;

    if (!keyId || !keySecret || !planId) {
      return NextResponse.json(
        {
          error:
            'Missing Razorpay credentials or plan id. Please check environment variables RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY, SUBSCRIPTION_PLAN_ID.',
        },
        { status: 500 }
      );
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const result = await instance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 1,
      addons: [],
      notes: {
        key1: 'Note',
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Razorpay subscription error:', error);
    const razorpayError =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      'Unknown error';

    return NextResponse.json(
      {
        error: razorpayError,
      },
      { status: 500 }
    );
  }
}