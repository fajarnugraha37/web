"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";

export function HeroSection() {
  return (
    <section className="flex-1 flex flex-col justify-center py-10 md:py-20 relative">
      {/* Glow Orbs - Sunset Colors */}
      <div className="absolute top-1/4 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent opacity-10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-secondary opacity-10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col gap-6 z-10 max-w-2xl">
        <ScrollReveal direction="right">
          <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-2 cyber-chamfer-reverse text-accent-tertiary self-start shadow-[0_0_10px_rgba(255,215,0,0.2)]">
            <span className="animate-blink mr-2">&gt;</span> SYSTEM.STATUS:
            ONLINE
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
            <div className="h-1 w-24 bg-accent mt-4 shadow-[0_0_15px_#ff7300]"></div>
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
              <span className="text-accent block mt-2 drop-shadow-[0_0_5px_rgba(255,115,0,0.5)]">
                <strong>GovTech</strong> / <strong>Cloud Services</strong> /{" "}
                <strong>Microservices</strong>
              </span>
            </h2>

            <div className="mt-8 flex items-center gap-4 text-xs font-bold font-sans">
              <span className="text-muted-foreground">STATUS:</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_5px_#ff7300]"></span>
                SYSTEMS_OPERATIONAL
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs font-bold font-sans">
              <span className="text-muted-foreground gap-2">LOAD:</span>
              <span className="text-accent-tertiary">42.42%</span>
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
              <Link href="/blogs">READ_LOGS</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
