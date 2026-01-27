"use client";

import { motion } from "framer-motion";
import { Sword, Users, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  EnsoCircle,
  AsanohaPattern,
  TatamiPattern,
  BrushReveal,
} from "@/components/ui/JapaneseElements";
import AnimatedSection from "./AnimatedSection";

export default function PhilosophySection() {
  const t = useTranslations("home");

  const pillars = [
    {
      icon: Users,
      title: "体術",
      subtitle: t("taijutsu"),
      desc: t("bodyArts"),
    },
    {
      icon: Sword,
      title: "剣",
      subtitle: t("ken"),
      desc: t("sword"),
    },
    {
      icon: BookOpen,
      title: "杖",
      subtitle: t("jo"),
      desc: t("staff"),
    },
  ];

  return (
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
              {t("philosophy")}
            </motion.span>

            <BrushReveal delay={0.3}>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-sumi mt-4 mb-8">
                {t("principleOf")}{" "}
                <span className="text-japan-blue">{t("riai")}</span>
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
                {t("riaiDescription1")}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {t("riaiDescription2")}
              </motion.p>
            </div>

            {/* Decorative seal */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, rotate: -10 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, type: "spring" }}
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
              {pillars.map((item, index) => (
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
                      whileHover={{ width: "100%" }}
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
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
