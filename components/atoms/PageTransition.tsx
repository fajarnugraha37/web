"use client";

import { motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Glitch Overlay Layer */}
      {isBooting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1, 0] }}
          transition={{ duration: 0.4, times: [0, 0.1, 0.2, 0.3, 1] }}
          className="fixed inset-0 z-[100] pointer-events-none bg-accent/5 mix-blend-screen"
        >
          {/* Chromatic aberration blocks */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[101] bg-[length:100%_2px,3px_100%]" />
          
          <motion.div 
            initial={{ scaleY: 0.01, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0], top: ["20%", "50%", "80%"] }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="absolute left-0 right-0 h-2 bg-accent/40 shadow-[0_0_20px_#00ff88] z-[102]"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ 
          opacity: 0, 
          y: 5,
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut",
        }}
      >
        <motion.div
          animate={{ 
            opacity: [1, 0.9, 1],
          }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* "Data Stream" scanline that runs once on mount */}
      <motion.div
        initial={{ top: "-10%", opacity: 0 }}
        animate={{ top: "110%", opacity: [0, 0.3, 0.3, 0] }}
        transition={{ duration: 0.5, ease: "circIn" }}
        className="fixed left-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-accent/10 to-transparent z-[99] pointer-events-none"
      />
    </div>
  );
}
