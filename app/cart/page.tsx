'use client';

import { useCart } from '@/lib/cart-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const shippingCost = 500; // $5.00
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <SmoothScrollProvider>
        <div className="min-h-screen bg-cream flex flex-col overflow-x-hidden w-full">
          <Header />
          <main className="flex-1 flex items-center justify-center py-32">
            <div className="text-center">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-display text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Add some books to get started!</p>
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
            <h1 className="text-4xl lg:text-5xl font-display text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow p-6 flex items-start gap-6"
                  >
                    {/* Book Cover */}
                    <div className="flex-shrink-0 w-24 h-32 bg-gray-200 rounded-lg overflow-hidden">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          width={96}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-emerald-700 font-bold text-lg mb-4">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-2xl font-display text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-emerald-700">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="w-full px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-cream transition-all duration-300 text-sm font-semibold tracking-wider rounded-lg flex items-center justify-center">
                      PROCEED TO CHECKOUT
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </Link>

                  <Link href="/books">
                    <button className="w-full mt-4 px-6 py-3 bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 text-sm font-semibold tracking-wider rounded-lg">
                      CONTINUE SHOPPING
                    </button>
                  </Link>
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
