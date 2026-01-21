'use client';

import { motion } from 'framer-motion';

interface SwordCutLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function SwordCutLoader({
  size = 'md',
  showText = true,
}: SwordCutLoaderProps) {
  const dimensions = {
    sm: { width: 120, height: 80 },
    md: { width: 200, height: 120 },
    lg: { width: 300, height: 180 },
  };

  const { width, height } = dimensions[size];

  // SVG path for a calligraphic sword cut (Shomen-uchi stroke)
  const swordStrokePath = `
    M ${width * 0.1} ${height * 0.15}
    Q ${width * 0.2} ${height * 0.1}, ${width * 0.35} ${height * 0.25}
    C ${width * 0.5} ${height * 0.4}, ${width * 0.6} ${height * 0.55}, ${width * 0.75} ${height * 0.7}
    Q ${width * 0.85} ${height * 0.82}, ${width * 0.92} ${height * 0.88}
  `;

  // Secondary splash strokes for ink splatter effect
  const splashPaths = [
    `M ${width * 0.7} ${height * 0.65} Q ${width * 0.75} ${height * 0.6}, ${width * 0.82} ${height * 0.58}`,
    `M ${width * 0.72} ${height * 0.72} Q ${width * 0.78} ${height * 0.75}, ${width * 0.85} ${height * 0.73}`,
    `M ${width * 0.68} ${height * 0.68} Q ${width * 0.65} ${height * 0.72}, ${width * 0.62} ${height * 0.78}`,
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Main SVG Animation */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Subtle glow filter */}
          <defs>
            <filter id="inkGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="inkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E4057" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#3d5475" stopOpacity="1" />
              <stop offset="100%" stopColor="#1e2d3d" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Main sword stroke */}
          <motion.path
            d={swordStrokePath}
            fill="none"
            stroke="url(#inkGradient)"
            strokeWidth={size === 'lg' ? 8 : size === 'md' ? 6 : 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#inkGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              pathLength: {
                duration: 0.6,
                ease: [0.65, 0, 0.35, 1],
              },
              opacity: {
                duration: 0.1,
              },
            }}
          />

          {/* Secondary stroke - thinner for detail */}
          <motion.path
            d={swordStrokePath}
            fill="none"
            stroke="#2E4057"
            strokeWidth={size === 'lg' ? 3 : size === 'md' ? 2 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 0.5,
            }}
            transition={{
              pathLength: {
                duration: 0.6,
                delay: 0.1,
                ease: [0.65, 0, 0.35, 1],
              },
              opacity: {
                duration: 0.1,
                delay: 0.1,
              },
            }}
          />

          {/* Ink splash effects */}
          {splashPaths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              fill="none"
              stroke="#2E4057"
              strokeWidth={size === 'lg' ? 2 : 1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, 0.6, 0.3],
              }}
              transition={{
                pathLength: {
                  duration: 0.3,
                  delay: 0.5 + index * 0.05,
                  ease: 'easeOut',
                },
                opacity: {
                  duration: 0.5,
                  delay: 0.5 + index * 0.05,
                },
              }}
            />
          ))}
        </svg>

        {/* Ink dissolution effect overlay */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1] }}
          transition={{
            duration: 1.5,
            times: [0, 0.7, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
          >
            <motion.path
              d={swordStrokePath}
              fill="none"
              stroke="url(#inkGradient)"
              strokeWidth={size === 'lg' ? 8 : size === 'md' ? 6 : 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={{
                opacity: [1, 0],
                filter: ['blur(0px)', 'blur(12px)'],
              }}
              transition={{
                duration: 0.6,
                delay: 1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Loading text */}
      {showText && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.p
            className="font-jp text-lg text-japan-blue tracking-[0.3em]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            正面打ち
          </motion.p>
          <p className="text-xs text-sumi-muted tracking-widest uppercase mt-1">
            Shomen-uchi
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Full page loading component
export function FullPageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-washi"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-japan-blue/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-japan-blue/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-japan-blue/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-japan-blue/20" />

      <SwordCutLoader size="lg" />
    </motion.div>
  );
}
