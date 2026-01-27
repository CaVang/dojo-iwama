"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Shoji Door Panel Component
function ShojiDoor({ side }: { side: "left" | "right" }) {
  return (
    <div className="w-full h-full relative bg-[#F5E6D3]">
      {/* Wood frame */}
      <div className="absolute inset-0 border-8 border-[#8B4513]">
        {/* Horizontal dividers */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-2 bg-[#8B4513]"
            style={{ top: `${i * 20}%` }}
          />
        ))}
        {/* Vertical dividers */}
        {[1, 2].map((i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-2 bg-[#8B4513]"
            style={{ left: `${i * 33.33}%` }}
          />
        ))}
      </div>

      {/* Paper texture overlay */}
      <div className="absolute inset-2 bg-linear-to-br from-[#FFF8F0] to-[#F5E6D3] opacity-80" />

      {/* Subtle pattern on paper */}
      <svg className="absolute inset-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] opacity-5">
        <pattern
          id={`grid-${side}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#8B4513"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${side})`} />
      </svg>
    </div>
  );
}

// Quote Component
function Quote({
  side,
  text,
  subtext,
  kanji,
  isVisible,
}: {
  side: "left" | "right";
  text: string;
  subtext?: string;
  kanji?: string;
  isVisible: boolean;
}) {
  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 ${
        side === "left"
          ? "left-8 md:left-20 lg:left-32 text-left"
          : "right-8 md:right-20 lg:right-32 text-right"
      } z-20 max-w-[140px] md:max-w-[200px] lg:max-w-xs pointer-events-none`}
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <div
        className={`flex flex-col ${side === "left" ? "items-start" : "items-end"}`}
      >
        {kanji && (
          <span className="font-jp text-3xl md:text-4xl text-japan-blue/20 mb-2 select-none">
            {kanji}
          </span>
        )}
        <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-washi/90 mb-2 italic leading-relaxed">
          &ldquo;{text}&rdquo;
        </h3>
        {subtext && (
          <p className="font-sans text-xs md:text-sm text-washi/60 uppercase tracking-widest">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// O-Sensei Portrait Component
function OSenseiPortrait({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {/* Portrait frame */}
      <div className="relative">
        {/* Outer frame */}
        <div className="w-[175px] h-[238px] md:w-[220px] md:h-[318px] lg:w-[270px] lg:h-[368px] bg-[#1a1a1a] p-2 shadow-2xl">
          {/* Inner frame */}
          <div className="w-full h-full bg-linear-to-b from-[#2a2a2a] to-[#1a1a1a] p-1">
            {/* Photo area */}
            <div className="w-full h-full bg-linear-to-br from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
              <Image src="/images/dojos/O_sensei.jpg" alt="O Sensei" fill />
              {/* Light effect */}
              <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-washi/5" />
            </div>
          </div>
        </div>

        {/* Name plate */}
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#8B4513] px-6 py-2 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="font-jp text-lg text-[#F5DEB3] text-center">植芝盛平</p>
          <p className="text-xs text-[#DEB887] text-center tracking-wider">
            O-SENSEI
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main Dojo Entrance Component
export default function DojoEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const t = useTranslations("home");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Door animations
  const leftDoorX = useTransform(scrollYProgress, [0, 0.3], ["0%", "-100%"]);
  const rightDoorX = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"]);

  // Circle animations
  const circleY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-150%"]);
  const circleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const circleOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);

  // Interior reveal
  const interiorOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  // Track if user has started scrolling
  scrollYProgress.on("change", (value) => {
    if (value > 0.1 && !hasScrolled) {
      setHasScrolled(true);
    }
  });

  const doorsOpen = hasScrolled;

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1a1a1a]">
        {/* Background wall texture */}
        <div className="absolute inset-0 bg-linear-to-b from-[#2a2a2a] to-[#1a1a1a]">
          {/* Wood panel pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <pattern
              id="woodPattern"
              width="100"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 10 Q25 5 50 10 T100 10"
                fill="none"
                stroke="#8B4513"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#woodPattern)" />
          </svg>
        </div>

        {/* Interior (revealed after doors open) */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: interiorOpacity }}
        >
          {/* Dojo interior background */}
          <div className="absolute inset-0 bg-linear-to-b from-[#2F2F2F] via-[#252525] to-[#1a1a1a]">
            {/* Tatami pattern hint */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20">
              <svg width="100%" height="100%">
                <pattern
                  id="tatamiInterior"
                  width="60"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="60" height="30" fill="#5D4E37" />
                  <line
                    x1="0"
                    y1="15"
                    x2="60"
                    y2="15"
                    stroke="#4A3F2F"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="30"
                    y1="0"
                    x2="30"
                    y2="30"
                    stroke="#4A3F2F"
                    strokeWidth="0.5"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#tatamiInterior)" />
              </svg>
            </div>
          </div>

          {/* O-Sensei Portrait */}
          <OSenseiPortrait isVisible={doorsOpen} />

          {/* Weapon Racks */}
          {/* O-Sensei Quotes */}
          <Quote
            side="left"
            text="Masakatsu Agatsu"
            subtext="True Victory is Victory Over Oneself"
            kanji="正勝吾勝"
            isVisible={doorsOpen}
          />
          <Quote
            side="right"
            text="Aikido is the Art of Peace"
            kanji="和の武道"
            isVisible={doorsOpen}
          />

          {/* Welcome text */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={doorsOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-washi tracking-wider">
              {t("iwamaAikido")}
            </h2>
            <p className="font-jp text-washi/40 text-lg mt-2">岩間合気道</p>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={doorsOpen ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-washi/40 text-xs tracking-widest uppercase"
            >
              {t("continueScrolling")}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Doors Container */}
        <div className="absolute inset-0 flex">
          {/* Left Door */}
          <motion.div className="w-1/2 h-full" style={{ x: leftDoorX }}>
            <ShojiDoor side="left" />
          </motion.div>

          {/* Right Door */}
          <motion.div className="w-1/2 h-full" style={{ x: rightDoorX }}>
            <ShojiDoor side="right" />
          </motion.div>
        </div>

        {/* DOJO Circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
          style={{
            x: "-50%",
            y: circleY,
            scale: circleScale,
            opacity: circleOpacity,
          }}
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-washi/20 rounded-full blur-3xl scale-150" />

            {/* Main circle */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full bg-white shadow-2xl flex items-center justify-center">
              {/* Inner ring */}
              <div className="absolute inset-4 rounded-full border-2 border-japan-blue/20" />

              {/* DOJO text - calligraphy style */}
              <div className="text-center">
                <motion.span
                  className="font-jp text-5xl md:text-6xl lg:text-7xl text-japan-blue font-bold block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src="/images/dojos/dojo.png"
                    alt="dojo"
                    width={80}
                    height={80}
                  />
                </motion.span>
              </div>

              {/* Decorative dots */}
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-2 h-2 bg-cinnabar rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateY(-${70}px) translate(-50%, -50%)`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Wall frame around doors */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top beam */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-[#654321] to-[#8B4513]" />
          {/* Bottom beam */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#654321] to-[#8B4513]" />
          {/* Left pillar */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-linear-to-r from-[#654321] to-[#8B4513]" />
          {/* Right pillar */}
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-linear-to-l from-[#654321] to-[#8B4513]" />

          {/* Corner decorations */}
          <div className="absolute top-8 left-4 w-8 h-8 border-l-4 border-t-4 border-[#4A3728]" />
          <div className="absolute top-8 right-4 w-8 h-8 border-r-4 border-t-4 border-[#4A3728]" />
          <div className="absolute bottom-8 left-4 w-8 h-8 border-l-4 border-b-4 border-[#4A3728]" />
          <div className="absolute bottom-8 right-4 w-8 h-8 border-r-4 border-b-4 border-[#4A3728]" />
        </div>

        {/* Initial scroll hint */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasScrolled ? 0 : 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-[#8B4513]"
          >
            <span className="text-xs tracking-[0.3em] uppercase mb-2 font-serif">
              {t("scrollToEnter")}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
