"use client";

import React from "react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";

export function ParadigmsSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 -z-10 bg-repeat bg-center" />

      {/* Sunset Glow Overlay for Section */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent-secondary/5 to-background -z-10 pointer-events-none opacity-25" />

      <ScrollReveal direction="up">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground">
            <span className="text-accent drop-shadow-[0_0_5px_#ff7300]">
              02 //
            </span>{" "}
            CORE PARADIGMS
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:transform lg:-skew-y-1">
        <ScrollReveal delay={0.1} direction="up">
          <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent hover:shadow-[0_0_20px_rgba(255,115,0,0.3)] group relative h-full">
            <div className="text-5xl md:text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent/10 transition-colors">
              01
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-accent drop-shadow-[0_0_5px_rgba(255,115,0,0.5)]">
              CORRECTNESS BEFORE CLEVERNESS
            </h3>
            <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed relative z-10">
              Avoiding elegant solutions that obscure guarantees. Preferring
              explicit, sometimes verbose designs that make invariants,
              constraints, and failure behavior undeniable.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2} direction="up">
          <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent-secondary hover:shadow-[0_0_20px_rgba(255,0,127,0.3)] group relative h-full">
            <div className="text-5xl md:text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent-secondary/10 transition-colors">
              02
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-accent-secondary drop-shadow-[0_0_5px_rgba(255,0,127,0.5)]">
              DETERMINISTIC BEHAVIOR
            </h3>
            <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed relative z-10">
              Building systems where outcomes are predictable under the same
              inputs. Minimizing hidden randomness through controlled
              concurrency, ordering guarantees, and reproducible execution
              paths.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.3} direction="up">
          <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent-tertiary hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] group relative h-full">
            <div className="text-5xl md:text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent-tertiary/10 transition-colors">
              03
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-accent-tertiary drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
              SYSTEMS LIE UNTIL PROVEN OTHERWISE
            </h3>
            <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed relative z-10">
              Assuming every system is incorrect by default. Validating
              behavior through failure cases, edge conditions, and real
              execution paths instead of trusting design assumptions.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 md:mt-24">
        <ScrollReveal delay={0.1} direction="right">
          <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer relative overflow-hidden group h-full transition-all duration-300 hover:border-accent-tertiary/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-tertiary opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-4xl group-hover:opacity-30 group-hover:text-accent-tertiary transition-all duration-500 pointer-events-none">
              &lt;/&gt;
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center gap-3 group-hover:text-accent-tertiary transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">
              <span className="w-2 h-2 bg-accent-tertiary group-hover:animate-pulse shadow-[0_0_5px_#ffd700]"></span>{" "}
              03 // TECHNICAL ARSENAL
            </h3>
            <div className="space-y-5 px-1 md:px-3 relative z-10">
              <div className="group/item">
                <div className="text-[10px] md:text-xs text-muted-foreground mb-1 group-hover/item:text-accent-tertiary/70 transition-colors font-sans font-bold tracking-widest">
                  LANGUAGES
                </div>
                <div className="font-mono text-xs md:text-sm text-accent-tertiary group-hover:brightness-125 transition-all">
                  Java, Node.js, Go, .NET, PHP, Vue
                </div>
              </div>
              <div className="group/item">
                <div className="text-[10px] md:text-xs text-muted-foreground mb-1 group-hover/item:text-accent-secondary/70 transition-colors font-sans font-bold tracking-widest">
                  INFRASTRUCTURE
                </div>
                <div className="font-mono text-xs md:text-sm text-accent-secondary group-hover:brightness-125 transition-all">
                  AWS, EKS, Kubernetes, Docker
                </div>
              </div>
              <div className="group/item">
                <div className="text-[10px] md:text-xs text-muted-foreground mb-1 group-hover/item:text-accent/70 transition-colors font-sans font-bold tracking-widest">
                  DATABASES & MESSAGING
                </div>
                <div className="font-mono text-xs md:text-sm text-accent group-hover:brightness-125 transition-all">
                  OracleSQL, MySQL, DuckDB, Redis, Kafka, RabbitMQ
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="left">
          <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer relative overflow-hidden group h-full transition-all duration-300 hover:border-destructive/50 hover:shadow-[0_0_30px_rgba(255,51,51,0.2)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center gap-3 group-hover:text-destructive transition-colors drop-shadow-[0_0_5px_rgba(255,51,51,0.3)]">
              <span className="w-2 h-2 bg-destructive animate-pulse shadow-[0_0_8px_#ff3333]"></span>{" "}
              04 // OPERATIONAL AXIOMS
            </h3>
            <ul className="space-y-4 px-1 md:px-3 font-mono text-xs md:text-sm relative z-10">
              {[
                "Firefighting doesn't scale. Build systems that are boring in production.",
                "Documentation is infrastructure. If it's not documented, it's debt.",
                "Capacity must meet commitment. Optimism is not a strategy.",
                "Ship safely over ship quickly. Delivery without safety is shipping problems.",
              ].map((axiom, i) => (
                <li key={i} className="flex gap-3 group/li items-start">
                  <span className="text-accent group-hover:text-destructive transition-colors mt-0.5">
                    &gt;
                  </span>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors group-hover/li:translate-x-1 transition-transform">
                    {axiom}
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute -bottom-4 right-0 font-black text-6xl text-white/[0.02] pointer-events-none uppercase italic group-hover:text-destructive/[0.05] transition-colors">
              RULES
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
