'use client';

import { motion } from 'framer-motion';

export function AnimatedSynapseLogo() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Core Nucleus */}
        <motion.circle
          cx="24"
          cy="24"
          r="4"
          fill="#00ff88"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Synapse Paths */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.path
            key={i}
            d={`M24 24 L${24 + 18 * Math.cos((angle * Math.PI) / 180)} ${24 + 18 * Math.sin((angle * Math.PI) / 180)}`}
            stroke="#00ff88"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Outer Intelligent Orbit */}
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke="#00ff88"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
      
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 bg-maverick-neon/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
