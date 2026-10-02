import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { getStripe } from '@/lib/stripe';
import { isStripeConfigured } from '@/lib/stripe-config';
import { sendOrderPaidEmails } from '@/lib/order-emails';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    await connectDB();

    const orderNumber = session.metadata?.orderNumber;

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isPaid =
      session.payment_status === 'paid' ||
      session.status === 'complete';

    if (isPaid) {
      if (session.amount_total && order.total !== session.amount_total) {
        return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 });
      }

      if (order.paymentStatus !== 'paid') {
        await Order.findOneAndUpdate(
          { orderNumber },
          {
            paymentStatus: 'paid',
            status: 'confirmed',
            stripeSessionId: session.id,
          }
        );

        await sendOrderPaidEmails(order._id.toString());
      }

      return NextResponse.json({
        paid: true,
        orderNumber,
        customerEmail: session.customer_details?.email || order.customerEmail,
      });
    }

    return NextResponse.json({
      paid: false,
      orderNumber,
      status: session.payment_status,
    });
  } catch (error) {
    console.error('Verify checkout error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
