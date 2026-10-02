'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Calendar, Send } from 'lucide-react';
import { bookingSchema } from '@/lib/validations';
import { z } from 'zod';

type BookingFormData = z.infer<typeof bookingSchema>;

const EVENT_TYPES = [
  'Conference',
  'Church / Worship Service',
  'Keynote / Corporate Event',
  'University / School',
  'Book Signing / Author Event',
  'Other',
];

export default function BookingClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      preferredContact: 'email',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setSubmitMessage(
          'Thank you! Your booking request has been received. We will contact you soon.'
        );
        reset({ preferredContact: 'email' });
        setTimeout(() => {
          setSubmitMessage('');
          setSubmitSuccess(false);
        }, 8000);
      } else {
        setSubmitSuccess(false);
        setSubmitMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitSuccess(false);
      setSubmitMessage('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors';

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/Conference-pic.png"
            alt="Book Dr. Louis-Jean"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-950/75" />
        </div>

        <div className="relative container mx-auto px-6 lg:px-12 py-32 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-12 bg-gold mr-4" />
            <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
              Speaking &amp; Conferences
            </span>
            <div className="h-px w-12 bg-gold ml-4" />
          </div>

          <h1
            className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight"
            style={{ fontWeight: 400 }}
          >
            Book Dr. Louis-Jean
          </h1>

          <div className="w-32 h-px bg-gold/50 mx-auto mb-8" />

          <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
            Request Dr. Louis-Jean for your next conference, church event, or speaking engagement.
            Share a few details below and our team will follow up promptly.
          </p>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-emerald-700" size={28} />
              <h2 className="font-display text-3xl text-gray-900">Booking Request</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input
                type="text"
                {...register('honeypot')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-900 mb-2 font-medium">
                    Full name *
                  </label>
                  <input id="fullName" type="text" {...register('fullName')} className={inputClass} />
                  {errors.fullName && (
                    <p className="mt-1 text-red-600 text-sm">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-900 mb-2 font-medium">
                    Email *
                  </label>
                  <input id="email" type="email" {...register('email')} className={inputClass} />
                  {errors.email && (
                    <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-900 mb-2 font-medium">
                    Phone *
                  </label>
                  <input id="phone" type="tel" {...register('phone')} className={inputClass} />
                  {errors.phone && (
                    <p className="mt-1 text-red-600 text-sm">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="organization" className="block text-gray-900 mb-2 font-medium">
                    Organization
                  </label>
                  <input
                    id="organization"
                    type="text"
                    {...register('organization')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventType" className="block text-gray-900 mb-2 font-medium">
                  Event type *
                </label>
                <select id="eventType" {...register('eventType')} className={inputClass}>
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="mt-1 text-red-600 text-sm">{errors.eventType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="eventDate" className="block text-gray-900 mb-2 font-medium">
                    Preferred date
                  </label>
                  <input id="eventDate" type="date" {...register('eventDate')} className={inputClass} />
                </div>

                <div>
                  <label htmlFor="eventLocation" className="block text-gray-900 mb-2 font-medium">
                    Event location
                  </label>
                  <input
                    id="eventLocation"
                    type="text"
                    {...register('eventLocation')}
                    className={inputClass}
                    placeholder="City, State / Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="audienceSize" className="block text-gray-900 mb-2 font-medium">
                    Expected audience size
                  </label>
                  <input
                    id="audienceSize"
                    type="text"
                    {...register('audienceSize')}
                    className={inputClass}
                    placeholder="e.g. 200–500"
                  />
                </div>

                <div>
                  <label htmlFor="budgetRange" className="block text-gray-900 mb-2 font-medium">
                    Budget range (optional)
                  </label>
                  <input
                    id="budgetRange"
                    type="text"
                    {...register('budgetRange')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventDetails" className="block text-gray-900 mb-2 font-medium">
                  Event details *
                </label>
                <textarea
                  id="eventDetails"
                  rows={5}
                  {...register('eventDetails')}
                  className={inputClass}
                  placeholder="Tell us about your event, theme, and any special requests..."
                />
                {errors.eventDetails && (
                  <p className="mt-1 text-red-600 text-sm">{errors.eventDetails.message}</p>
                )}
              </div>

              <div>
                <span className="block text-gray-900 mb-2 font-medium">Preferred contact method *</span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="radio" value="email" {...register('preferredContact')} />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="radio" value="phone" {...register('preferredContact')} />
                    Phone
                  </label>
                </div>
                {errors.preferredContact && (
                  <p className="mt-1 text-red-600 text-sm">{errors.preferredContact.message}</p>
                )}
              </div>

              {submitMessage && (
                <p
                  className={`text-sm font-medium ${submitSuccess ? 'text-emerald-700' : 'text-red-600'}`}
                >
                  {submitMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-cream rounded-lg text-sm font-semibold tracking-wider transition-all"
              >
                <Send size={18} />
                {isSubmitting ? 'Sending...' : 'Submit Booking Request'}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600 text-sm">
              Prefer email?{' '}
              <Link href="/contact" className="text-emerald-700 font-semibold hover:text-emerald-800">
                Contact us directly
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
