'use client';

import { useCallback, useEffect, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  _id: string;
  personName: string;
  role?: string;
  organization?: string;
  quote: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlayMs?: number;
  variant?: 'light' | 'dark';
}

export default function TestimonialsCarousel({
  testimonials,
  autoPlayMs = 6000,
  variant = 'light',
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(goNext, autoPlayMs);
    return () => clearInterval(timer);
  }, [activeIndex, autoPlayMs, goNext, isPaused, total]);

  if (total === 0) return null;

  const isDark = variant === 'dark';
  const current = testimonials[activeIndex];
  const isLast = activeIndex === total - 1;

  return (
    <div
      className="relative max-w-xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={cn(
          'relative rounded-xl border-2 p-6 sm:p-7 min-h-[220px] max-h-[320px] flex flex-col transition-all duration-300',
          isDark
            ? 'bg-white border-gray-200 shadow-lg'
            : 'bg-cream border-gray-200 hover:border-emerald-600 hover:shadow-lg'
        )}
      >
        <Quote className="w-8 h-8 text-gold mb-3 flex-shrink-0" />

        <p
          key={current._id}
          className={cn(
            'text-sm sm:text-base leading-relaxed flex-1 overflow-y-auto pr-1 animate-fade-in',
            isDark ? 'text-midnight-300/85' : 'text-gray-700'
          )}
        >
          {current.quote}
        </p>

        {(isLast || total === 1) && (
          <div className={cn('border-t pt-4 mt-4 flex-shrink-0', isDark ? 'border-gray-200' : 'border-gray-200')}>
            <p className={cn('font-semibold text-sm', isDark ? 'text-midnight-300' : 'text-gray-900')}>
              {current.personName}
            </p>
            {current.role && (
              <p className={cn('text-xs mt-0.5', isDark ? 'text-midnight-300/60' : 'text-gray-600')}>
                {current.role}
                {current.organization && `, ${current.organization}`}
              </p>
            )}
          </div>
        )}
      </div>

      {total > 1 && (
        <>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={goPrev}
              className={cn(
                'p-2 rounded-full border transition-colors',
                isDark
                  ? 'border-gray-300 text-midnight-300 hover:bg-emerald-800 hover:text-cream hover:border-emerald-800'
                  : 'border-gray-300 text-gray-600 hover:bg-emerald-700 hover:text-cream hover:border-emerald-700'
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === activeIndex
                      ? 'w-6 h-2 bg-gold'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className={cn(
                'p-2 rounded-full border transition-colors',
                isDark
                  ? 'border-gray-300 text-midnight-300 hover:bg-emerald-800 hover:text-cream hover:border-emerald-800'
                  : 'border-gray-300 text-gray-600 hover:bg-emerald-700 hover:text-cream hover:border-emerald-700'
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <p className={cn('text-center text-xs mt-3', isDark ? 'text-midnight-300/50' : 'text-gray-500')}>
            {activeIndex + 1} / {total}
          </p>
        </>
      )}
    </div>
  );
}
