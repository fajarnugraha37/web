"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { AnimatedNumber } from "@/components/atoms/AnimatedNumber";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onBootComplete?: () => void;
}

export function HeroSection({ onBootComplete }: HeroSectionProps) {
  const [isReady, setIsReady] = useState(false);

  const handleBootComplete = useCallback(() => {
    setIsReady(true);
    if (onBootComplete) onBootComplete();
  }, [onBootComplete]);

  return (
    <section className="flex-1 flex flex-col justify-center py-10 md:py-20 relative">
      {/* Glow Orbs - Dynamic Transition */}
      <div className={cn(
        "absolute top-1/4 right-0 w-64 md:w-96 h-64 md:h-96 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000",
        isReady ? "bg-accent opacity-15" : "bg-accent-secondary opacity-10"
      )} />
      <div className={cn(
        "absolute bottom-1/4 left-0 w-64 md:w-96 h-64 md:h-96 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000",
        isReady ? "bg-accent/40 opacity-10" : "bg-accent opacity-10"
      )} />

      <div className="flex flex-col gap-6 z-10 max-w-2xl">
        <ScrollReveal direction="right">
          <div className={cn(
            "inline-block border border-border px-3 py-1 text-[10px] font-mono mb-2 cyber-chamfer-reverse self-start transition-all duration-500",
            isReady 
              ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(0,255,136,0.2)]" 
              : "bg-card border-border text-accent-tertiary shadow-[0_0_10px_rgba(255,215,0,0.1)]"
          )}>
            <span className={cn("mr-2", !isReady && "animate-blink")}>&gt;</span> 
            SYSTEM.STATUS: {isReady ? "ONLINE" : "INITIALIZING"}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} direction="right">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none relative">
              <span className="relative z-10 text-foreground">
                Hey, <br />
                I&apos;m Fajar!
              </span>
              <span className="absolute top-0.5 left-0.5 text-accent-secondary opacity-60 z-0">
                Hey, <br />
                I&apos;m Fajar!
              </span>
              <span className="absolute -top-0.5 -left-0.5 text-accent opacity-60 z-0">
                Hey, <br />
                I&apos;m Fajar!
              </span>
            </h1>
            <span className="sr-only">Fajar Abdi Nugraha</span>
            <div className={cn(
              "h-1 w-24 mt-4 transition-all duration-700",
              isReady ? "bg-accent shadow-[0_0_20px_#00ff88]" : "bg-accent-tertiary shadow-[0_0_15px_#ff7300]"
            )}></div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="right">
          <div className="max-w-md">
            <h2 className="text-base md:text-lg text-foreground/80 leading-relaxed font-mono mt-4 font-normal normal-case">
              A <strong>Software Engineer</strong> and sometimes a{" "}
              <strong>Solution Architect</strong> who builds and operates
              systems. My job is to keep production running, annual plans
              aligned, technical decisions made responsibly, deliveries
              predictable, and scope honest.
              <span className={cn(
                "block mt-2 transition-colors duration-700",
                isReady ? "text-accent drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]" : "text-accent-secondary"
              )}>
                <strong>GovTech</strong> / <strong>Cloud Services</strong> /{" "}
                <strong>Microservices</strong>
              </span>
            </h2>

            <div className="mt-8 flex items-center gap-4 text-[10px] font-bold font-sans uppercase tracking-widest">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-3 h-3">
                   <div className={cn(
                     "absolute inset-0 rounded-full animate-ping opacity-40",
                     isReady ? "bg-accent" : "bg-accent-tertiary"
                   )} />
                   <div className={cn(
                     "relative w-2 h-2 rounded-full transition-colors duration-500",
                     isReady ? "bg-accent shadow-[0_0_10px_#00ff88]" : "bg-accent-tertiary shadow-[0_0_10px_#ff7300]"
                   )} />
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isReady ? "ready" : "booting"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={cn(isReady ? "text-accent" : "text-accent-tertiary")}
                  >
                    {isReady ? "ONLINE" : "INITIALIZING ..."}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-[10px] font-bold font-sans uppercase tracking-widest">
              <span className="text-muted-foreground gap-2">Load_Readiness:</span>
              <AnimatedNumber 
                suffix="%" 
                onComplete={handleBootComplete}
                className="font-mono text-sm" 
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3} direction="right">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
            <Button
              variant="glitch"
              size="lg"
              asChild
              className="group w-full sm:w-auto text-center justify-center"
            >
              <Link href="/labs">ACCESS_LABS.EXE</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto text-center justify-center hover:border-accent-secondary hover:text-accent-secondary hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
            >
              <Link href="/blogs">READ_BLOGS</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
