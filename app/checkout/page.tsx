'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { useCart } from '@/lib/cart-context';
import { checkoutSchema } from '@/lib/validations';
import { SHIPPING_COST_CENTS } from '@/lib/constants';
import { ShoppingBag, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { z } from 'zod';

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [stripeReady, setStripeReady] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/stripe/status')
      .then((res) => res.json())
      .then((data) => setStripeReady(Boolean(data.ready)))
      .catch(() => setStripeReady(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'USA',
    },
  });

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const finalTotal = totalPrice + SHIPPING_COST_CENTS;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            _id: item._id,
            title: item.title,
            slug: item.slug,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Checkout failed. Please try again.');
        return;
      }

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      setError('Unable to start payment. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <SmoothScrollProvider>
        <div className="min-h-screen bg-cream flex flex-col overflow-x-hidden w-full">
          <Header />
          <main className="flex-1 flex items-center justify-center py-32">
            <div className="text-center">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-display text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Add books before checking out.</p>
              <Link href="/books">
                <button className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-cream transition-all duration-300 text-sm font-semibold tracking-wider">
                  BROWSE BOOKS
                </button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    );
  }

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />

        <main className="container mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/cart"
              className="inline-flex items-center text-emerald-700 hover:text-emerald-900 text-sm font-semibold mb-8 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Cart
            </Link>

            <h1 className="text-4xl lg:text-5xl font-display text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 lg:p-8 space-y-6">
                  <h2 className="text-2xl font-display text-gray-900 mb-4">Shipping Information</h2>

                  {stripeReady === false && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Stripe payments are not configured yet. Add your Stripe API keys to
                        environment variables and redeploy.
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        {...register('customerName')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                        placeholder="Your full name"
                      />
                      {errors.customerName && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        {...register('customerEmail')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                        placeholder="you@example.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        {...register('customerPhone')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                        placeholder="904-555-1234"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerPhone.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                      <input
                        {...register('address')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                        placeholder="Street address"
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        {...register('city')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                      <input
                        {...register('state')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        {...register('zip')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                      {errors.zip && (
                        <p className="text-red-600 text-sm mt-1">{errors.zip.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        {...register('country')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Order Notes (optional)</label>
                      <textarea
                        {...register('orderNotes')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 resize-none"
                        placeholder="Any special instructions..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || stripeReady === false}
                    className="w-full px-6 py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-cream transition-all duration-300 text-sm font-semibold tracking-wider rounded-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    {isSubmitting ? 'REDIRECTING TO STRIPE...' : 'PAY WITH STRIPE'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    You will be redirected to Stripe to complete your payment securely.
                  </p>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-2xl font-display text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item._id} className="flex gap-3">
                        <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.coverImage && (
                            <Image
                              src={item.coverImage}
                              alt={item.title}
                              width={48}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-emerald-700 font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">{formatPrice(SHIPPING_COST_CENTS)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-emerald-700">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
