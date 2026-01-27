"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SeigaihaPattern, BrushReveal } from "@/components/ui/JapaneseElements";
import AnimatedSection from "./AnimatedSection";
import TechniqueCard from "./TechniqueCard";
import techniques from "@/data/techniques.json";

export default function FeaturedTechniquesSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  // Get featured techniques (one from each category)
  const featuredTechniques = [
    techniques.find((t) => t.category === "Taijutsu"),
    techniques.find((t) => t.category === "Aiki-Ken"),
    techniques.find((t) => t.category === "Aiki-Jo"),
  ].filter(Boolean) as (typeof techniques)[0][];

  return (
    <section className="py-24 md:py-32 relative bg-washi-cream">
      <SeigaihaPattern className="absolute inset-0 text-japan-blue opacity-30" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.span
            className="font-jp text-3xl text-japan-blue/20 block mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            技
          </motion.span>

          <BrushReveal>
            <h2 className="font-serif text-4xl md:text-5xl text-sumi">
              {t("featuredTechniques")}
            </h2>
          </BrushReveal>

          <motion.p
            className="text-sumi-muted mt-4 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {t("exploreFoundational")}
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
              studyLabel={t("study")}
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
              {t("viewAllTechniques")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
