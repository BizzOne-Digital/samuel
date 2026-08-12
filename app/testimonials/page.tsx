import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import connectDB from '@/lib/db/mongodb';
import Testimonial from '@/models/Testimonial';
import Page from '@/models/Page';

export const metadata = {
  title: 'Testimonials | Samuel Louis Jean Publications',
  description: 'What people say about Dr. Samuel Louis Jean',
};

async function getPageData() {
  await connectDB();
  const page = await Page.findOne({ pageKey: 'testimonials' }).lean();
  const testimonials = await Testimonial.find({ isPublished: true }).sort({ displayOrder: 1 }).lean();
  
  return {
    page: JSON.parse(JSON.stringify(page)),
    testimonials: JSON.parse(JSON.stringify(testimonials)),
  };
}

export default async function TestimonialsPage() {
  const { page, testimonials } = await getPageData();
  const heroSection = page?.sections?.find((s: any) => s.sectionName === 'Hero');

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

        {/* Testimonials Grid */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial: any) => (
                    <div
                      key={testimonial._id}
                      className="bg-cream border-2 border-gray-200 rounded-xl p-8 hover:border-emerald-600 hover:shadow-xl transition-all duration-300"
                    >
                      <Quote className="w-12 h-12 text-gold mb-4" />
                      
                      <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="border-t-2 border-gray-200 pt-4">
                        <p className="font-semibold text-gray-900 text-lg">
                          {testimonial.personName}
                        </p>
                        {testimonial.role && (
                          <p className="text-sm text-gray-600">
                            {testimonial.role}
                            {testimonial.organization && `, ${testimonial.organization}`}
                          </p>
                        )}
                      </div>

                      {testimonial.isFeatured && (
                        <div className="mt-4">
                          <span className="inline-block px-3 py-1 bg-gold/20 text-gold-800 text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No testimonials available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-emerald-800 to-emerald-900">
          <div className="relative container mx-auto px-6 lg:px-12 text-center">
            <h2 className="font-display text-4xl lg:text-5xl text-cream mb-6" style={{ fontWeight: 400 }}>
              Experience the Transformation
            </h2>
            <p className="text-xl text-cream/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands who have been inspired by Dr. Jean's books and messages.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/books">
                <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
                  EXPLORE BOOKS
                </button>
              </a>
              <a href="/contact">
                <button className="px-8 py-4 bg-transparent border-2 border-cream text-cream hover:bg-cream/10 transition-all duration-300 text-sm font-semibold tracking-wider">
                  CONTACT US
                </button>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
