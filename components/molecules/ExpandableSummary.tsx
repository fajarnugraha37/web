"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Wraps the Executive Summary block.
 * Uses framer-motion for smooth height transition instead of CSS variables.
 */
export function ExpandableSummary({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card/40 border-l-4 border-accent p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      <div className="relative">
        <motion.div
          initial={false}
          animate={{ 
            height: expanded ? "auto" : "4.8rem",
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
          }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>

        {/* Fade mask */}
        <AnimatePresence>
          {!expanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" 
            />
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        id="summary-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex items-center gap-2 font-mono text-xs text-accent-tertiary hover:text-accent transition-colors"
        aria-expanded={expanded ? "true" : "false"}
      >
        <span
          className={`w-3 h-3 border border-accent-tertiary flex items-center justify-center text-[8px] transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
        {expanded ? "COLLAPSE_SUMMARY" : "EXPAND_SUMMARY"}
        <span className="animate-blink">_</span>
      </button>
    </div>
  );
}
