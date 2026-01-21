'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

// Enso Circle - Zen brush stroke circle
export function EnsoCircle({
  size = 200,
  strokeWidth = 8,
  className = '',
  delay = 0,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <defs>
        <filter id="ensoBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      <motion.path
        d="M100 20 C150 20, 180 50, 180 100 C180 150, 150 180, 100 180 C50 180, 20 150, 20 100 C20 50, 50 25, 90 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        filter="url(#ensoBlur)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.15 }}
        transition={{
          pathLength: { duration: 2, delay, ease: 'easeInOut' },
          opacity: { duration: 0.5, delay },
        }}
      />
    </motion.svg>
  );
}

// Torii Gate
export function ToriiGate({
  className = '',
  size = 100,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 80"
      width={size}
      height={size * 0.8}
      className={className}
      fill="currentColor"
    >
      <rect x="10" y="0" width="8" height="80" rx="1" />
      <rect x="82" y="0" width="8" height="80" rx="1" />
      <rect x="0" y="5" width="100" height="8" rx="2" />
      <rect x="5" y="20" width="90" height="5" rx="1" />
      <path d="M0 0 Q50 -15 100 0 L100 8 Q50 -7 0 8 Z" />
    </svg>
  );
}

// Seigaiha Wave Pattern
export function SeigaihaPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%">
      <defs>
        <pattern
          id="seigaiha"
          x="0"
          y="0"
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 20 Q10 10 20 20 Q30 10 40 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <path
            d="M0 15 Q10 5 20 15 Q30 5 40 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha)" />
    </svg>
  );
}

// Asanoha (Hemp Leaf) Pattern
export function AsanohaPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%">
      <defs>
        <pattern
          id="asanoha"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M14 0 L14 14 M0 14 L14 14 M28 14 L14 14 M0 0 L14 14 M28 0 L14 14 M0 28 L14 14 M28 28 L14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#asanoha)" />
    </svg>
  );
}

// Bamboo decoration
export function BambooDecoration({
  className = '',
  side = 'left',
}: {
  className?: string;
  side?: 'left' | 'right';
}) {
  return (
    <motion.div
      className={`${className} ${side === 'right' ? 'scale-x-[-1]' : ''}`}
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <svg width="60" height="400" viewBox="0 0 60 400">
        <defs>
          <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A5D23" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6B8E23" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4A5D23" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Main bamboo stalk */}
        <rect x="20" y="0" width="20" height="400" fill="url(#bambooGrad)" rx="2" />
        {/* Nodes */}
        {[50, 120, 200, 280, 350].map((y, i) => (
          <g key={i}>
            <rect x="18" y={y} width="24" height="6" fill="#3d4d1a" rx="1" />
            {/* Leaves */}
            {i % 2 === 0 && (
              <path
                d={`M40 ${y} Q60 ${y - 20} 55 ${y - 40} Q50 ${y - 20} 40 ${y}`}
                fill="#5a7a2a"
                opacity="0.7"
              />
            )}
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

// Ink Splash Effect
export function InkSplash({
  className = '',
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.1 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      <defs>
        <filter id="inkBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <circle cx="100" cy="100" r="60" fill="currentColor" filter="url(#inkBlur)" />
      <circle cx="130" cy="80" r="25" fill="currentColor" filter="url(#inkBlur)" />
      <circle cx="70" cy="130" r="20" fill="currentColor" filter="url(#inkBlur)" />
      <circle cx="140" cy="140" r="15" fill="currentColor" filter="url(#inkBlur)" />
    </motion.svg>
  );
}

// Shoji Screen Divider
export function ShojiDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="none">
        <defs>
          <pattern
            id="shojiPattern"
            x="0"
            y="0"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect x="0" y="25" width="400" height="10" fill="currentColor" opacity="0.3" />
        <rect x="0" y="0" width="400" height="60" fill="url(#shojiPattern)" />
      </svg>
    </div>
  );
}

// Parallax Kanji Character
export function ParallaxKanji({
  character,
  scrollProgress,
  className = '',
}: {
  character: string;
  scrollProgress: MotionValue<number>;
  className?: string;
}) {
  const y = useTransform(scrollProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollProgress, [0, 0.5, 1], [0.08, 0.15, 0.05]);
  const scale = useTransform(scrollProgress, [0, 0.5, 1], [0.8, 1, 1.2]);

  return (
    <motion.span
      className={`font-jp pointer-events-none select-none ${className}`}
      style={{ y, opacity, scale }}
    >
      {character}
    </motion.span>
  );
}

// Floating Sakura Petals
export function SakuraPetals({ count = 10 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -20,
            rotate: 0,
            opacity: 0.6,
          }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
            x: `+=${Math.random() * 200 - 100}`,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [0.6, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full text-cinnabar-light/40">
            <ellipse cx="10" cy="10" rx="8" ry="5" fill="currentColor" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// Wood Grain Texture
export function WoodGrainBg({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg width="100%" height="100%" opacity="0.05">
        <defs>
          <pattern
            id="woodGrain"
            x="0"
            y="0"
            width="200"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 10 Q50 5 100 10 T200 10"
              fill="none"
              stroke="#8B4513"
              strokeWidth="1"
            />
            <path
              d="M0 15 Q50 12 100 15 T200 15"
              fill="none"
              stroke="#8B4513"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#woodGrain)" />
      </svg>
    </div>
  );
}

// Tatami Mat Pattern
export function TatamiPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg width="100%" height="100%" opacity="0.03">
        <defs>
          <pattern
            id="tatami"
            x="0"
            y="0"
            width="60"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="60" height="30" fill="#C4A77D" />
            <line x1="0" y1="0" x2="60" y2="0" stroke="#9A8B6D" strokeWidth="1" />
            <line x1="30" y1="0" x2="30" y2="30" stroke="#9A8B6D" strokeWidth="0.5" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 2.5}
                x2="60"
                y2={i * 2.5}
                stroke="#B8A07A"
                strokeWidth="0.3"
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tatami)" />
      </svg>
    </div>
  );
}

// Brush Stroke Reveal Animation
export function BrushReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="absolute inset-0 bg-japan-blue z-10"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.6, 0, 0.2, 1] }}
        style={{ transformOrigin: 'right' }}
      />
      {children}
    </motion.div>
  );
}
