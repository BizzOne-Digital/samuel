import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { Check, BookOpen, ShoppingCart } from 'lucide-react';
import connectDB from '@/lib/db/mongodb';
import PricingOffer from '@/models/PricingOffer';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Pricing | Samuel Louis Jean Publications',
  description: 'View pricing options for books by Dr. Samuel Louis Jean',
};

export const dynamic = 'force-dynamic';

async function getPricingOffers() {
  await connectDB();
  const offers = await PricingOffer.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  
  return JSON.parse(JSON.stringify(offers));
}

export default async function PricingPage() {
  const offers = await getPricingOffers();
  const singleBookOffer = offers.find((o: any) => o.offerType === 'single_book');
  const multiBookOffer = offers.find((o: any) => o.offerType === 'multi_book');

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.png"
              alt="Pricing"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            {/* Emerald Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/80 to-emerald-950/65" />
          </div>
          
          <div className="relative container mx-auto px-6 lg:px-12 py-32 text-center">
            {/* Decorative Line */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-12 bg-gold mr-4" />
              <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
                Pricing Options
              </span>
              <div className="h-px w-12 bg-gold ml-4" />
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight" style={{ fontWeight: 400 }}>
              Simple Pricing
            </h1>

            {/* Decorative Divider */}
            <div className="w-32 h-px bg-gold/50 mx-auto mb-8" />

            {/* Description */}
            <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              Choose the option that works best for you. All books include insightful content designed to inspire and transform.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Single Book */}
              {singleBookOffer && (
                <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-8 lg:p-10 hover:border-emerald-600 hover:shadow-xl transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="font-display text-2xl text-gray-900 mb-2">
                      {singleBookOffer.label || 'Single Book'}
                    </h3>
                    <p className="text-gray-600">{singleBookOffer.description || 'Purchase any single book'}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-display font-bold text-emerald-700">
                        {formatPrice(singleBookOffer.price)}
                      </span>
                      <span className="text-gray-600 ml-2">per book</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">Plus shipping</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="text-emerald-700 mr-3 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-800">Choose any available title</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-emerald-700 mr-3 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-800">High-quality print</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-emerald-700 mr-3 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-800">Transformative content</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-emerald-700 mr-3 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-800">Fast shipping</span>
                    </li>
                  </ul>

                  <Link href="/books">
                    <button className="w-full px-6 py-4 bg-transparent border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-cream transition-all duration-300 text-sm font-semibold tracking-wider rounded-lg flex items-center justify-center">
                      <BookOpen size={20} className="mr-2" />
                      BROWSE BOOKS
                    </button>
                  </Link>
                </div>
              )}

              {/* Multi-Book Offer */}
              {multiBookOffer && (
                <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl p-8 lg:p-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-4 right-4 bg-gold text-black px-4 py-1 rounded-full text-sm font-bold uppercase">
                    Best Value
                  </div>

                  <div className="relative z-10">
                    <div className="mb-6">
                      <h3 className="font-display text-2xl text-cream mb-2">
                        {multiBookOffer.label || 'Four Books for $100'}
                      </h3>
                      <p className="text-cream/90">{multiBookOffer.description || 'Special bundle offer'}</p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-display font-bold text-gold">
                          {formatPrice(multiBookOffer.price)}
                        </span>
                        <span className="text-cream/90 ml-2">for {multiBookOffer.quantity}</span>
                      </div>
                      <p className="text-cream/90 text-sm mt-2">
                        Plus shipping • Save {formatPrice((singleBookOffer?.price || 2500) * multiBookOffer.quantity - multiBookOffer.price)}
                      </p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-start">
                        <Check className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-cream">Choose any {multiBookOffer.quantity} books</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-cream">Significant savings</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-cream">Perfect for gifts</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-cream">Free bookmarks included</span>
                      </li>
                    </ul>

                    <Link href="/books">
                      <button className="w-full px-6 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider rounded-lg flex items-center justify-center">
                        <ShoppingCart size={20} className="mr-2" />
                        GET THIS OFFER
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Shipping Info */}
        <section className="relative py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl text-gray-900 mb-8 text-center">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Domestic Shipping</h3>
                  <p className="text-gray-700 text-sm">$5.00 flat rate</p>
                  <p className="text-gray-600 text-xs mt-1">5-7 business days</p>
                </div>
                <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
                  <p className="text-gray-700 text-sm">2-3 business days</p>
                  <p className="text-gray-600 text-xs mt-1">Orders processed Monday-Friday</p>
                </div>
                <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Tracking</h3>
                  <p className="text-gray-700 text-sm">Provided via email</p>
                  <p className="text-gray-600 text-xs mt-1">Track your order anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Speaking Pricing */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                Speaking Engagements
              </span>
              <h2 className="font-display text-5xl lg:text-6xl text-gray-900 mb-6" style={{ fontWeight: 400 }}>
                Conference & Event Pricing
              </h2>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                Pricing for speaking engagements varies based on event type, location, and duration. Contact us for a personalized quote.
              </p>
              <Link href="/booking">
                <button className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-cream transition-all duration-300 text-sm font-semibold tracking-wider">
                  REQUEST A QUOTE
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
