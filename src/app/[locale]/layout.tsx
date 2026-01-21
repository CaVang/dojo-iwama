import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: 'Iwama Aikido | Digital Library',
    template: '%s | Iwama Aikido',
  },
  description:
    'Explore the traditional teachings of Iwama style Aikido. A digital library of techniques, dojos, and the philosophy of Riai - the unity of body, sword, and staff.',
  keywords: [
    'Aikido',
    'Iwama',
    'Martial Arts',
    'Budo',
    'Takemusu Aiki',
    'Morihei Ueshiba',
    'Saito Sensei',
  ],
  authors: [{ name: 'Iwama Aikido Digital Library' }],
  openGraph: {
    type: 'website',
    siteName: 'Iwama Aikido Digital Library',
    title: 'Iwama Aikido | Digital Library',
    description:
      'Explore the traditional teachings of Iwama style Aikido through our comprehensive digital library.',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale}>
        {/* Washi paper texture overlay */}
        <div className="fixed inset-0 washi-texture pointer-events-none z-0" />

        {/* Watercolor decorative elements */}
        <div className="fixed top-0 right-0 w-96 h-96 watercolor-blob bg-japan-blue opacity-5" />
        <div className="fixed bottom-0 left-0 w-80 h-80 watercolor-blob bg-bamboo opacity-5" />

        {/* Main content */}
        <div className="relative z-10">
          <Navigation />
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
