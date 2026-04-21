"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Terminal } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex flex-col items-center group"
          aria-label="Scroll to top"
        >
          {/* Cyber-styled button */}
          <div className="relative p-3 bg-card border border-accent/50 text-accent shadow-[0_0_15px_rgba(0,255,136,0.2)] cyber-chamfer-sm transition-all group-hover:border-accent group-hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]">
            <ArrowUp className="w-5 h-5" />
            
            {/* Animated border scanline */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/50 animate-[shimmer_2s_infinite]" />
          </div>
          
          {/* Bottom tag */}
          <div className="mt-1 bg-accent text-[8px] font-black px-1 py-0.5 uppercase tracking-tighter text-black">
            TOP.EXE
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
