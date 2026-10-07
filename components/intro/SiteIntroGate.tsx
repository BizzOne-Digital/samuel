'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  INTRO_YOUTUBE_VIDEO_ID,
  SITE_ENTERED_SESSION_KEY,
} from '@/lib/constants';

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: Record<string, unknown>
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existing) {
      const waitForApi = () => {
        if (window.YT?.Player) resolve();
        else window.setTimeout(waitForApi, 50);
      };
      waitForApi();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  });
}

export default function SiteIntroGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  const [hasEntered, setHasEntered] = useState(isAdmin);
  const [showOverlay, setShowOverlay] = useState(!isAdmin);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pendingPlayRef = useRef(false);

  const playMusic = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      pendingPlayRef.current = false;
    } else {
      pendingPlayRef.current = true;
    }
  }, []);

  const initPlayer = useCallback(() => {
    if (!playerHostRef.current || playerRef.current || !window.YT?.Player) return;

    playerRef.current = new window.YT.Player(playerHostRef.current, {
      height: '1',
      width: '1',
      videoId: INTRO_YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: INTRO_YOUTUBE_VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
      events: {
        onReady: () => {
          if (pendingPlayRef.current) {
            playerRef.current?.playVideo();
            pendingPlayRef.current = false;
          }
        },
      },
    });
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    const entered = sessionStorage.getItem(SITE_ENTERED_SESSION_KEY) === 'true';
    if (entered) {
      setHasEntered(true);
      setShowOverlay(false);
      pendingPlayRef.current = true;
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;

    let cancelled = false;

    loadYouTubeIframeApi().then(() => {
      if (!cancelled) initPlayer();
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isAdmin, initPlayer]);

  useEffect(() => {
    if (isAdmin || !hasEntered) return;
    playMusic();
  }, [hasEntered, isAdmin, playMusic]);

  const handleEnter = () => {
    sessionStorage.setItem(SITE_ENTERED_SESSION_KEY, 'true');
    setHasEntered(true);
    playMusic();
    setShowOverlay(false);
  };

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className="fixed -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <div ref={playerHostRef} />
      </div>

      {children}

      <AnimatePresence>
        {showOverlay && (
          <motion.button
            type="button"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            onClick={handleEnter}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight-300 cursor-pointer border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-300"
            aria-label="Tap to enter the website and play background music"
          >
            <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 text-center px-6 max-w-2xl"
            >
              <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-10 mx-auto w-48" />
              <p className="text-gold text-sm uppercase tracking-[0.35em] font-semibold mb-4">
                Samuel Louis-Jean Publications
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-cream mb-6 tracking-tight">
                Words That Inspire
              </h1>
              <p className="text-cream/70 text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
                Tap to enter the site. Background music will begin automatically.
              </p>
              <motion.span
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block px-10 py-4 bg-gold text-black text-sm font-semibold tracking-[0.25em] uppercase rounded-sm shadow-lg"
              >
                Tap to Enter
              </motion.span>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/3 left-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
