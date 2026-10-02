'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, ArrowLeft, BookOpen } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import {
  AmazonPurchaseLinks,
  resolveAmazonLinks,
  type AmazonLink,
} from '@/components/books/AmazonPurchaseLinks';

interface Book {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  author: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  salePrice?: number;
  isSaleActive?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  format?: string;
  category?: string;
  tags?: string[];
  pageCount?: number;
  amazonLinks?: AmazonLink[];
}

function hasNewTag(tags?: string[]) {
  return tags?.some((tag) => tag.toLowerCase() === 'new') ?? false;
}

export default function BookDetailClient({ book }: { book: Book }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const price = book.isSaleActive && book.salePrice ? book.salePrice : book.price;

  const handleAddToCart = () => {
    addItem({
      _id: book._id,
      title: book.title,
      slug: book.slug,
      price,
      coverImage: book.coverImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      <div className="relative">
        <div className="relative aspect-[3/4] max-w-md mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.coverImageAlt || book.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-gold/20 flex items-center justify-center">
              <BookOpen size={80} className="text-emerald-700" />
            </div>
          )}

          {hasNewTag(book.tags) && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase">
              NEW
            </div>
          )}
        </div>
      </div>

      <div>
        <Link
          href="/books"
          className="inline-flex items-center text-emerald-700 hover:text-emerald-900 text-sm font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Books
        </Link>

        {book.category && (
          <span className="inline-block text-emerald-700 uppercase tracking-wider text-xs font-semibold mb-3">
            {book.category}
          </span>
        )}

        <h1 className="font-display text-4xl lg:text-5xl text-gray-900 mb-3" style={{ fontWeight: 400 }}>
          {book.title}
        </h1>

        {book.subtitle && (
          <p className="text-gold-700 text-lg mb-2">{book.subtitle}</p>
        )}

        <p className="text-gray-600 mb-6">by {book.author}</p>

        {book.format && (
          <p className="text-sm text-gray-500 mb-4">{book.format}</p>
        )}

        <div className="flex items-center gap-3 mb-6">
          {book.isSaleActive && book.salePrice ? (
            <>
              <span className="text-3xl font-bold text-emerald-700">{formatPrice(book.salePrice)}</span>
              <span className="text-xl text-gray-400 line-through">{formatPrice(book.price)}</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-emerald-700">{formatPrice(book.price)}</span>
          )}
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          {book.shortDescription}
        </p>

        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Purchase on Amazon
          </p>
          <AmazonPurchaseLinks links={resolveAmazonLinks(book.amazonLinks)} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-sm font-semibold tracking-wider transition-all duration-300 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-gold hover:bg-gold-600 text-black'
            }`}
          >
            {added ? (
              <>
                <Check size={20} />
                ADDED TO CART
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                ADD TO CART
              </>
            )}
          </button>

          <Link href="/cart">
            <button className="w-full sm:w-auto px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-cream rounded-lg text-sm font-semibold tracking-wider transition-all duration-300">
              VIEW CART
            </button>
          </Link>
        </div>

        {book.fullDescription && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="font-display text-2xl text-gray-900 mb-4" style={{ fontWeight: 400 }}>
              About This Book
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {book.fullDescription}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
