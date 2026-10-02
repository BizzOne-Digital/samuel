import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Book from '@/models/Book';
import Order from '@/models/Order';
import { getStripe } from '@/lib/stripe';
import { getSiteUrl, isStripeConfigured, SHIPPING_COST_CENTS } from '@/lib/stripe-config';
import { checkoutSchema } from '@/lib/validations';
import { generateOrderNumber } from '@/lib/utils';

const cartItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

const checkoutRequestSchema = checkoutSchema.extend({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
});

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            'Stripe is not configured yet. Please add STRIPE_SECRET_KEY to your environment variables.',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const data = checkoutRequestSchema.parse(body);

    await connectDB();

    const orderItems = [];
    let subtotal = 0;

    for (const item of data.items) {
      const book = await Book.findById(item._id);

      if (!book || !book.isPublished || !book.inStock) {
        return NextResponse.json(
          { error: `"${item.title}" is no longer available.` },
          { status: 400 }
        );
      }

      const unitPrice =
        book.isSaleActive && book.salePrice ? book.salePrice : book.price;

      if (unitPrice !== item.price) {
        return NextResponse.json(
          { error: `Price for "${book.title}" has changed. Please refresh your cart.` },
          { status: 400 }
        );
      }

      orderItems.push({
        bookId: book._id,
        title: book.title,
        price: unitPrice,
        quantity: item.quantity,
      });

      subtotal += unitPrice * item.quantity;
    }

    const total = subtotal + SHIPPING_COST_CENTS;
    const orderNumber = generateOrderNumber();
    const siteUrl = getSiteUrl();

    const order = await Order.create({
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: {
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country || 'USA',
      },
      items: orderItems,
      subtotal,
      shippingCost: SHIPPING_COST_CENTS,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      notes: data.orderNotes,
    });

    const stripe = getStripe();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = data.items.map(
      (item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            metadata: {
              bookSlug: item.slug,
            },
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })
    );

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: SHIPPING_COST_CENTS,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.customerEmail,
      client_reference_id: orderNumber,
      line_items: lineItems,
      metadata: {
        orderNumber,
        orderId: order._id.toString(),
      },
      payment_intent_data: {
        metadata: {
          orderNumber,
          orderId: order._id.toString(),
        },
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?order=${orderNumber}`,
    });

    await Order.findByIdAndUpdate(order._id, {
      stripeSessionId: session.id,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe session could not be created. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, orderNumber });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid checkout data' },
        { status: 400 }
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to start checkout. Please try again.' },
      { status: 500 }
    );
  }
}
