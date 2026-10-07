'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/cart-context';
import SiteIntroGate from '@/components/intro/SiteIntroGate';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <SiteIntroGate>{children}</SiteIntroGate>
      </CartProvider>
    </SessionProvider>
  );
}
