'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sword, Users, BookOpen } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import DojoEntrance from '@/components/ui/DojoEntrance';
import {
  EnsoCircle,
  SeigaihaPattern,
  AsanohaPattern,
  TatamiPattern,
  BrushReveal,
} from '@/components/ui/JapaneseElements';
import techniques from '@/data/techniques.json';
import dojos from '@/data/dojos.json';

// Animated Section Component
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Technique Card with dramatic hover
function TechniqueCard({
  technique,
  index,
  locale,
  studyLabel,
}: {
  technique: (typeof techniques)[0];
  index: number;
  locale: string;
  studyLabel: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link href={`/${locale}/techniques/${technique.slug}`} className="block group">
        <motion.div
          className="relative bg-washi-cream overflow-hidden border border-japan-blue/10"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image/Visual Area */}
          <div className="aspect-[4/3] bg-gradient-to-br from-japan-blue/15 via-japan-blue/10 to-transparent relative overflow-hidden">
            {/* Decorative frame */}
            <div className="absolute inset-3 border border-japan-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Large Japanese character background */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-jp text-8xl text-japan-blue/10 group-hover:text-japan-blue/20 transition-colors duration-500">
                {technique.name_jp}
              </span>
            </motion.div>

            {/* Category badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-japan-blue text-washi text-xs px-3 py-1.5 uppercase tracking-wider font-serif">
                {technique.category}
              </span>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-2 right-2 w-6 h-6 border-r border-t border-cinnabar/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b border-cinnabar/30 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-japan-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-6 relative">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <h3 className="font-serif text-xl text-sumi group-hover:text-japan-blue transition-colors">
                {technique.name_en}
              </h3>
              <span className="font-jp text-lg text-japan-blue/40">
                {technique.name_jp}
              </span>
            </div>

            <p className="text-sm text-sumi-muted line-clamp-2 mb-4">
              {technique.description}
            </p>

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-4 border-t border-japan-blue/10">
              <span
                className={`text-xs px-2 py-1 uppercase tracking-wider ${
                  technique.difficulty === 'Beginner'
                    ? 'bg-bamboo/10 text-bamboo'
                    : technique.difficulty === 'Intermediate'
                    ? 'bg-gold/10 text-gold'
                    : 'bg-cinnabar/10 text-cinnabar'
                }`}
              >
                {technique.difficulty}
              </span>

              <motion.div
                className="flex items-center gap-1 text-japan-blue text-sm font-serif"
                whileHover={{ x: 4 }}
              >
                <span>{studyLabel}</span>
                <ArrowRight size={14} />
              </motion.div>
            </div>

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-japan-blue"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('home');
  const locale = useLocale();

  // Get featured techniques (one from each category)
  const featuredTechniques = [
    techniques.find((t) => t.category === 'Taijutsu'),
    techniques.find((t) => t.category === 'Aiki-Ken'),
    techniques.find((t) => t.category === 'Aiki-Jo'),
  ].filter(Boolean) as (typeof techniques)[0][];

  return (
    <div className="bg-washi">
      {/* Dojo Entrance Animation */}
      <DojoEntrance />

      {/* Main Content */}
      <div ref={contentRef}>
        {/* Philosophy Section - Riai */}
        <section className="py-24 md:py-32 relative">
          <TatamiPattern className="opacity-40" />
          <AsanohaPattern className="absolute inset-0 text-japan-blue" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text Content */}
              <AnimatedSection>
                <motion.span
                  className="text-cinnabar text-sm uppercase tracking-[0.3em] font-serif"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {t('philosophy')}
                </motion.span>

                <BrushReveal delay={0.3}>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-sumi mt-4 mb-8">
                    {t('principleOf')}{' '}
                    <span className="text-japan-blue">{t('riai')}</span>
                  </h2>
                </BrushReveal>

                <div className="space-y-6 text-sumi-light leading-relaxed text-lg">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="font-jp text-2xl text-japan-blue/30 float-left mr-3 mt-1">
                      理
                    </span>
                    {t('riaiDescription1')}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    {t('riaiDescription2')}
                  </motion.p>
                </div>

                {/* Decorative seal */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, rotate: -10 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, type: 'spring' }}
                >
                  <div className="seal-stamp inline-block text-lg">
                    <span>理合</span>
                  </div>
                </motion.div>
              </AnimatedSection>

              {/* Three Pillars Visual */}
              <div className="relative">
                {/* Background Enso */}
                <div className="absolute -top-10 -right-10 opacity-30">
                  <EnsoCircle size={300} className="text-japan-blue" delay={0.5} />
                </div>

                <div className="grid grid-cols-3 gap-4 relative z-10">
                  {[
                    { icon: Users, title: '体術', subtitle: t('taijutsu'), desc: t('bodyArts') },
                    { icon: Sword, title: '剣', subtitle: t('ken'), desc: t('sword') },
                    { icon: BookOpen, title: '杖', subtitle: t('jo'), desc: t('staff') },
                  ].map((item, index) => (
                    <motion.div
                      key={item.subtitle}
                      initial={{ opacity: 0, y: 50, rotateY: -20 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="relative"
                    >
                      <div className="bg-washi-cream p-6 text-center border border-japan-blue/10 group hover:border-japan-blue/30 transition-all duration-300">
                        {/* Icon */}
                        {/*<motion.div*/}
                        {/*  className="w-14 h-14 mx-auto mb-4 rounded-full bg-japan-blue/5 flex items-center justify-center group-hover:bg-japan-blue/10 transition-colors"*/}
                        {/*  whileHover={{ rotate: 360 }}*/}
                        {/*  transition={{ duration: 0.6 }}*/}
                        {/*>*/}
                        {/*  <item.icon className="w-6 h-6 text-japan-blue" />*/}
                        {/*</motion.div>*/}

                        {/* Japanese title */}
                        <motion.span
                          className="font-jp text-3xl text-japan-blue block mb-2"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.title}
                        </motion.span>

                        <h3 className="font-serif text-sm uppercase tracking-wider text-sumi">
                          {item.subtitle}
                        </h3>
                        <p className="text-xs text-sumi-muted mt-1">{item.desc}</p>

                        {/* Hover line */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-japan-blue"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Connecting circle */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-dashed border-japan-blue/20 rounded-full -z-10"
                  initial={{ scale: 0, rotate: 0 }}
                  whileInView={{ scale: 1, rotate: 360 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Techniques */}
        <section className="py-24 md:py-32 relative bg-washi-cream">
          <SeigaihaPattern className="absolute inset-0 text-japan-blue opacity-30" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <motion.span
                className="font-jp text-3xl text-japan-blue/20 block mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                技
              </motion.span>

              <BrushReveal>
                <h2 className="font-serif text-4xl md:text-5xl text-sumi">
                  {t('featuredTechniques')}
                </h2>
              </BrushReveal>

              <motion.p
                className="text-sumi-muted mt-4 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {t('exploreFoundational')}
              </motion.p>

              <motion.div
                className="mt-8 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-japan-blue/40 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredTechniques.map((technique, index) => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  index={index}
                  locale={locale}
                  studyLabel={t('study')}
                />
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={`/${locale}/techniques`}
                  className="btn-outline inline-flex items-center gap-2"
                >
                  {t('viewAllTechniques')}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Dojo Section */}
        <section className="py-24 md:py-32 relative">
          <TatamiPattern className="opacity-30" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <span className="font-jp text-3xl text-japan-blue/20 block mb-4">
                道場
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-sumi">
                {t('globalDojoNetwork')}
              </h2>
              <p className="text-sumi-muted mt-4 max-w-2xl mx-auto">
                {t('connectWithDojos')}
              </p>
            </AnimatedSection>

            {/* Dojo Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {dojos.slice(0, 3).map((dojo, index) => (
                <motion.div
                  key={dojo.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-washi-cream h-full border border-japan-blue/10 hover:border-japan-blue/30 transition-colors overflow-hidden group">
                    {/* Header image placeholder */}
                    <div className="h-40 bg-gradient-to-br from-japan-blue/20 to-bamboo/10 relative">
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Users className="w-16 h-16 text-japan-blue/20" />
                      </motion.div>

                      {/* Corner decoration */}
                      <div className="absolute top-2 right-2 w-8 h-8 border-r border-t border-washi/30" />
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-lg text-sumi mb-2 line-clamp-1 group-hover:text-japan-blue transition-colors">
                        {dojo.name}
                      </h3>
                      <p className="text-sm text-japan-blue/60 mb-3">
                        {dojo.chief_instructor}
                      </p>
                      <p className="text-xs text-sumi-muted line-clamp-2">
                        {dojo.address}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href={`/${locale}/dojos`} className="btn-primary inline-flex items-center gap-2">
                {t('exploreAllDojos')}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 md:py-32 bg-japan-blue relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 text-washi/5">
            <SeigaihaPattern />
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <EnsoCircle size={500} className="text-washi" delay={0.3} />
          </motion.div>

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Large decorative kanji */}
              <motion.span
                className="font-jp text-8xl text-washi/10 block mb-8"
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                道
              </motion.span>

              <motion.blockquote
                className="font-serif text-2xl md:text-4xl lg:text-5xl text-washi leading-relaxed mb-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                &ldquo;{t('quote')}&rdquo;
              </motion.blockquote>

              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <motion.hr
                  className="w-12 border-t border-washi/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
                <cite className="text-washi/70 font-serif not-italic">
                  {t('oSensei')}
                </cite>
                <motion.hr
                  className="w-12 border-t border-washi/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
