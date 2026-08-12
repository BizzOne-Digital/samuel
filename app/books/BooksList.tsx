'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn, formatPrice } from '@/lib/utils';

interface Book {
  _id: string;
  title: string;
  slug: string;
  author: string;
  subtitle?: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  isSaleActive?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  isFeatured: boolean;
  tags?: string[];
}

function hasNewTag(tags?: string[]) {
  return tags?.some((tag) => tag.toLowerCase() === 'new') ?? false;
}

function BookCard({ book }: { book: Book }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const price = book.isSaleActive && book.salePrice ? book.salePrice : book.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: book._id,
      title: book.title,
      slug: book.slug,
      price: book.price,
      coverImage: book.coverImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group">
      <Link href={`/books/${book.slug}`}>
        <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-lg border border-gray-200">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.coverImageAlt || book.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-gold/20 flex items-center justify-center">
              <BookOpen size={64} className="text-emerald-700" />
            </div>
          )}
          
          {book.isSaleActive && book.salePrice && (
            <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
              SALE
            </div>
          )}
          
          {hasNewTag(book.tags) && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              NEW
            </div>
          )}

          {book.isFeatured && (
            <div className={cn(
              "absolute left-4 bg-emerald-700 text-cream px-3 py-1 rounded-full text-sm font-bold",
              hasNewTag(book.tags) ? "top-14" : "top-4"
            )}>
              Featured
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="px-6 py-3 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
              VIEW DETAILS
            </button>
          </div>
        </div>
      </Link>
      
      <div className="space-y-2">
        <Link href={`/books/${book.slug}`}>
          <h3 className="font-display text-xl text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>
        
        {book.subtitle && (
          <p className="text-gray-600 text-sm line-clamp-1">{book.subtitle}</p>
        )}
        
        <p className="text-gray-700 text-sm line-clamp-2">{book.shortDescription}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {book.isSaleActive && book.salePrice ? (
              <>
                <span className="text-emerald-700 font-bold text-lg">{formatPrice(book.salePrice)}</span>
                <span className="text-gray-400 line-through text-sm">{formatPrice(book.price)}</span>
              </>
            ) : (
              <span className="text-emerald-700 font-bold text-lg">{formatPrice(book.price)}</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className={cn(
              "p-2 border rounded-lg transition-all duration-300",
              added
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-gold/10 hover:bg-gold text-gold hover:text-black border-gold/30 hover:border-gold"
            )}
            aria-label="Add to cart"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BooksList({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No books available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}
