import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GalleryGrid from './GalleryGrid';

export const metadata = {
  title: 'Gallery | Samuel Louis Jean Publications',
  description: 'Photo gallery of events, conferences, and moments',
};

// Generate list of gallery images
const galleryImages = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,
  src: `/gallery/gallery-${i + 1}.jpeg`,
  alt: `Gallery image ${i + 1}`,
}));

export default function GalleryPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.png"
              alt="Gallery"
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
                Photo Gallery
              </span>
              <div className="h-px w-12 bg-gold ml-4" />
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight" style={{ fontWeight: 400 }}>
              Capturing Moments
              <br />
              <span className="text-gold">That Inspire</span>
            </h1>

            {/* Decorative Divider */}
            <div className="w-32 h-px bg-gold/50 mx-auto mb-8" />

            {/* Description */}
            <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              A visual journey through conferences, events, and special moments that have shaped our ministry and community.
            </p>

            {/* CTA Button */}
            <a href="#gallery-collection">
              <button className="group px-8 py-4 bg-transparent border-2 border-gold text-cream hover:bg-gold hover:text-emerald-950 transition-all duration-300 text-sm font-semibold tracking-wider flex items-center justify-center mx-auto">
                EXPLORE GALLERY
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

        {/* Gallery Grid Section */}
        <section id="gallery-collection" className="relative py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12 text-center">
              <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2 block">
                Photo Collection
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-gray-900 mb-4" style={{ fontWeight: 400 }}>
                Gallery
              </h2>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                Moments from conferences, book launches, and ministry events
              </p>
            </div>

            <GalleryGrid images={galleryImages} />
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
