"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  precision?: number;
  suffix?: string;
  className?: string;
}

/**
 * Atom: Digit
 * Animates a single digit with a high-velocity roulette effect.
 * Features momentary blur to simulate speed.
 */
function Digit({ char, isFast }: { char: string; isFast: boolean }) {
  return (
    <div className="inline-block relative h-[1em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          initial={{ y: "100%", filter: isFast ? "blur(2px)" : "blur(0px)" }}
          animate={{ y: "0%", filter: "blur(0px)" }}
          exit={{ y: "-100%", filter: isFast ? "blur(2px)" : "blur(0px)" }}
          transition={{ 
            duration: isFast ? 0.05 : 0.4, 
            ease: [0.23, 1, 0.32, 1],
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Atom: AnimatedNumber (Cyberpunk Edition)
 * Simulates a system diagnostic boot-up from ~25% to 100.00%.
 */
export function AnimatedNumber({
  precision = 2,
  suffix = "",
  className = "",
}: AnimatedNumberProps) {
  const [mounted, setMounted] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFast, setIsFast] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    // 1. Initial Random Start (20-30)
    const startVal = 20 + Math.random() * 10;
    setCurrentValue(startVal);

    // 2. Boot-up Sequence logic
    let current = startVal;
    const target = 100;
    
    const step = () => {
      const remaining = target - current;
      
      // Speed up as we get closer to target, then snap
      let increment = 0.3 + Math.random() * 2;
      if (remaining < 10) increment = 0.05 + Math.random() * 0.1; // Slow down for precision at end
      
      current += increment;
      setIsFast(increment > 0.5);

      if (current >= target) {
        setCurrentValue(target);
        setIsComplete(true);
        setIsFast(false);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentValue(current);
      }
    };

    timerRef.current = setInterval(step, 40);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Static shell for SSR
  if (!mounted) {
    return <span className={className}>25.00{suffix}</span>;
  }

  const formatted = currentValue.toFixed(precision);
  const chars = formatted.split("");

  return (
    <div className={cn(
      "transition-all duration-500",
      isComplete ? "text-accent scale-110 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" : className
    )}>
      <motion.div 
        className="inline-flex items-baseline leading-none font-mono font-bold"
        animate={isComplete ? { 
          x: [0, -2, 2, 0], 
          transition: { duration: 0.2 } 
        } : {}}
      >
        {chars.map((char, i) => (
          /[0-9]/.test(char) ? (
            <Digit key={`${i}-${char}`} char={char} isFast={isFast} />
          ) : (
            <span key={i} className="inline-block">{char}</span>
          )
        ))}
        {suffix && <span className="ml-0.5 inline-block">{suffix}</span>}
        
        {isComplete && (
          <motion.span 
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-2 text-[8px] tracking-[0.2em] bg-accent/20 px-1 border border-accent/50 text-accent uppercase"
          >
            Saturated
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
