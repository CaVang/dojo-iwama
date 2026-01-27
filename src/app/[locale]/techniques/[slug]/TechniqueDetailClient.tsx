"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Star,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  EnsoCircle,
  SeigaihaPattern,
  AsanohaPattern,
  BambooDecoration,
  InkSplash,
  ShojiDivider,
  WoodGrainBg,
  TatamiPattern,
  BrushReveal,
} from "@/components/ui/JapaneseElements";
import techniques from "@/data/techniques.json";

interface Technique {
  id: string;
  slug: string;
  name_jp: string;
  name_en: string;
  category: string;
  subcategory?: string;
  difficulty: string;
  description: string;
  variants?: string[];
  content: {
    key_postures: Array<{
      title: string;
      description: string;
      image_url?: string;
    }>;
    important_notes: Array<{
      note: string;
      image_url?: string;
    }>;
    characteristics?: Array<{
      feature: string;
      image_url?: string;
    }>;
  };
}

interface TechniqueDetailClientProps {
  technique: Technique;
}

// Animated Section Component
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 80 }}
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

// Posture Card with dramatic animation
function PostureCard({
  posture,
  index,
  techniqueNameJp,
  stepLabel,
  formLabel,
}: {
  posture: { title: string; description: string; image_url?: string };
  index: number;
  techniqueNameJp: string;
  stepLabel: string;
  formLabel: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      className="relative"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Large step number with brush effect */}
      <motion.div
        className="absolute -left-4 md:-left-20 -top-8 z-0"
        initial={{ scale: 0, rotate: -20 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
      >
        <span className="font-jp text-[8rem] md:text-[12rem] text-japan-blue/[0.07] font-bold leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Image with dramatic reveal */}
        <motion.div
          className={`relative overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-japan-blue/20 via-japan-blue/10 to-washi-warm relative group">
            {/* Decorative frame */}
            <div className="absolute inset-4 border border-japan-blue/20" />
            <div className="absolute inset-6 border border-japan-blue/10" />

            {/* Inner kanji */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="font-jp text-6xl md:text-8xl text-japan-blue/10 group-hover:text-japan-blue/20 transition-colors duration-500">
                {techniqueNameJp}
              </span>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cinnabar/40" />
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cinnabar/40" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cinnabar/40" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cinnabar/40" />

            {/* Step indicator */}
            <div className="absolute bottom-4 left-4 bg-japan-blue text-washi px-3 py-1 text-sm font-serif tracking-wider">
              {stepLabel}
            </div>
          </div>
        </motion.div>

        {/* Content with staggered reveal */}
        <motion.div
          className={`${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}
          initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "3rem" } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className={`h-0.5 bg-cinnabar mb-4 ${index % 2 === 1 ? "ml-auto" : ""}`}
          />

          <h3 className="font-serif text-2xl md:text-3xl text-sumi mb-4">
            {posture.title}
          </h3>

          <p className="text-sumi-light leading-relaxed text-lg">
            {posture.description}
          </p>

          {/* Decorative element */}
          <motion.div
            className={`mt-6 flex items-center gap-2 text-japan-blue/40 ${
              index % 2 === 1 ? "justify-end" : ""
            }`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            <span className="font-jp text-sm">形</span>
            <span className="text-xs tracking-widest uppercase">
              {formLabel}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Connecting brush stroke */}
      {index < 2 && (
        <motion.div
          className="hidden md:block absolute left-1/2 -bottom-16 w-px h-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-full h-full bg-gradient-to-b from-japan-blue/30 to-transparent"
            initial={{ y: "-100%" }}
            animate={isInView ? { y: "0%" } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          />
        </motion.div>
      )}
    </motion.article>
  );
}

export default function TechniqueDetailClient({
  technique,
}: TechniqueDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("techniqueDetail");
  const locale = useLocale();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Hero parallax effects
  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const kanjiY = useTransform(heroScrollProgress, [0, 1], ["0%", "80%"]);
  const kanjiRotate = useTransform(heroScrollProgress, [0, 1], [0, 10]);

  // Progress bar
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Find related techniques
  const relatedTechniques = techniques
    .filter(
      (tech) =>
        tech.category === technique.category && tech.id !== technique.id,
    )
    .slice(0, 3);

  return (
    <div ref={containerRef} className="bg-washi">
      {/* Progress bar */}
      <motion.div className="fixed top-20 left-0 right-0 h-1 bg-japan-blue/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cinnabar via-japan-blue to-cinnabar"
          style={{ width: progressWidth }}
        />
      </motion.div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated background layers */}
        <motion.div
          className="absolute inset-0 bg-japan-blue"
          style={{ scale: heroScale }}
        />

        {/* Wave pattern overlay */}
        <div className="absolute inset-0 text-washi/5">
          <SeigaihaPattern />
        </div>

        {/* Animated ink splashes */}
        <InkSplash
          className="absolute top-20 right-20 w-40 h-40 text-washi"
          delay={0.5}
        />
        <InkSplash
          className="absolute bottom-40 left-10 w-32 h-32 text-washi"
          delay={0.8}
        />

        {/* Enso circle decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <EnsoCircle
            size={500}
            strokeWidth={4}
            className="text-washi"
            delay={0.3}
          />
        </div>

        {/* Bamboo decorations */}
        <BambooDecoration
          className="absolute left-0 bottom-0 opacity-30"
          side="left"
        />
        <BambooDecoration
          className="absolute right-0 bottom-0 opacity-30"
          side="right"
        />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-washi/60 text-sm mb-8"
          >
            <Link
              href={`/${locale}/techniques`}
              className="hover:text-washi transition-colors"
            >
              {t("techniques")}
            </Link>
            <ChevronRight size={14} />
            <span className="text-washi">{technique.name_en}</span>
          </motion.nav>

          {/* Category & Difficulty with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="bg-washi/10 text-washi text-xs px-4 py-2 uppercase tracking-[0.2em] border border-washi/20">
              {technique.category}
            </span>
            <span
              className={`text-xs px-4 py-2 uppercase tracking-[0.2em] border ${
                technique.difficulty === "Beginner"
                  ? "bg-bamboo/20 text-bamboo-light border-bamboo/30"
                  : technique.difficulty === "Intermediate"
                    ? "bg-gold/20 text-gold border-gold/30"
                    : "bg-cinnabar/20 text-cinnabar-light border-cinnabar/30"
              }`}
            >
              {technique.difficulty}
            </span>
          </motion.div>

          {/* Japanese name with brush animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-4"
          >
            <span className="font-jp text-5xl md:text-7xl text-washi/80 tracking-wider">
              {technique.name_jp}
            </span>
          </motion.div>

          {/* English name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-washi tracking-wider mb-8"
          >
            {technique.name_en}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-washi/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            {technique.description}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-washi/50"
            >
              <span className="text-xs tracking-[0.3em] uppercase mb-2">
                {t("scroll")}
              </span>
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Decorative wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full fill-washi">
            <path d="M0 120V60C240 100 480 20 720 60C960 100 1200 40 1440 60V120H0Z" />
          </svg>
        </div>
      </section>

      {/* Quick Navigation */}
      <nav className="sticky top-20 z-40 bg-washi/95 backdrop-blur-md border-b border-japan-blue/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-8 py-4 overflow-x-auto">
            {[
              { id: "postures", icon: BookOpen, label: t("postures") },
              { id: "notes", icon: AlertCircle, label: t("notes") },
              { id: "characteristics", icon: Star, label: t("features") },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm font-serif tracking-wider text-sumi hover:text-japan-blue transition-colors whitespace-nowrap group"
              >
                <item.icon
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Key Postures Section */}
      <section id="postures" className="py-24 md:py-32 relative scroll-mt-32">
        <TatamiPattern className="opacity-50" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-20">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-japan-blue/5 flex items-center justify-center"
            >
              <BookOpen className="w-8 h-8 text-japan-blue" />
            </motion.div>

            <BrushReveal delay={0.2}>
              <h2 className="font-serif text-3xl md:text-5xl text-sumi mb-4">
                {t("keyPostures")}
              </h2>
            </BrushReveal>

            <p className="text-sumi-muted max-w-xl mx-auto">
              {t("keyPosturesDesc")}
            </p>

            <motion.div
              className="mt-8 flex justify-center"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-japan-blue/50 to-transparent" />
            </motion.div>
          </AnimatedSection>

          {/* Postures */}
          <div className="space-y-32 md:space-y-40">
            {technique.content.key_postures.map((posture, index) => (
              <PostureCard
                key={index}
                posture={posture}
                index={index}
                techniqueNameJp={technique.name_jp}
                stepLabel={t("step", { number: index + 1 })}
                formLabel={t("form")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shoji Divider */}
      <ShojiDivider className="text-japan-blue" />

      {/* Important Notes Section */}
      <section
        id="notes"
        className="py-24 md:py-32 relative scroll-mt-32 bg-gradient-to-b from-washi-cream to-washi"
      >
        <WoodGrainBg />
        <AsanohaPattern className="absolute inset-0 text-japan-blue" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-cinnabar/10 flex items-center justify-center"
            >
              <AlertCircle className="w-8 h-8 text-cinnabar" />
            </motion.div>

            <h2 className="font-serif text-3xl md:text-5xl text-sumi mb-4">
              {t("importantNotes")}
            </h2>

            <p className="text-sumi-muted max-w-xl mx-auto">
              {t("importantNotesDesc")}
            </p>
          </AnimatedSection>

          {/* Notes with dramatic card reveal */}
          <div className="grid md:grid-cols-2 gap-8">
            {technique.content.important_notes.map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateY: -30, x: -50 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group"
              >
                <div className="relative bg-white p-8 border-l-4 border-cinnabar shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cinnabar/5 -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-cinnabar/10 transition-colors" />
                  </div>

                  {/* Number */}
                  <div className="absolute left-1 top-1 w-10 h-10 bg-cinnabar text-washi rounded-full flex items-center justify-center font-serif text-lg shadow-md">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-4 pt-2">
                    <span className="font-jp text-3xl text-cinnabar/30 shrink-0">
                      注
                    </span>
                    <p className="text-sumi-light leading-relaxed text-lg">
                      {note.note}
                    </p>
                  </div>

                  {/* Bottom decoration */}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cinnabar/20 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Characteristics Section */}
      <section
        id="characteristics"
        className="py-24 md:py-32 relative scroll-mt-32 bg-japan-blue overflow-hidden"
      >
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
          <EnsoCircle size={600} className="text-washi" delay={0.5} />
        </motion.div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-washi/10 flex items-center justify-center"
            >
              <Star className="w-8 h-8 text-gold" />
            </motion.div>

            <h2 className="font-serif text-3xl md:text-5xl text-washi mb-4">
              {t("characteristics")}
            </h2>

            <p className="text-washi/60 max-w-xl mx-auto">
              {t("characteristicsDesc")}
            </p>
          </AnimatedSection>

          {/* Characteristics */}
          <div className="space-y-6">
            {technique.content.characteristics?.map((char, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative"
              >
                <div className="flex items-start gap-6 p-8 bg-washi/5 backdrop-blur-sm border border-washi/10 hover:bg-washi/10 transition-colors duration-300 group">
                  {/* Star icon */}
                  <motion.div
                    className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center shrink-0"
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Star className="w-6 h-6 text-gold" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-washi text-lg leading-relaxed">
                      {char.feature}
                    </p>
                  </div>

                  {/* Index */}
                  <span className="font-jp text-4xl text-washi/10 shrink-0">
                    {["一", "二", "三", "四", "五"][index] || ""}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Techniques */}
      {relatedTechniques.length > 0 && (
        <section className="py-24 md:py-32 relative">
          <TatamiPattern className="opacity-30" />

          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <span className="font-jp text-2xl text-japan-blue/30 block mb-4">
                関連技
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-sumi">
                {t("relatedTechniques")}
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-3 gap-8">
              {relatedTechniques.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    href={`/${locale}/techniques/${related.slug}`}
                    className="block group"
                  >
                    <div className="relative bg-washi-cream p-8 text-center border border-japan-blue/10 hover:border-japan-blue/30 transition-colors overflow-hidden">
                      {/* Content */}
                      <div className="relative z-10">
                        <span className="font-jp text-3xl text-japan-blue/30 block mb-2">
                          {related.name_jp}
                        </span>
                        <h3 className="font-serif text-xl text-sumi group-hover:text-japan-blue transition-colors mb-2">
                          {related.name_en}
                        </h3>
                        <p className="text-xs text-sumi-muted uppercase tracking-wider">
                          {related.difficulty}
                        </p>
                      </div>

                      {/* Hover indicator */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-japan-blue"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <section className="py-12 bg-washi-cream border-t border-japan-blue/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/techniques`}
              className="flex items-center gap-3 text-sumi hover:text-japan-blue transition-colors group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                className="w-10 h-10 rounded-full bg-japan-blue/5 flex items-center justify-center group-hover:bg-japan-blue/10 transition-colors"
              >
                <ArrowLeft size={18} />
              </motion.div>
              <span className="font-serif tracking-wider">
                {t("backToLibrary")}
              </span>
            </Link>

            {/* Seal stamp */}
            <div className="seal-stamp text-sm">
              <span>{technique.name_jp}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
