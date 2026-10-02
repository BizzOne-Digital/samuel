import Stripe from 'stripe';
import { getStripeSecretKey } from './stripe-config';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = getStripeSecretKey();

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured. Add it to .env.local and Vercel environment variables.'
    );
  }

  if (!stripe) {
    stripe = new Stripe(secretKey, {
      apiVersion: '2026-08-26.dahlia',
      typescript: true,
    });
  }

  return stripe;
}
