'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Check if intro has been seen in this session
    if (typeof window !== 'undefined') {
      const introSeen = sessionStorage.getItem('intro-seen');
      if (introSeen === 'true') {
        setShouldShow(false);
        onComplete();
        return;
      }
    }

    // Auto-progress through steps
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 2500),
      setTimeout(() => setStep(4), 3500),
      setTimeout(() => setStep(5), 4500),
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('intro-seen', 'true');
        }
        onComplete();
      }, 6000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    setSkipped(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('intro-seen', 'true');
    }
    onComplete();
  };

  if (!shouldShow || skipped) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-300 overflow-hidden"
      >
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-grain opacity-50" />

        {/* Content Container */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          {/* Golden Line */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-12 mx-auto w-64"
              />
            )}
          </AnimatePresence>

          {/* Author Name */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-6 tracking-tight"
              >
                Samuel Louis Jean
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Tagline */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center justify-center gap-4 text-gold-200 text-lg md:text-xl mb-8"
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Author
                </motion.span>
                <span className="text-gold">•</span>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Speaker
                </motion.span>
                <span className="text-gold">•</span>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Visionary
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Book Opening Effect */}
          <AnimatePresence>
            {step >= 4 && (
              <>
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.2 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-gold/10"
                  style={{ transformOrigin: 'center' }}
                />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.05, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-parchment-400 text-sm md:text-base tracking-widest uppercase"
                >
                  Publications
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-cream/60 hover:text-cream transition-colors duration-300 text-sm uppercase tracking-wider z-20 focus:outline-none focus:ring-2 focus:ring-gold rounded px-4 py-2"
          aria-label="Skip introduction"
        >
          Skip Intro →
        </motion.button>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bronze/5 rounded-full blur-3xl"
        />
      </motion.div>
    </AnimatePresence>
  );
}
