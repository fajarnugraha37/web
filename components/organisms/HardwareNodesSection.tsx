"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Database, BarChart3, Share2 } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";

export function HardwareNodesSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background -z-10 pointer-events-none opacity-25" />

      <ScrollReveal direction="up">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground flex items-center gap-4">
            <span className="text-accent drop-shadow-[0_0_5px_#ff7300]">
              01 //
            </span>{" "}
            HARDWARE NODES
          </h2>
          <Link
            href="/labs"
            className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
          >
            [VIEW_ALL_MODULES] <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScrollReveal delay={0.1} direction="up">
          <Link
            href="/labs/postgresql"
            className="group flex flex-col p-6 border border-border bg-card/80 backdrop-blur-sm cyber-chamfer hover:border-accent hover:shadow-[0_0_20px_rgba(255,115,0,0.15)] transition-all relative overflow-hidden h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted/30 border border-border group-hover:border-accent/40 text-accent transition-colors">
                <Database className="w-8 h-8" />
              </div>
              <div className="flex flex-col items-end font-mono text-[10px] uppercase">
                <span className="text-muted-foreground">NODE_STATUS</span>
                <span className="text-accent animate-pulse">[ONLINE]</span>
              </div>
            </div>
            <h3 className="text-2xl font-black mb-2 text-foreground group-hover:text-accent transition-colors">
              SQL LAB.EXE
            </h3>
            <p className="text-sm font-mono text-muted-foreground mb-6">
              Persistent PostgreSQL WASM Node. Fully ACID compliant relational
              database running directly in your browser.
            </p>
            <div className="mt-auto flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-accent opacity-80 group-hover:opacity-100 transition-opacity">
              <span>CONNECT_NODE</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="up">
          <Link
            href="/labs/duckdb"
            className="group flex flex-col p-6 border border-border bg-card/80 backdrop-blur-sm cyber-chamfer hover:border-accent-secondary hover:shadow-[0_0_20px_rgba(255,0,127,0.15)] transition-all relative overflow-hidden h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted/30 border border-border group-hover:border-accent-secondary/40 text-accent-secondary transition-colors">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="flex flex-col items-end font-mono text-[10px] uppercase">
                <span className="text-muted-foreground">NODE_STATUS</span>
                <span className="text-accent-secondary animate-pulse">
                  [STREAMING]
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-black mb-2 text-foreground group-hover:text-accent-secondary transition-colors">
              TELEMETRY ANALYTICS.EXE
            </h3>
            <p className="text-sm font-mono text-muted-foreground mb-6">
              OLAP engine powered by DuckDB-WASM. Drop massive CSV/Parquet
              files and query them with zero latency.
            </p>
            <div className="mt-auto flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-accent-secondary opacity-80 group-hover:opacity-100 transition-opacity">
              <span>CONNECT_NODE</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.3} direction="up">
          <Link
            href="/labs/knowledge-graph"
            className="group flex flex-col p-6 border border-border bg-card/80 backdrop-blur-sm cyber-chamfer hover:border-accent-tertiary hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all relative overflow-hidden h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted/30 border border-border group-hover:border-accent-tertiary/40 text-accent-tertiary transition-colors">
                <Share2 className="w-8 h-8" />
              </div>
              <div className="flex flex-col items-end font-mono text-[10px] uppercase">
                <span className="text-muted-foreground">NODE_STATUS</span>
                <span className="text-accent-tertiary animate-pulse">
                  [MAPPING]
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-black mb-2 text-foreground group-hover:text-accent-tertiary transition-colors">
              BLOG NETWORK.EXE
            </h3>
            <p className="text-sm font-mono text-muted-foreground mb-6">
              Interactive 3D visualization of semantic relationships within
              the blog archive using three.js
            </p>
            <div className="mt-auto flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-accent-tertiary opacity-80 group-hover:opacity-100 transition-opacity">
              <span>CONNECT_NODE</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </ScrollReveal>
      </div>
      <div className="mt-6 md:hidden flex justify-center">
        <Link
          href="/labs"
          className="flex items-center gap-2 text-xs font-mono text-accent hover:text-white transition-colors"
        >
          [VIEW_ALL_MODULES] <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
