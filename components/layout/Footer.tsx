'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const footerLinks = {
  explore: [
    { name: 'About', href: '/about' },
    { name: 'Books', href: '/books' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
  ],
  resources: [
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Support', href: '/support' },
  ],
  connect: [
    { name: 'Booking', href: '/booking' },
    { name: 'Contact', href: '/contact' },
    { name: 'Pricing', href: '/pricing' },
  ],
};

interface FooterProps {
  settings?: {
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    footer?: {
      description?: string;
      copyrightText?: string;
      newsletterText?: string;
    };
    social?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const contact = settings?.contact || {
    email: 'dr.louisjean@yahoo.com',
    phone: '904-444-3061',
    address: '922 Blanding Blvd',
    city: 'Orange Park',
    state: 'FL',
    zip: '32065',
  };

  const footer = settings?.footer || {
    description: 'Inspiring meaningful growth through powerful words and transformative ideas.',
    copyrightText: '© 2026 Samuel Louis Jean Publications. All rights reserved.',
    newsletterText: 'Stay updated with the latest books, events, and inspiring messages.',
  };

  const social = settings?.social || {};

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: social.facebook || '#' },
    { name: 'Instagram', icon: Instagram, href: social.instagram || '#' },
    { name: 'YouTube', icon: Youtube, href: social.youtube || '#' },
    { name: 'LinkedIn', icon: Linkedin, href: social.linkedin || '#' },
    { name: 'Twitter', icon: Twitter, href: social.twitter || '#' },
  ].filter(link => link.href && link.href !== '#');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-black text-cream overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/footer-bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
          quality={100}
        />
      </div>

      <div className="relative container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-8">
          {/* Brand Column with Logo */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-32 w-32 lg:h-40 lg:w-40">
                <Image
                  src="/logo.png"
                  alt="Samuel Louis Jean Publications"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 128px, 160px"
                />
              </div>
            </Link>
            <p className="text-cream/70 mb-6 leading-relaxed">
              {footer.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center space-x-3 text-cream/70 hover:text-gold transition-colors group"
              >
                <Mail size={16} className="flex-shrink-0" />
                <span className="group-hover:underline">{contact.email}</span>
              </a>
              <a
                href={`tel:${contact.phone?.replace(/\D/g, '')}`}
                className="flex items-center space-x-3 text-cream/70 hover:text-gold transition-colors group"
              >
                <Phone size={16} className="flex-shrink-0" />
                <span className="group-hover:underline">{contact.phone}</span>
              </a>
              <div className="flex items-start space-x-3 text-cream/70">
                <MapPin size={16} className="flex-shrink-0 mt-1" />
                <span>
                  {contact.address}<br />
                  {contact.city}, {contact.state} {contact.zip}
                </span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg mb-4 text-gold">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg mb-4 text-gold">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg mb-4 text-gold">Connect</h3>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg mb-4 text-gold">Stay Updated</h3>
            <p className="text-cream/70 text-sm mb-4">
              {footer.newsletterText}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-2 bg-midnight-200 border border-cream/20 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gold text-midnight-300 rounded-lg font-medium hover:bg-gold-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message && (
                <p className={`text-sm ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="border-t border-cream/10 pt-8 mb-8">
            <div className="flex justify-center space-x-6">
              {socialLinks.map((socialLink) => {
                const Icon = socialLink.icon;
                return (
                  <motion.a
                    key={socialLink.name}
                    href={socialLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-cream/5 border border-cream/20 flex items-center justify-center text-cream/70 hover:text-gold hover:border-gold transition-colors"
                    aria-label={socialLink.name}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-cream/60">
          <p>{footer.copyrightText}</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cream transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
