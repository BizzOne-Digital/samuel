import { SHIPPING_COST_CENTS } from './constants';

export { SHIPPING_COST_CENTS };

const REQUIRED_STRIPE_VARS = ['STRIPE_SECRET_KEY'] as const;

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  return url.replace(/\/$/, '');
}

export function getStripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY;
}

export function getStripeWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET;
}

export function getStripePublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripeSecretKey());
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(getStripeSecretKey() && getStripeWebhookSecret());
}

export function getStripeConfigStatus() {
  const missing: string[] = [];

  for (const key of REQUIRED_STRIPE_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  const webhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const publishableConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const siteUrl = getSiteUrl();

  return {
    configured: missing.length === 0,
    webhookConfigured,
    publishableConfigured,
    siteUrl,
    missing,
    mode: getStripeSecretKey()?.startsWith('sk_live_') ? 'live' : 'test',
  };
}

export { REQUIRED_STRIPE_VARS };

const OPTIONAL_STRIPE_VARS = [
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
] as const;

export { OPTIONAL_STRIPE_VARS };
