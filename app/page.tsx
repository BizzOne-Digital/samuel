import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import connectDB from '@/lib/db/mongodb';
import Page from '@/models/Page';
import Book from '@/models/Book';
import Testimonial from '@/models/Testimonial';
import { getSettings } from '@/lib/getSettings';
import HomeClient from './HomeClient';
import {
  normalizePageSection,
  normalizeTestimonialQuote,
} from '@/lib/normalize-honoree-text';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  await connectDB();
  const page = await Page.findOne({ pageKey: 'home' }).lean();
  const books = await Book.find({ isPublished: true, isFeatured: true }).sort({ displayOrder: 1 }).limit(3).lean();
  const testimonials = await Testimonial.find({ isPublished: true, isFeatured: true }).sort({ displayOrder: 1 }).limit(7).lean();
  const settings = await getSettings();
  
  return {
    page: JSON.parse(JSON.stringify(page)),
    books: JSON.parse(JSON.stringify(books)),
    testimonials: JSON.parse(JSON.stringify(testimonials)),
    settings,
  };
}

export default async function Home() {
  const { page, books, testimonials, settings } = await getHomeData();
  const sections = page?.sections || [];
  
  // Get sections by name for easier access
  const heroSection = normalizePageSection(
    sections.find((s: any) => s.sectionName === 'Hero')
  );
  const authorSection = normalizePageSection(
    sections.find((s: any) => s.sectionName === 'Author Introduction')
  );
  const booksSection = normalizePageSection(
    sections.find((s: any) => s.sectionName === 'Featured Books')
  );
  const speakingSection = normalizePageSection(
    sections.find((s: any) => s.sectionName === 'Speaking & Conferences')
  );
  const offerSection = normalizePageSection(
    sections.find((s: any) => s.sectionName === 'Special Offer')
  );
  const testimonialsSection = normalizePageSection(
    sections.find((s: any) => s.sectionName === 'Testimonials Preview')
  );
  const normalizedTestimonials = testimonials.map((t: { quote?: string }) =>
    normalizeTestimonialQuote(t)
  );

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />
        
        <HomeClient 
          heroSection={heroSection}
          authorSection={authorSection}
          booksSection={booksSection}
          speakingSection={speakingSection}
          offerSection={offerSection}
          testimonialsSection={testimonialsSection}
          books={books}
          testimonials={normalizedTestimonials}
        />

        <Footer settings={settings} />
      </div>
    </SmoothScrollProvider>
  );
}
