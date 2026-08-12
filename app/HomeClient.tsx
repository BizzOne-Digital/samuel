'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Section {
  sectionName: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  image?: string;
  backgroundImage?: string;
  theme?: string;
  isVisible: boolean;
}

interface Book {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription: string;
  price: number;
  coverImage: string;
  tags?: string[];
}

function hasNewTag(tags?: string[]) {
  return tags?.some((tag) => tag.toLowerCase() === 'new') ?? false;
}

interface Testimonial {
  _id: string;
  personName: string;
  role?: string;
  organization?: string;
  quote: string;
}

interface HomeClientProps {
  heroSection?: Section;
  authorSection?: Section;
  booksSection?: Section;
  speakingSection?: Section;
  offerSection?: Section;
  testimonialsSection?: Section;
  books: Book[];
  testimonials: Testimonial[];
}

export default function HomeClient({
  heroSection,
  authorSection,
  booksSection,
  speakingSection,
  offerSection,
  testimonialsSection,
  books,
  testimonials,
}: HomeClientProps) {
  return (
    <>
      {/* Hero Section */}
      {heroSection && heroSection.isVisible && (
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={heroSection.backgroundImage || '/hero-bg.png'}
              alt="Samuel Louis Jean Publications"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-6 lg:px-12 py-32 lg:py-40">
            <div className="max-w-3xl">
              {/* Small Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center mb-8"
              >
                <div className="h-px w-12 bg-gold mr-4" />
                <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
                  {heroSection.eyebrow || 'Author • Speaker • Storyteller'}
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight"
                style={{ fontWeight: 400 }}
              >
                {heroSection.heading || 'Words That Inspire. Ideas That Transform.'}
              </motion.h1>

              {/* Decorative Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-32 h-px bg-gold/50 mb-8"
              />

              {/* Description */}
              {heroSection.body && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-2xl"
                >
                  {heroSection.body}
                </motion.p>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {heroSection.primaryCtaLabel && heroSection.primaryCtaUrl && (
                  <Link href={heroSection.primaryCtaUrl}>
                    <button className="group px-8 py-4 bg-transparent border-2 border-gold text-cream hover:bg-gold hover:text-emerald-950 transition-all duration-300 text-sm font-semibold tracking-wider flex items-center justify-center">
                      {heroSection.primaryCtaLabel}
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
                )}
                {heroSection.secondaryCtaLabel && heroSection.secondaryCtaUrl && (
                  <Link href={heroSection.secondaryCtaUrl}>
                    <button className="px-8 py-4 bg-transparent border-2 border-cream/30 text-cream hover:border-cream hover:bg-cream/10 transition-all duration-300 text-sm font-semibold tracking-wider">
                      {heroSection.secondaryCtaLabel}
                    </button>
                  </Link>
                )}
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-12 left-6 lg:left-12 flex flex-col items-center"
              >
                <div className="h-16 w-px bg-gradient-to-b from-gold to-transparent mb-3" />
                <span className="text-gold text-xs uppercase tracking-widest writing-mode-vertical transform rotate-180">
                  Scroll to Discover
                </span>
              </motion.div>
            </div>
          </div>

          {/* Decorative Icons - Floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute top-1/4 right-1/4 hidden xl:block"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gold/30 flex items-center justify-center">
              <BookOpen size={28} className="text-gold/70" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="absolute top-1/2 right-1/3 hidden xl:block"
          >
            <div className="w-14 h-14 rounded-full border-2 border-gold/20 flex items-center justify-center">
              <Users size={24} className="text-gold/50" />
            </div>
          </motion.div>
        </section>
      )}

      {/* Author Introduction */}
      {authorSection && authorSection.isVisible && (
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {authorSection.eyebrow && (
                  <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                    {authorSection.eyebrow}
                  </span>
                )}
                <h2 className="font-display text-5xl lg:text-6xl text-gray-900 mb-6" style={{ fontWeight: 400 }}>
                  {authorSection.heading || 'A Voice for Transformation'}
                </h2>
                {authorSection.body && (
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                    {authorSection.body}
                  </p>
                )}
                {authorSection.primaryCtaLabel && authorSection.primaryCtaUrl && (
                  <Link href={authorSection.primaryCtaUrl}>
                    <button className="px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-cream transition-all duration-300 text-sm font-semibold tracking-wider">
                      {authorSection.primaryCtaLabel}
                    </button>
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/about-pic.png"
                    alt="Dr. Samuel Louis Jean"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
                {/* Decorative Frame */}
                <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-gold/30 rounded-2xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="relative container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                Watch & Listen
              </span>
              <h2 className="font-display text-5xl lg:text-6xl text-cream mb-6" style={{ fontWeight: 400 }}>
                Experience the Message
              </h2>
              <p className="text-xl text-cream/90 max-w-3xl mx-auto leading-relaxed">
                Watch Dr. Samuel Louis Jean share powerful insights and transformative messages that inspire change.
              </p>
            </motion.div>

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative px-4 md:px-8"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-gold/30">
                <video
                  controls
                  poster="/hero-bg.png"
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Decorative Frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-gold/20 rounded-2xl -z-10" />
            </motion.div>

            {/* Video Description/CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-cream/80 text-lg mb-6 max-w-2xl mx-auto">
                Discover how Dr. Jean's words can inspire and transform your community, organization, or event.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/booking">
                  <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
                    BOOK DR. JEAN
                  </button>
                </Link>
                <Link href="/about">
                  <button className="px-8 py-4 bg-transparent border-2 border-cream text-cream hover:bg-cream/10 transition-all duration-300 text-sm font-semibold tracking-wider">
                    LEARN MORE
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Books Preview */}
      {booksSection && booksSection.isVisible && (
        <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="relative container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              {booksSection.eyebrow && (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-gold uppercase tracking-wider text-sm font-semibold mb-4 block"
                >
                  {booksSection.eyebrow}
                </motion.span>
              )}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-display text-display text-cream mb-6"
              >
                {booksSection.heading || 'Transformative Books'}
              </motion.h2>
              {booksSection.body && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-cream/70 max-w-2xl mx-auto"
                >
                  {booksSection.body}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {books.map((book, i) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-midnight-200 rounded-xl overflow-hidden mb-4 shadow-xl">
                    {hasNewTag(book.tags) && (
                      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                        NEW
                      </div>
                    )}
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-midnight-300/0 group-hover:bg-midnight-300/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="gold" size="sm">
                        View Book
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-cream mb-1 group-hover:text-gold transition-colors">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-gold/80 text-sm mb-2">{book.subtitle}</p>
                  )}
                  <p className="text-cream/60 text-sm mb-3 line-clamp-2">
                    {book.shortDescription}
                  </p>
                  <p className="text-gold font-bold">${(book.price / 100).toFixed(2)}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              {booksSection.primaryCtaLabel && booksSection.primaryCtaUrl && (
                <Link href={booksSection.primaryCtaUrl}>
                  <button className="px-8 py-4 bg-transparent border-2 border-cream text-cream hover:bg-cream hover:text-black transition-all duration-300 text-sm font-semibold tracking-wider inline-flex items-center">
                    {booksSection.primaryCtaLabel}
                    <svg
                      className="ml-3 w-5 h-5"
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
              )}
            </div>
          </div>
        </section>
      )}

      {/* Speaking & Conferences */}
      {speakingSection && speakingSection.isVisible && (
        <section className="relative py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1 relative"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/Conference-pic.png"
                    alt="Dr. Samuel Louis Jean Speaking at Conference"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                {speakingSection.eyebrow && (
                  <span className="text-emerald-700 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                    {speakingSection.eyebrow}
                  </span>
                )}
                <h2 className="font-display text-5xl lg:text-6xl text-gray-900 mb-6" style={{ fontWeight: 400 }}>
                  {speakingSection.heading || 'Inspire Your Audience'}
                </h2>
                {speakingSection.body && (
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                    {speakingSection.body}
                  </p>
                )}
                <ul className="space-y-4 mb-8">
                  {['Author Appearances', 'Keynote Speaking', 'Multi-Day Conferences', 'Corporate Events'].map((item) => (
                    <li key={item} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  {speakingSection.primaryCtaLabel && speakingSection.primaryCtaUrl && (
                    <Link href={speakingSection.primaryCtaUrl}>
                      <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-black transition-all duration-300 text-sm font-semibold tracking-wider">
                        {speakingSection.primaryCtaLabel}
                      </button>
                    </Link>
                  )}
                  {speakingSection.secondaryCtaLabel && speakingSection.secondaryCtaUrl && (
                    <Link href={speakingSection.secondaryCtaUrl}>
                      <button className="px-8 py-4 bg-transparent border-2 border-gray-400 text-gray-800 hover:border-gray-600 hover:bg-gray-50 transition-all duration-300 text-sm font-semibold tracking-wider">
                        {speakingSection.secondaryCtaLabel}
                      </button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Special Offer */}
      {offerSection && offerSection.isVisible && (
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-gold-700 via-gold-600 to-gold-500">
          <div className="absolute inset-0 bg-grain opacity-20" />
          <div className="relative container mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              {offerSection.eyebrow && (
                <span className="inline-block px-6 py-2 bg-black/20 rounded-full text-black text-xs uppercase tracking-[0.3em] font-semibold mb-8">
                  {offerSection.eyebrow}
                </span>
              )}
              <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-black mb-8" style={{ fontWeight: 400 }}>
                {offerSection.heading || 'Four Books for $100'}
              </h2>
              {offerSection.body && (
                <p className="text-xl lg:text-2xl text-black/80 mb-12 leading-relaxed max-w-3xl mx-auto">
                  {offerSection.body}
                </p>
              )}
              {offerSection.primaryCtaLabel && offerSection.primaryCtaUrl && (
                <Link href={offerSection.primaryCtaUrl}>
                  <button className="group px-10 py-5 bg-black text-gold hover:bg-emerald-950 transition-all duration-300 text-sm font-semibold tracking-wider inline-flex items-center rounded-sm shadow-xl hover:shadow-2xl">
                    {offerSection.primaryCtaLabel}
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
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials Preview */}
      {testimonialsSection && testimonialsSection.isVisible && (
        <section className="relative py-24 lg:py-32 bg-cream overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              {testimonialsSection.eyebrow && (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-gold-700 uppercase tracking-wider text-sm font-semibold mb-4 block"
                >
                  {testimonialsSection.eyebrow}
                </motion.span>
              )}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-display text-display text-midnight-300 mb-6"
              >
                {testimonialsSection.heading || 'Voices of Impact'}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg"
                >
                  <div className="text-gold text-4xl mb-4">"</div>
                  <p className="text-midnight-300/80 mb-6 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-semibold text-midnight-300">{testimonial.personName}</p>
                    {testimonial.role && (
                      <p className="text-sm text-midnight-300/60">
                        {testimonial.role}
                        {testimonial.organization && `, ${testimonial.organization}`}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              {testimonialsSection.primaryCtaLabel && testimonialsSection.primaryCtaUrl && (
                <Link href={testimonialsSection.primaryCtaUrl}>
                  <button className="group px-10 py-4 bg-emerald-800 hover:bg-emerald-900 text-cream transition-all duration-300 text-sm font-semibold tracking-wider inline-flex items-center rounded-sm shadow-lg hover:shadow-xl">
                    {testimonialsSection.primaryCtaLabel}
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
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
