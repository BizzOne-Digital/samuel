import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { getSettings } from '@/lib/getSettings';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact | Samuel Louis Jean Publications',
  description: 'Get in touch with us',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-cream overflow-x-hidden w-full">
        <Header />
        <ContactClient settings={settings} />
        <Footer settings={settings} />
      </div>
    </SmoothScrollProvider>
  );
}
