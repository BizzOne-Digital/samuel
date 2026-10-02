import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream flex flex-col overflow-x-hidden w-full">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center max-w-lg mx-auto px-6">
            <XCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-4xl font-display text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-gray-700 text-lg mb-8">
              Your payment was not completed. Your cart items are still saved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <button className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-cream transition-all duration-300 text-sm font-semibold tracking-wider">
                  TRY AGAIN
                </button>
              </Link>
              <Link href="/cart">
                <button className="px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 text-sm font-semibold tracking-wider">
                  VIEW CART
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
