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
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-[45] group flex flex-col items-center"
          aria-label="Scroll to top"
        >
          <div className="relative p-3 bg-background/80 border border-accent/50 backdrop-blur-md cyber-chamfer-sm group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all">
            <ArrowUp className="w-5 h-5 text-accent group-hover:animate-bounce" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-accent" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-accent" />
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
