"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  precision?: number;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * Atom: Digit
 */
function Digit({ char, isFast }: { char: string; isFast: boolean }) {
  return (
    <div className="inline-block relative h-[1em] overflow-hidden align-bottom text-inherit">
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
 * Atom: AnimatedNumber (Cyberpunk Readiness Edition)
 */
export function AnimatedNumber({
  precision = 2,
  suffix = "",
  className = "",
  onComplete,
}: AnimatedNumberProps) {
  const [mounted, setMounted] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFast, setIsFast] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const startVal = 20 + Math.random() * 10;
    setCurrentValue(startVal);

    let current = startVal;
    const target = 100;
    
    const step = () => {
      const remaining = target - current;
      
      // Cyberpunk velocity curve
      let increment = 0.3 + Math.random() * 2.5;
      if (remaining < 15) increment = 0.05 + Math.random() * 0.15;
      
      current += increment;
      setIsFast(increment > 0.6);

      if (current >= target) {
        setCurrentValue(target);
        setIsComplete(true);
        setIsFast(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      } else {
        setCurrentValue(current);
      }
    };

    timerRef.current = setInterval(step, 10); // 45 for slow

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onComplete]);

  if (!mounted) {
    return <span className={className}>20.00{suffix}</span>;
  }

  const formatted = currentValue.toFixed(precision);
  const chars = formatted.split("");

  return (
    <div className={cn(
      "transition-all duration-700",
      isComplete ? "text-accent scale-105" : "text-accent-tertiary",
      className
    )}>
      <motion.div 
        className="inline-flex items-baseline leading-none font-mono font-bold"
        animate={isComplete ? { 
          x: [0, -1, 1, 0], 
          transition: { duration: 0.3 } 
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
            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className="ml-3 text-[9px] tracking-[0.3em] bg-accent/20 px-2 py-0.5 border border-accent/50 text-accent uppercase font-black shadow-[0_0_10px_rgba(0,255,136,0.3)]"
          >
            READY
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
