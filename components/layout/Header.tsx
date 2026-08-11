'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

const navigation = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'BOOKS', href: '/books' },
  { name: 'PRICING', href: '/pricing' },
  { name: 'CONTACT', href: '/contact' },
];

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'fr', name: 'FR' },
  { code: 'ht', name: 'HT' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-4'
        )}
      >
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group relative z-50"
            >
              <div className="relative h-20 w-20 lg:h-24 lg:w-24">
                <Image
                  src="/logo.png"
                  alt="Samuel Louis Jean Publications"
                  fill
                  sizes="(max-width: 1024px) 80px, 96px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-semibold tracking-wider transition-colors duration-200 relative group',
                    isScrolled
                      ? pathname === item.href
                        ? 'text-emerald-800'
                        : 'text-gray-800 hover:text-emerald-700'
                      : pathname === item.href
                        ? 'text-gold'
                        : 'text-cream hover:text-gold'
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 w-full h-0.5 transform origin-left transition-transform duration-300',
                      isScrolled ? 'bg-emerald-700' : 'bg-gold',
                      pathname === item.href
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Language Selector */}
              <div className="hidden lg:block relative group">
                <button
                  className={cn(
                    'flex items-center space-x-1 text-sm font-semibold uppercase transition-colors',
                    isScrolled
                      ? 'text-gray-800 hover:text-emerald-700'
                      : 'text-cream hover:text-gold'
                  )}
                >
                  <Globe size={16} />
                  <span>{currentLang.toUpperCase()}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute top-full right-0 mt-2 bg-cream rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden min-w-[80px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setCurrentLang(lang.code)}
                      className={cn(
                        'block w-full text-center px-4 py-2 text-sm font-semibold transition-colors',
                        currentLang === lang.code
                          ? 'bg-emerald-700 text-cream'
                          : 'text-gray-800 hover:bg-emerald-50'
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  'relative p-2 transition-colors hidden lg:block',
                  isScrolled
                    ? 'text-gray-800 hover:text-emerald-700'
                    : 'text-cream hover:text-gold'
                )}
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center text-xs text-cream font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Primary CTA */}
              <div className="hidden lg:block">
                <Link href="/booking">
                  <button className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-cream text-sm font-semibold tracking-wider transition-all duration-300 rounded">
                    BOOK A CONFERENCE
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden p-2 transition-colors relative z-50',
                  isScrolled || isMobileMenuOpen
                    ? 'text-gray-800 hover:text-emerald-700'
                    : 'text-cream hover:text-gold'
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-cream z-40 lg:hidden overflow-y-auto"
            >
              <div className="pt-24 pb-8 px-6">
                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-4 py-3 rounded-lg text-base font-semibold tracking-wider transition-colors',
                          pathname === item.href
                            ? 'bg-emerald-700 text-cream'
                            : 'text-gray-800 hover:bg-emerald-50'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Language Selector Mobile */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-3 px-4">
                    Language
                  </p>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLang(lang.code)}
                        className={cn(
                          'block w-full text-left px-4 py-2 rounded-lg transition-colors font-semibold',
                          currentLang === lang.code
                            ? 'bg-emerald-700 text-cream'
                            : 'text-gray-800 hover:bg-emerald-50'
                        )}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="mt-8">
                  <Link href="/booking">
                    <button className="w-full px-6 py-4 bg-emerald-800 hover:bg-emerald-900 text-cream text-sm font-semibold tracking-wider transition-all duration-300 rounded-lg">
                      BOOK A CONFERENCE
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
