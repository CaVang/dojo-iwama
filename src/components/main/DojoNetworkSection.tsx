"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { TatamiPattern } from "@/components/ui/JapaneseElements";
import AnimatedSection from "./AnimatedSection";
import staticDojos from "@/data/dojos.json";

interface DojoData {
  id: string;
  name: string;
  chief_instructor: string;
  address: string;
  background_url?: string;
  avatar_url?: string;
}

export default function DojoNetworkSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [dojos, setDojos] = useState<DojoData[]>(staticDojos.slice(0, 3));

  useEffect(() => {
    fetch("/api/dojos")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.dojos?.length > 0) {
          setDojos(data.dojos.slice(0, 3));
        }
      })
      .catch(() => {/* fallback to static data */});
  }, []);

  return (
    <section className="py-24 md:py-32 relative">
      <TatamiPattern className="opacity-30" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="font-jp text-3xl text-japan-blue/20 block mb-4">
            道場
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-sumi">
            {t("globalDojoNetwork")}
          </h2>
          <p className="text-sumi-muted mt-4 max-w-2xl mx-auto">
            {t("connectWithDojos")}
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
                {/* Header image */}
                <div className="h-40 bg-gradient-to-br from-japan-blue/20 to-bamboo/10 relative overflow-hidden">
                  {dojo.background_url ? (
                    <Image src={dojo.background_url} alt={dojo.name} fill className="object-cover" />
                  ) : (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Users className="w-16 h-16 text-japan-blue/20" />
                    </motion.div>
                  )}

                  {/* Avatar */}
                  {dojo.avatar_url && (
                    <div className="absolute bottom-2 left-3 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                      <Image src={dojo.avatar_url} alt="" fill className="object-cover" />
                    </div>
                  )}

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
          <Link
            href={`/${locale}/dojos`}
            className="btn-primary inline-flex items-center gap-2"
          >
            {t("exploreAllDojos")}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
