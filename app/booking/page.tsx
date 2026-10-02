import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { getSettings } from '@/lib/getSettings';
import BookingClient from './BookingClient';

export const metadata = {
  title: 'Book Dr. Louis-Jean | Samuel Louis-Jean Publications',
  description:
    'Request Dr. Louis-Jean for conferences, speaking engagements, and church events.',
};

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
  const settings = await getSettings();

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />
        <BookingClient />
        <Footer settings={settings} />
      </div>
    </SmoothScrollProvider>
  );
}
