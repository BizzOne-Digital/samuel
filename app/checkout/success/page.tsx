'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { useCart } from '@/lib/cart-context';
import { CheckCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.paid) {
          setOrderNumber(data.orderNumber);
          clearCart();
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart]);

  return (
    <main className="flex-1 flex items-center justify-center py-32">
      <div className="text-center max-w-lg mx-auto px-6">
        {loading ? (
          <>
            <Loader2 className="w-16 h-16 text-emerald-700 animate-spin mx-auto mb-6" />
            <p className="text-gray-600">Confirming your payment...</p>
          </>
        ) : (
          <>
            <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
            <h1 className="text-4xl font-display text-gray-900 mb-4">Thank You!</h1>
            <p className="text-gray-700 text-lg mb-4">
              Your payment was successful. We will process your order and contact you with shipping details.
            </p>
            {orderNumber && (
              <p className="text-sm text-gray-500 mb-8">
                Order number: <span className="font-semibold text-gray-900">{orderNumber}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <button className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-cream transition-all duration-300 text-sm font-semibold tracking-wider">
                  CONTINUE SHOPPING
                </button>
              </Link>
              <Link href="/">
                <button className="px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 text-sm font-semibold tracking-wider">
                  BACK TO HOME
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream flex flex-col overflow-x-hidden w-full">
        <Header />
        <Suspense
          fallback={
            <main className="flex-1 flex items-center justify-center py-32">
              <Loader2 className="w-16 h-16 text-emerald-700 animate-spin" />
            </main>
          }
        >
          <SuccessContent />
        </Suspense>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
