import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import connectDB from '@/lib/db/mongodb';
import FAQ from '@/models/FAQ';
import Page from '@/models/Page';
import FAQAccordion from './FAQAccordion';

export const metadata = {
  title: 'FAQs | Samuel Louis Jean Publications',
  description: 'Frequently asked questions about our books and services',
};

async function getPageData() {
  await connectDB();
  const page = await Page.findOne({ pageKey: 'faqs' }).lean();
  const faqs = await FAQ.find({ isPublished: true }).sort({ displayOrder: 1, category: 1 }).lean();
  
  return {
    page: JSON.parse(JSON.stringify(page)),
    faqs: JSON.parse(JSON.stringify(faqs)),
  };
}

export default async function FAQsPage() {
  const { page, faqs } = await getPageData();
  const heroSection = page?.sections?.find((s: any) => s.sectionName === 'Hero');

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc: any, faq: any) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />

        {/* Hero Section */}
        {heroSection && (
          <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={heroSection.backgroundImage || '/hero-bg.png'}
                alt={page.title}
                fill
                className="object-cover"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-950/75" />
            </div>
            
            <div className="relative container mx-auto px-6 lg:px-12 py-32 text-center">
              {heroSection.eyebrow && (
                <div className="flex items-center justify-center mb-8">
                  <div className="h-px w-12 bg-gold mr-4" />
                  <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
                    {heroSection.eyebrow}
                  </span>
                  <div className="h-px w-12 bg-gold ml-4" />
                </div>
              )}

              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight" style={{ fontWeight: 400 }}>
                {heroSection.heading || page.title}
              </h1>

              <div className="w-32 h-px bg-gold/50 mx-auto mb-8" />

              {heroSection.body && (
                <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
                  {heroSection.body}
                </p>
              )}
            </div>
          </section>
        )}

        {/* FAQs Section */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {Object.entries(faqsByCategory).map(([category, categoryFaqs]: [string, any]) => (
                <div key={category} className="mb-12">
                  <h2 className="text-3xl font-display text-gray-900 mb-6 pb-3 border-b-2 border-emerald-700">
                    {category}
                  </h2>
                  <FAQAccordion faqs={categoryFaqs} />
                </div>
              ))}

              {faqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No FAQs available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-emerald-800 to-emerald-900">
          <div className="relative container mx-auto px-6 lg:px-12 text-center">
            <h2 className="font-display text-4xl lg:text-5xl text-cream mb-6" style={{ fontWeight: 400 }}>
              Still Have Questions?
            </h2>
            <p className="text-xl text-cream/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              We are here to help. Contact us and we will get back to you as soon as possible.
            </p>
            <a href="/contact">
              <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
                CONTACT US
              </button>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
