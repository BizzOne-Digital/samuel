import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import connectDB from '@/lib/db/mongodb';
import Book from '@/models/Book';
import BookDetailClient from './BookDetailClient';

export const dynamic = 'force-dynamic';

async function getBook(slug: string) {
  await connectDB();
  const book = await Book.findOne({ slug, isPublished: true }).lean();
  return book ? JSON.parse(JSON.stringify(book)) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    return { title: 'Book Not Found' };
  }

  return {
    title: `${book.title} | Samuel Louis-Jean Publications`,
    description: book.shortDescription,
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />

        <main className="container mx-auto px-6 lg:px-12 py-32 lg:py-40">
          <BookDetailClient book={book} />
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
