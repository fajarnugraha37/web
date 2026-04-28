"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { ExpandableSummary } from "@/components/molecules/ExpandableSummary";

/**
 * Organism: SummarySection
 * Renders the professional summary section with decorative corner accents.
 */
export function SummarySection() {
  return (
    <section id="summary">
      <ScrollReveal direction="up">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 bg-accent/10 border border-accent/30 text-accent">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-xs font-bold font-mono text-accent tracking-[0.4em] uppercase">
            SUMMARY.LOG
          </h2>
          <div className="h-px flex-1 bg-accent/10" />
        </div>
        
        <div className="relative group">
          {/* Decorative Corner Accents */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent/40 pointer-events-none group-hover:border-accent transition-colors" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent/40 pointer-events-none group-hover:border-accent transition-colors" />
          
          <ExpandableSummary>
            <div className="font-mono text-sm md:text-base leading-relaxed space-y-6 text-foreground/90 py-2">
              <p>
                Lead Software Engineer working on a GovTech microservices platform (Singapore). I keep production alive, delivery predictable, and plans honest. Heavily involved in ensuring plans match reality (capacity vs commitment), not just optimism.
              </p>
              <p>
                I&apos;m adaptive and tend to place myself where I can create the most impact. Sometimes that means being the firefighter, jumping into issues, unblocking delivery, and doing the hard triage when things go sideways. But systems that rely on heroes are already broken.
              </p>
              <p>
                I handle solutioning, yearly planning, resource management, speed up development, risk assessment, and research spikes, as well as being the technical point of contact for stakeholders. If there are cost-benefit considerations, I&apos;ll draw it, quantify it, and make it explicit, no hidden complexity, no wishful thinking.
              </p>
              <p>
                Work closely across BA, QA, Infra and PMTs because shipping software is a team sport, not a solo speedrun and “ship it” without “safely” is just shipping problems.
              </p>
              <p>
                I strongly believe in a documentation-based approach and clear engineering guidelines, because heroics don&apos;t scale. I like boring production, docs that don&apos;t lie, honest plans, and systems that don&apos;t require heroic measures to operate.
              </p>
            </div>
          </ExpandableSummary>
        </div>
      </ScrollReveal>
    </section>
  );
}
