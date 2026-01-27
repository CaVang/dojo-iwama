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
      <div className="absolute inset-2 bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] opacity-80" />

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

// Weapon Rack Component
function WeaponRack({
  type,
  isVisible,
  weaponInfo,
}: {
  type: "bokken" | "jo";
  isVisible: boolean;
  weaponInfo: {
    title: string;
    subtitle: string;
    description: string;
    points: string[];
  };
}) {
  const [isHovered, setIsHovered] = useState(false);

  const weaponCount = type === "bokken" ? 5 : 4;

  return (
    <motion.div
      className={`absolute ${type === "bokken" ? "right-8 md:right-16" : "left-8 md:left-16"} top-1/2 -translate-y-1/2 z-20`}
      initial={{ opacity: 0, x: type === "bokken" ? 100 : -100 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rack Structure */}
      <div className="relative cursor-pointer group">
        {/* Rack frame */}
        <div className="relative w-16 md:w-24 h-64 md:h-80">
          {/* Vertical posts */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#654321] to-[#8B4513] rounded-sm" />
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#654321] to-[#8B4513] rounded-sm" />

          {/* Horizontal bars */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-2 bg-[#8B4513]"
              style={{ top: `${20 + i * 30}%` }}
            />
          ))}

          {/* Weapons */}
          {Array.from({ length: weaponCount }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${
                type === "bokken"
                  ? "w-2 h-48 md:h-56 bg-gradient-to-b from-[#DEB887] via-[#D2691E] to-[#8B4513]"
                  : "w-1.5 h-52 md:h-64 bg-gradient-to-b from-[#F5DEB3] via-[#DEB887] to-[#D2691E]"
              } rounded-full`}
              style={{
                left: `${15 + i * (type === "bokken" ? 15 : 18)}%`,
                top: type === "bokken" ? "5%" : "0%",
                transform: `rotate(${type === "bokken" ? 5 + i * 2 : -3 + i * 2}deg)`,
              }}
              initial={{ rotate: type === "bokken" ? 5 + i * 2 : -3 + i * 2 }}
              whileHover={{
                rotate: type === "bokken" ? 0 : 0,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              {/* Weapon details */}
              {type === "bokken" && (
                <>
                  {/* Tsuka (handle) */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#2F1810] rounded-b-full" />
                  {/* Tsuba (guard) */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#4A4A4A] rounded-full" />
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gold/20 rounded-lg blur-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1 }}
        >
          <span className="font-jp text-lg text-washi/80">
            {type === "bokken" ? "Bokken" : "Jo"}
          </span>
        </motion.div>
      </div>

      {/* Hover Info Panel */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`absolute top-0 ${
              type === "bokken" ? "right-full mr-4" : "left-full ml-4"
            } w-72 md:w-80 bg-washi/95 backdrop-blur-md border border-japan-blue/20 shadow-2xl z-30`}
            initial={{
              opacity: 0,
              x: type === "bokken" ? 20 : -20,
              scale: 0.95,
            }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: type === "bokken" ? 20 : -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-japan-blue p-4">
              <h3 className="font-jp text-2xl text-washi">
                {weaponInfo.title}
              </h3>
              <p className="text-washi/70 text-sm">{weaponInfo.subtitle}</p>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sumi-light text-sm leading-relaxed mb-4">
                {weaponInfo.description}
              </p>

              <ul className="space-y-2">
                {weaponInfo.points.map((point, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2 text-sm text-sumi"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-cinnabar mt-0.5">●</span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cinnabar/30" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cinnabar/30" />
          </motion.div>
        )}
      </AnimatePresence>
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
          <div className="w-full h-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-1">
            {/* Photo area */}
            <div className="w-full h-full bg-gradient-to-br from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
              <Image src="/images/dojos/O_sensei.jpg" alt="O Sensei" fill />
              {/* Light effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-washi/5" />
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
  const tWeapons = useTranslations("weapons");

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

  // Get weapon info from translations
  const bokkenInfo = {
    title: tWeapons("bokken.title"),
    subtitle: tWeapons("bokken.subtitle"),
    description: tWeapons("bokken.description"),
    points: tWeapons.raw("bokken.points") as string[],
  };

  const joInfo = {
    title: tWeapons("jo.title"),
    subtitle: tWeapons("jo.subtitle"),
    description: tWeapons("jo.description"),
    points: tWeapons.raw("jo.points") as string[],
  };

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1a1a1a]">
        {/* Background wall texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]">
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#2F2F2F] via-[#252525] to-[#1a1a1a]">
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
          <WeaponRack
            type="bokken"
            isVisible={doorsOpen}
            weaponInfo={bokkenInfo}
          />
          <WeaponRack type="jo" isVisible={doorsOpen} weaponInfo={joInfo} />

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
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#654321] to-[#8B4513]" />
          {/* Bottom beam */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#654321] to-[#8B4513]" />
          {/* Left pillar */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#654321] to-[#8B4513]" />
          {/* Right pillar */}
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-[#654321] to-[#8B4513]" />

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
