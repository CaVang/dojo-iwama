'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { locales, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Replace the current locale segment in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  const otherLocale = locale === 'en' ? 'vi' : 'en';

  return (
    <motion.button
      onClick={() => switchLocale(otherLocale)}
      className="px-3 py-1.5 text-sm font-serif tracking-wider border border-japan-blue/20 hover:border-japan-blue/50 hover:bg-japan-blue/5 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${otherLocale === 'en' ? 'English' : 'Vietnamese'}`}
    >
      <span className="text-sumi">{locale.toUpperCase()}</span>
    </motion.button>
  );
}
