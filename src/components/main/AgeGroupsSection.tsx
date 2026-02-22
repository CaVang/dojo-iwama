"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function AgeGroupsSection() {
  const t = useTranslations("home.ageGroups");
  const sectionRef = useRef<HTMLDivElement>(null);

  // For desktop interactive hover effects
  const [activeGroup, setActiveGroup] = useState<"kids" | "teens" | "adults">(
    "kids"
  );

  // Track which benefit accordion is open. Format: `${groupId}-${benefitIndex}`
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const groups = [
    {
      id: "kids" as const,
      name: t("kids.name"),
      goal: t("kids.goal"),
      benefits: t.raw("kids.benefits") as string[],
      benefitDetails: t.raw("kids.benefitDetails") as string[],
    },
    {
      id: "teens" as const,
      name: t("teens.name"),
      goal: t("teens.goal"),
      benefits: t.raw("teens.benefits") as string[],
      benefitDetails: t.raw("teens.benefitDetails") as string[],
    },
    {
      id: "adults" as const,
      name: t("adults.name"),
      goal: t("adults.goal"),
      benefits: t.raw("adults.benefits") as string[],
      benefitDetails: t.raw("adults.benefitDetails") as string[],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-washi py-24 md:py-32"
    >
      {/* Background Japanese Texture/Ink */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-japan-blue/30" />
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-sumi font-medium">
              {t("title")}
            </h2>
          </div>
        </motion.div>

        {/* =======================================
            MOBILE EXPERIENCE (Asymmetric Flow)
            Visible on < 1024px (hidden on lg)
            ======================================= */}
        <div className="lg:hidden flex flex-col gap-16 relative">
          {/* Vertical joining line */}
          <div className="absolute left-[23px] top-10 bottom-10 w-[1px] bg-japan-blue/20 z-0 hidden md:block" />

          {groups.map((group, idx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className={`relative z-10 w-full md:w-[85%] ${
                idx % 2 === 1 ? "md:self-end" : "md:self-start"
              }`}
            >
              {/* Massive Typographic Header */}
              <h3 className="font-serif text-3xl sm:text-4xl text-japan-blue mb-6 border-b border-japan-blue/20 pb-4 inline-block">
                {group.name}
              </h3>

              {/* Content Panel */}
              <div className="bg-washi-cream/80 backdrop-blur-sm p-6 md:p-8 rounded-tr-3xl rounded-bl-3xl border border-border/40 shadow-sm">
                <div className="mb-6">
                  <h4 className="font-jp text-sm text-sumi-muted tracking-widest uppercase mb-2">
                    {t("goalLabel")}
                  </h4>
                  <p className="font-serif text-lg text-sumi leading-relaxed">
                    {group.goal}
                  </p>
                </div>

                <div>
                  <h4 className="font-jp text-sm text-sumi-muted tracking-widest uppercase mb-3">
                    {t("benefitsLabel")}
                  </h4>
                  <ul className="space-y-4">
                    {group.benefits.map((benefit, bIdx) => {
                      const accordionId = `${group.id}-${bIdx}`;
                      const isOpen = openAccordion === accordionId;
                      return (
                        <li key={bIdx} className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleAccordion(accordionId)}
                            className="flex items-start gap-3 text-left w-full group/acc"
                          >
                            <span className="text-bamboo mt-1 shrink-0">❖</span>
                            <span className="text-sumi/90 font-medium font-sans flex-1 group-hover/acc:text-japan-blue transition-colors">
                              {benefit}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-sumi-muted mt-0.5 shrink-0 transition-transform duration-300 ${
                                isOpen ? "rotate-180 text-japan-blue" : ""
                              }`}
                            />
                          </button>
                          
                          {/* Accordion Content */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <p className="pl-6 font-serif text-sumi/70 leading-relaxed pt-1 pb-2">
                                  {group.benefitDetails[bIdx]}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* =======================================
            DESKTOP EXPERIENCE (Typographic Hover)
            Visible on >= 1024px
            ======================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-12 relative min-h-[600px]">
          {/* Left Column: Massive Typography Menu */}
          <div className="col-span-6 flex flex-col justify-center gap-10 z-20">
            {groups.map((group) => (
              <div
                key={group.id}
                onMouseEnter={() => setActiveGroup(group.id)}
                className="cursor-pointer group relative block w-max"
              >
                <motion.h3
                  className={`font-serif text-4xl xl:text-5xl transition-colors duration-500 relative z-10 ${
                    activeGroup === group.id
                      ? "text-japan-blue"
                      : "text-sumi/30 group-hover:text-sumi/60"
                  }`}
                >
                  {group.name}
                </motion.h3>
                
                {/* Active Indicator Line - Calligraphy Brush Style */}
                <div className="absolute -bottom-6 left-0 w-full h-8 pointer-events-none">
                  <svg 
                    viewBox="0 0 200 30" 
                    preserveAspectRatio="none" 
                    className="w-full h-full text-japan-blue overflow-visible drop-shadow-sm"
                  >
                    <defs>
                      <filter id={`ink-bleed-${group.id}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
                      </filter>
                    </defs>
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeGroup === group.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.path
                        d="M 2,15 C 40,11 60,18 100,15 C 140,12 170,16 195,14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        filter={`url(#ink-bleed-${group.id})`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeGroup === group.id ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.path
                        d="M 5,16 C 45,13 65,19 105,15 C 135,11 165,15 198,15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter={`url(#ink-bleed-${group.id})`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeGroup === group.id ? 1 : 0 }}
                        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="opacity-70"
                      />
                    </motion.g>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Revealing Content (Negative Space) */}
          <div className="col-span-6 relative flex items-center">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                initial={false}
                animate={{
                  opacity: activeGroup === group.id ? 1 : 0,
                  y: activeGroup === group.id ? 0 : 20,
                  filter: activeGroup === group.id ? "blur(0px)" : "blur(10px)",
                  pointerEvents: activeGroup === group.id ? "auto" : "none",
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                {/* Decorative Ink Splash Behind Text */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-japan-blue/5 rounded-full blur-3xl" />
                
                <div className="relative z-10 pl-8 border-l-2 border-japan-blue/30">
                  <div className="mb-10">
                    <h4 className="font-jp text-sm text-japan-blue/60 tracking-widest uppercase mb-4">
                      {t("goalLabel")}
                    </h4>
                    <p className="font-serif text-xl xl:text-2xl text-sumi leading-relaxed max-w-xl">
                      &quot;{group.goal}&quot;
                    </p>
                  </div>

                  <div>
                    <h4 className="font-jp text-sm text-japan-blue/60 tracking-widest uppercase mb-6">
                      {t("benefitsLabel")}
                    </h4>
                    <ul className="space-y-5">
                      {group.benefits.map((benefit, bIdx) => {
                        const accordionId = `desktop-${group.id}-${bIdx}`;
                        const isOpen = openAccordion === accordionId;

                        return (
                          <motion.li
                            key={bIdx}
                            initial={false}
                            animate={{
                              opacity: activeGroup === group.id ? 1 : 0,
                              x: activeGroup === group.id ? 0 : 20,
                            }}
                            transition={{
                              duration: 0.5,
                              delay: activeGroup === group.id ? 0.3 + bIdx * 0.1 : 0,
                            }}
                            className="flex flex-col gap-2"
                          >
                            <button
                              onClick={() => toggleAccordion(accordionId)}
                              className="flex items-center gap-4 text-left w-full group/acc cursor-pointer"
                            >
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-washi-cream text-bamboo shadow-sm border border-border/50 shrink-0 transition-colors group-hover/acc:border-japan-blue/30">
                                ❖
                              </span>
                              <span className="font-sans text-lg text-sumi/80 font-medium flex-1 group-hover/acc:text-japan-blue transition-colors">
                                {benefit}
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-sumi/40 shrink-0 transition-transform duration-300 ${
                                  isOpen ? "rotate-180 text-japan-blue" : "group-hover/acc:text-japan-blue/60"
                                }`}
                              />
                            </button>

                            {/* Accordion Content */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-12 pr-4 pt-1 pb-2">
                                    <div className="pl-4 border-l-2 border-japan-blue/20">
                                      <p className="font-serif text-lg text-sumi/70 leading-relaxed">
                                        {group.benefitDetails[bIdx]}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
