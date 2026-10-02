import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { bookingSchema } from '@/lib/validations';
import { sendContactAutoReply, sendContactNotification } from '@/lib/email-templates';
import { isEmailConfigured } from '@/lib/email';
import { z } from 'zod';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 300000 });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

function formatBookingMessage(data: z.infer<typeof bookingSchema>): string {
  return [
    `Event type: ${data.eventType}`,
    data.organization ? `Organization: ${data.organization}` : '',
    data.eventDate ? `Preferred date: ${data.eventDate}` : '',
    data.eventLocation ? `Location: ${data.eventLocation}` : '',
    data.audienceSize ? `Audience size: ${data.audienceSize}` : '',
    data.budgetRange ? `Budget range: ${data.budgetRange}` : '',
    `Preferred contact: ${data.preferredContact}`,
    '',
    'Event details:',
    data.eventDetails,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const validatedData = bookingSchema.parse(body);
    const message = formatBookingMessage(validatedData);
    const subject = `Speaking / Conference Booking — ${validatedData.eventType}`;

    await connectDB();

    await ContactMessage.create({
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      subject,
      message,
      status: 'unread',
    });

    const emailPayload = {
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      subject,
      message,
    };

    if (isEmailConfigured()) {
      try {
        await Promise.all([
          sendContactNotification(emailPayload),
          sendContactAutoReply(emailPayload),
        ]);
      } catch (emailError) {
        console.error('Booking email error:', emailError);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Booking request sent successfully!' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Booking form error:', error);
    return NextResponse.json(
      { error: 'Failed to send booking request. Please try again.' },
      { status: 500 }
    );
  }
}
