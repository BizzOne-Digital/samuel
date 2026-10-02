import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { getStripeConfigStatus } from '../lib/stripe-config';

const status = getStripeConfigStatus();

console.log('\n🔍 Stripe Configuration Check\n');
console.log(`Site URL:          ${status.siteUrl}`);
console.log(`Mode:              ${status.mode}`);
console.log(`Secret key:        ${status.configured ? '✅ set' : '❌ missing'}`);
console.log(`Publishable key:   ${status.publishableConfigured ? '✅ set' : '⚠️  optional (not needed for Checkout redirect)'}`);
console.log(`Webhook secret:    ${status.webhookConfigured ? '✅ set' : '⚠️  missing (required for production)'}`);

if (status.missing.length > 0) {
  console.log('\nMissing required variables:');
  status.missing.forEach((key) => console.log(`  - ${key}`));
}

if (!status.webhookConfigured) {
  console.log('\nLocal webhook setup:');
  console.log('  1. Install Stripe CLI: https://stripe.com/docs/stripe-cli');
  console.log('  2. Run: stripe login');
  console.log('  3. Run: npm run stripe:listen');
  console.log('  4. Copy whsec_... into STRIPE_WEBHOOK_SECRET in .env.local');
}

if (!status.webhookConfigured) {
  console.log('\nProduction webhook setup (Vercel):');
  console.log('  URL: https://samuellouisjeanpublications.vercel.app/api/webhooks/stripe');
  console.log('  Events: checkout.session.completed');
  console.log('          checkout.session.async_payment_succeeded');
  console.log('          checkout.session.expired');
}

console.log('\nTest card: 4242 4242 4242 4242 | Any future date | Any CVC\n');

process.exit(status.configured ? 0 : 1);
