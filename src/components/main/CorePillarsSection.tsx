"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck, Award, Activity } from "lucide-react";

export default function CorePillarsSection() {
  const t = useTranslations("home.corePillars");
  const sectionRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      id: "pillar1",
      icon: ShieldCheck,
      title: t("pillar1.title"),
      description: t("pillar1.description"),
    },
    {
      id: "pillar2",
      icon: Award,
      title: t("pillar2.title"),
      description: t("pillar2.description"),
    },
    {
      id: "pillar3",
      icon: Activity,
      title: t("pillar3.title"),
      description: t("pillar3.description"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-sumi text-washi py-20 md:py-32 overflow-hidden"
    >
      {/* Background Japanese Texture/Ink */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-screen" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-washi/80 font-serif max-w-3xl leading-relaxed"
          >
            &quot;{t("guarantee")}&quot;
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.2 + idx * 0.15 }}
                className="group relative"
              >
                {/* Connecting line for desktop */}
                {idx < pillars.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-japan-blue/50 to-transparent pointer-events-none" />
                )}

                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-washi/5 border border-washi/10 backdrop-blur-sm transition-all duration-500 hover:bg-washi/10 hover:-translate-y-2 h-full">
                  <div className="w-24 h-24 rounded-full bg-sumi-muted border-2 border-japan-blue/30 flex items-center justify-center mb-8 relative group-hover:border-japan-blue transition-colors duration-500 shadow-[0_0_30px_rgba(20,52,90,0.1)] group-hover:shadow-[0_0_40px_rgba(20,52,90,0.3)]">
                    <Icon className="w-10 h-10 text-japan-blue-light relative z-10" strokeWidth={1.5} />
                    {/* Decorative echo circles */}
                    <div className="absolute inset-0 rounded-full bg-japan-blue-light/10 scale-100 group-hover:scale-[1.5] group-hover:opacity-0 transition-all duration-1000 ease-out" />
                  </div>

                  <h3 className="font-serif text-2xl text-washi mb-4">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-washi/70 font-sans leading-relaxed text-lg">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
