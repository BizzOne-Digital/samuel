'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { contactSchema } from '@/lib/validations';

interface ContactClientProps {
  settings?: {
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const contact = settings?.contact || {
    email: 'dr.louisjean@yahoo.com',
    phone: '904-444-3061',
    address: '922 Blanding Blvd',
    city: 'Orange Park',
    state: 'FL',
    zip: '32065',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setSubmitMessage('Thank you for your message! We will get back to you soon.');
        reset();
        setTimeout(() => {
          setSubmitMessage('');
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitSuccess(false);
        setSubmitMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitSuccess(false);
      setSubmitMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Emerald Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-950/75" />
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-12 py-32 text-center">
          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-12 bg-gold mr-4" />
            <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
              Let's Connect
            </span>
            <div className="h-px w-12 bg-gold ml-4" />
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream mb-8 leading-tight" style={{ fontWeight: 400 }}>
            Get in Touch
          </h1>

          {/* Decorative Divider */}
          <div className="w-32 h-px bg-gold/50 mx-auto mb-8" />

          {/* Description */}
          <p className="text-cream/90 text-lg lg:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Reach out to us for inquiries about books, speaking engagements, or general questions.
              </p>

              <div className="space-y-6">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-700 group-hover:border-emerald-700 transition-all">
                    <Mail className="text-emerald-700 group-hover:text-cream transition-colors" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Email</h3>
                    <p className="text-emerald-700 hover:text-emerald-800 transition-colors">
                      {contact.email}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${contact.phone?.replace(/\D/g, '')}`}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-700 group-hover:border-emerald-700 transition-all">
                    <Phone className="text-emerald-700 group-hover:text-cream transition-colors" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Phone</h3>
                    <p className="text-emerald-700 hover:text-emerald-800 transition-colors">
                      {contact.phone}
                    </p>
                  </div>
                </a>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-emerald-700" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Address</h3>
                    <p className="text-gray-700">
                      {contact.address}<br />
                      {contact.city}, {contact.state} {contact.zip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <h3 className="font-display text-xl text-gray-900 mb-4">Looking for something specific?</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/booking" className="text-emerald-700 hover:text-emerald-800 transition-colors flex items-center font-semibold">
                      → Book a speaking engagement
                    </a>
                  </li>
                  <li>
                    <a href="/books" className="text-emerald-700 hover:text-emerald-800 transition-colors flex items-center font-semibold">
                      → Browse our books
                    </a>
                  </li>
                  <li>
                    <a href="/faqs" className="text-emerald-700 hover:text-emerald-800 transition-colors flex items-center font-semibold">
                      → Read FAQs
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 lg:p-10">
                <h2 className="font-display text-3xl text-gray-900 mb-6">Send Us a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot */}
                  <input
                    type="text"
                    {...register('honeypot')}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label htmlFor="name" className="block text-gray-900 mb-2 font-medium">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-600 text-sm">{errors.name.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-900 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-600 text-sm">{errors.email.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-900 mb-2 font-medium">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-900 mb-2 font-medium">
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      {...register('subject')}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      placeholder="What is this regarding?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-red-600 text-sm">{errors.subject.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-900 mb-2 font-medium">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-red-600 text-sm">{errors.message.message as string}</p>
                    )}
                  </div>

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-lg ${
                        submitSuccess
                          ? 'bg-emerald-100 border-2 border-emerald-600 text-emerald-800'
                          : 'bg-red-100 border-2 border-red-500 text-red-800'
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-cream transition-all duration-300 text-sm font-semibold tracking-wider rounded-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      'SENDING...'
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
