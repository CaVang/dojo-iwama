'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-washi px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Japanese character */}
        <span className="font-jp text-8xl text-japan-blue/10 block mb-6">
          迷
        </span>

        {/* 404 */}
        <h1 className="font-serif text-6xl text-japan-blue mb-4">{t('title')}</h1>

        {/* Message */}
        <h2 className="font-serif text-2xl text-sumi mb-4">{t('pathNotFound')}</h2>
        <p className="text-sumi-muted mb-8 leading-relaxed">
          {t('description')}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${locale}`} className="btn-primary inline-flex items-center gap-2">
            <Home size={18} />
            {t('returnHome')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {t('goBack')}
          </button>
        </div>

        {/* Decorative */}
        <div className="mt-12">
          <hr className="brush-divider w-24 mx-auto" />
          <p className="text-xs text-sumi-muted mt-4 tracking-wider">
            &ldquo;{t('proverb')}&rdquo;
          </p>
          <p className="text-xs text-sumi-muted font-jp mt-1">
            七転び八起き
          </p>
        </div>
      </motion.div>
    </div>
  );
}
