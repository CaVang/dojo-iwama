'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const locale = useLocale();

  const footerLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/techniques`, label: t('techniqueLibrary') },
    { href: `/${locale}/dojos`, label: t('dojoDirectory') },
  ];

  return (
    <footer className="bg-japan-blue text-washi">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-washi/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border-2 border-washi/50 flex items-center justify-center">
                <span className="font-jp text-xl font-bold">合</span>
              </div>
              <div>
                <h3 className="font-serif text-xl tracking-wider">
                  Iwama Aikido
                </h3>
                <p className="text-xs tracking-[0.15em] text-washi/60 uppercase">
                  Digital Library
                </p>
              </div>
            </div>
            <p className="text-washi/70 text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.2em] mb-6 text-gold">
              {t('explore')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-washi/70 hover:text-washi transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Philosophy Quote */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.2em] mb-6 text-gold">
              {t('philosophy')}
            </h4>
            <blockquote className="text-washi/70 text-sm italic leading-relaxed">
              &ldquo;{t('quote')}&rdquo;
            </blockquote>
            <p className="mt-3 text-xs text-washi/50">
              {t('oSensei')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-washi/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-washi/50 text-xs tracking-wider">
              {t('copyright', { year: currentYear })}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-washi/30 text-xs font-jp">
                武 産 合 気
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
