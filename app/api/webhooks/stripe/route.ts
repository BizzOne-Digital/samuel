import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { getStripe } from '@/lib/stripe';
import { getStripeWebhookSecret, isStripeWebhookConfigured } from '@/lib/stripe-config';
import { sendOrderPaidEmails } from '@/lib/order-emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function markOrderPaid(session: Stripe.Checkout.Session) {
  const orderNumber = session.metadata?.orderNumber;
  const orderId = session.metadata?.orderId;

  if (!orderNumber && !orderId) {
    console.error('Stripe webhook: missing order metadata', session.id);
    return;
  }

  await connectDB();

  const query = orderId
    ? { _id: orderId }
    : orderNumber
      ? { orderNumber }
      : { stripeSessionId: session.id };

  const existing = await Order.findOne(query);

  if (!existing) {
    console.error('Stripe webhook: order not found', { orderNumber, orderId });
    return;
  }

  if (existing.paymentStatus === 'paid') {
    return;
  }

  if (session.amount_total && existing.total !== session.amount_total) {
    console.error('Stripe webhook: amount mismatch', {
      orderNumber: existing.orderNumber,
      expected: existing.total,
      received: session.amount_total,
    });
    return;
  }

  await Order.findOneAndUpdate(query, {
    paymentStatus: 'paid',
    status: 'confirmed',
    stripeSessionId: session.id,
  });

  await sendOrderPaidEmails(existing._id.toString());
}

async function markOrderFailed(orderNumber: string) {
  await connectDB();

  const existing = await Order.findOne({ orderNumber });

  if (!existing || existing.paymentStatus === 'paid') {
    return;
  }

  await Order.findOneAndUpdate(
    { orderNumber },
    { paymentStatus: 'failed', status: 'cancelled' }
  );
}

export async function POST(request: NextRequest) {
  if (!isStripeWebhookConfigured()) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret()!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          await markOrderPaid(session);
        }
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        await markOrderPaid(session);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = session.metadata?.orderNumber;
        if (orderNumber) {
          await markOrderFailed(orderNumber);
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
