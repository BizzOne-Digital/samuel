import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import { newsletterSchema } from '@/lib/validations';
import { z } from 'zod';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate input
    const validatedData = newsletterSchema.parse(body);

    await connectDB();

    // Check if email already exists
    const existing = await NewsletterSubscriber.findOne({
      email: validatedData.email,
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'You are already subscribed!' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existing.isActive = true;
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = undefined;
        if (validatedData.name) {
          existing.name = validatedData.name;
        }
        await existing.save();
        return NextResponse.json(
          { success: true, message: 'Subscription reactivated!' },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await NewsletterSubscriber.create({
      email: validatedData.email,
      name: validatedData.name,
      isActive: true,
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed!' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
