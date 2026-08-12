import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { BookOpen } from 'lucide-react';
import connectDB from '@/lib/db/mongodb';
import Book from '@/models/Book';
import BooksList from './BooksList';

export const metadata = {
  title: 'Books | Samuel Louis Jean Publications',
  description: 'Explore transformative books by Dr. Samuel Louis Jean',
};

async function getBooks() {
  await connectDB();
  const books = await Book.find({ isPublished: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
  
  return JSON.parse(JSON.stringify(books));
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.png"
              alt="Books by Dr. Samuel Louis Jean"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            {/* Emerald Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/80 to-emerald-950/60" />
          </div>
          
          <div className="relative container mx-auto px-6 lg:px-12 py-32 text-center">
            {/* Decorative Line */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-12 bg-gold mr-4" />
              <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
                Publications
              </span>
              <div className="h-px w-12 bg-gold ml-4" />
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight" style={{ fontWeight: 400 }}>
              Transformative Books
              <br />
              <span className="text-gold">That Inspire Change</span>
            </h1>

            {/* Decorative Divider */}
            <div className="w-32 h-px bg-gold/50 mx-auto mb-8" />

            {/* Description */}
            <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              Explore a collection of thought-provoking publications designed to inspire, challenge, and empower readers to reach their full potential.
            </p>

            {/* CTA Button */}
            <a href="#books-collection">
              <button className="group px-8 py-4 bg-transparent border-2 border-gold text-cream hover:bg-gold hover:text-emerald-950 transition-all duration-300 text-sm font-semibold tracking-wider flex items-center justify-center mx-auto">
                EXPLORE COLLECTION
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </a>
          </div>
        </section>

        {/* All Books Section */}
        <section id="books-collection" className="relative py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2 block">
                Complete Collection
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-gray-900 mb-4" style={{ fontWeight: 400 }}>All Books</h2>
              <p className="text-gray-700 text-lg">
                {books.length} {books.length === 1 ? 'book' : 'books'} available
              </p>
            </div>

            <BooksList books={books} />
          </div>
        </section>

        {/* Special Offer CTA */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-emerald-800 to-emerald-900">
          <div className="relative container mx-auto px-6 lg:px-12 text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-12 bg-gold mr-4" />
              <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
                Special Offer
              </span>
              <div className="h-px w-12 bg-gold ml-4" />
            </div>
            <h2 className="font-display text-5xl lg:text-6xl text-cream mb-6" style={{ fontWeight: 400 }}>
              Save with Our Bundle Offer
            </h2>
            <p className="text-xl text-cream/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Purchase all four books for just $100 plus shipping—a perfect way to experience the full breadth of Dr. Louis-Jean&apos;s transformative work.
            </p>
            <Link href="/pricing">
              <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
                VIEW PRICING OPTIONS
              </button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
