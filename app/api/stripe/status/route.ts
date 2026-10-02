import { NextResponse } from 'next/server';
import { getStripeConfigStatus } from '@/lib/stripe-config';

export async function GET() {
  const status = getStripeConfigStatus();

  return NextResponse.json({
    ready: status.configured,
    webhookReady: status.webhookConfigured,
    siteUrl: status.siteUrl,
    mode: status.mode,
    missing: status.missing,
  });
}
