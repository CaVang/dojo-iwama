"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EnsoCircle, SeigaihaPattern } from "@/components/ui/JapaneseElements";

export default function QuoteSection() {
  const t = useTranslations("home");

  return (
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
            transition={{ delay: 0.3, type: "spring" }}
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
            &ldquo;{t("quote")}&rdquo;
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
              {t("oSensei")}
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
  );
}
