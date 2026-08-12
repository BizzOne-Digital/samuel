import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Users, Award, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Samuel Louis Jean (Dr. Louis-Jean) | Publications',
  description: 'Learn about Samuel Louis Jean (Dr. Louis-Jean), Senior Pastor at Calvary Haitian Baptist Church and author committed to inspiring meaningful growth.',
};

export default function AboutPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.png"
              alt="Samuel Louis Jean (Dr. Louis-Jean)"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-emerald-950/70" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-6 lg:px-12 py-32 lg:py-40">
            <div className="max-w-4xl">
              {/* Small Decorative Line */}
              <div className="flex items-center mb-8">
                <div className="h-px w-12 bg-gold mr-4" />
                <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
                  About the Author
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight" style={{ fontWeight: 400 }}>
                A Life Dedicated to
                <br />
                Inspiration
              </h1>

              {/* Decorative Divider */}
              <div className="w-32 h-px bg-gold/50 mb-8" />

              {/* Description */}
              <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-2xl">
                Meet Samuel Louis Jean (Dr. Louis-Jean): Senior Pastor at Calvary Haitian Baptist Church, author, and speaker dedicated to meaningful transformation. Discover the journey, message, and vision behind the words.
              </p>

              {/* CTA Button */}
              <Link href="/books">
                <button className="group px-8 py-4 bg-transparent border-2 border-gold text-cream hover:bg-gold hover:text-emerald-950 transition-all duration-300 text-sm font-semibold tracking-wider flex items-center justify-center">
                  EXPLORE THE BOOKS
                  <svg
                    className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Biography Section with Image */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/about-pic.png"
                    alt="Samuel Louis Jean (Dr. Louis-Jean)"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
                {/* Decorative Frame */}
                <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-gold/30 rounded-2xl -z-10" />
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                  The Journey
                </span>
                <h2 className="font-display text-5xl lg:text-6xl text-gray-900 mb-8" style={{ fontWeight: 400 }}>
                  From Vision to Voice
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Samuel Louis Jean (Dr. Louis-Jean) serves as Senior Pastor at Calvary Haitian Baptist Church, located at 922 Blanding Blvd, Orange Park, FL 32065. He has dedicated his life to empowering individuals through the written word and spoken message. With a deep commitment to community, education, and spiritual growth, his work bridges cultures and generations.
                  </p>
                  <p>
                    His books and conferences have reached audiences worldwide, inspiring meaningful change and personal transformation. Through powerful storytelling and profound insights, Dr. Louis-Jean challenges readers and listeners to embrace their full potential.
                  </p>
                  <p>
                    With a unique ability to connect with diverse audiences, his message resonates across age groups, cultural backgrounds, and life circumstances. His work embodies the belief that words have the power to transform lives and communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-5xl mx-auto text-center">
              <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                Our Mission
              </span>
              <h2 className="font-display text-5xl lg:text-6xl text-gray-900 mb-8" style={{ fontWeight: 400 }}>
                Inspiring Growth, One Word at a Time
              </h2>
              <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto leading-relaxed">
                The mission of Samuel Louis Jean Publications is to provide resources, events, and messages that challenge, inspire, and uplift. We believe in the power of words to transform lives and communities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={32} className="text-cream" />
                  </div>
                  <h3 className="font-display text-2xl text-gray-900 mb-3">Publish</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Creating transformative books that inspire and challenge readers to grow.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={32} className="text-black" />
                  </div>
                  <h3 className="font-display text-2xl text-gray-900 mb-3">Engage</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bringing powerful messages through speaking engagements and conferences.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={32} className="text-cream" />
                  </div>
                  <h3 className="font-display text-2xl text-gray-900 mb-3">Empower</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Equipping individuals and communities to reach their full potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Speaking Vision */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                Speaking Engagements
              </span>
              <h2 className="font-display text-5xl lg:text-6xl text-gray-900 mb-8" style={{ fontWeight: 400 }}>
                Bringing Messages That Matter
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-8">
                <p>
                  Dr. Louis-Jean speaks at conferences, churches, universities, and community events. His messages are tailored to resonate with diverse audiences, addressing topics of faith, leadership, identity, and purpose.
                </p>
                <p>
                  Whether delivering a keynote address, leading a workshop, or hosting a multi-day conference, Dr. Louis-Jean brings authenticity, passion, and transformative insights that leave lasting impact.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <button className="px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-cream transition-all duration-300 text-sm font-semibold tracking-wider">
                    BOOK DR. LOUIS-JEAN
                  </button>
                </Link>
                <Link href="/services">
                  <button className="px-8 py-4 bg-transparent border-2 border-gray-400 text-gray-800 hover:border-gray-600 hover:bg-gray-50 transition-all duration-300 text-sm font-semibold tracking-wider">
                    VIEW SERVICES
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-emerald-800 to-emerald-900">
          <div className="relative container mx-auto px-6 lg:px-12 text-center">
            <h2 className="font-display text-5xl lg:text-6xl text-cream mb-8" style={{ fontWeight: 400 }}>
              Ready to Be Inspired?
            </h2>
            <p className="text-xl text-cream/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore the books, services, and messages that are transforming lives worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/books">
                <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
                  EXPLORE BOOKS
                </button>
              </Link>
              <Link href="/services">
                <button className="px-8 py-4 bg-transparent border-2 border-cream text-cream hover:bg-cream/10 transition-all duration-300 text-sm font-semibold tracking-wider">
                  VIEW SERVICES
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
