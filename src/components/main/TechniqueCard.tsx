"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Technique {
  id: string;
  slug: string;
  name_en: string;
  name_jp: string;
  category: string;
  description: string;
  difficulty: string;
}

export default function TechniqueCard({
  technique,
  index,
  locale,
  studyLabel,
}: {
  technique: Technique;
  index: number;
  locale: string;
  studyLabel: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
      <Link
        href={`/${locale}/techniques/${technique.slug}`}
        className="block group"
      >
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
              <span className="text-center p-4 font-jp text-7xl text-japan-blue/10 group-hover:text-japan-blue/20 transition-colors duration-500">
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
                  technique.difficulty === "Beginner"
                    ? "bg-bamboo/10 text-bamboo"
                    : technique.difficulty === "Intermediate"
                      ? "bg-gold/10 text-gold"
                      : "bg-cinnabar/10 text-cinnabar"
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
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
