"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { NotFoundTerminal } from "@/components/molecules/NotFoundTerminal";
import { NotFoundDetails } from "@/components/molecules/NotFoundDetails";

/**
 * Organism: NotFoundContent
 * Orchestrates the full layout and interactive elements of the 404 page.
 */
export function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-destructive opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-secondary opacity-5 blur-[120px] rounded-full pointer-events-none" />

      {/* Scanline overlay */}
      <div className="not-found-scanlines absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 py-8 max-w-3xl mx-auto">
        {/* Status badge */}
        <div className="inline-block border border-destructive/50 bg-card px-3 py-1 text-xs font-mono mb-8 cyber-chamfer-reverse text-destructive self-center">
          <span className="animate-blink mr-2">&gt;</span> PAGE_NOT_FOUND //
          ROUTE_UNREACHABLE
        </div>

        {/* Big 404 glitch */}
        <div className="relative mb-4 select-none" aria-hidden="true">
          <h1
            className="text-[6rem] sm:text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-foreground/10 cyber-glitch-text relative"
            data-text="404"
          >
            <span className="relative z-10 text-foreground/10">404</span>
            <span className="not-found-glitch-1 absolute inset-0 text-destructive/60 z-20">
              404
            </span>
            <span className="not-found-glitch-2 absolute inset-0 text-accent-tertiary/60 z-20">
              404
            </span>
          </h1>
        </div>

        {/* Error heading */}
        <h2
          className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-widest text-foreground mb-4 cyber-glitch-text"
          data-text="PAGE_NOT_FOUND"
        >
          PAGE_NOT_FOUND
        </h2>

        {/* Neon divider */}
        <div className="h-px w-32 bg-destructive shadow-[0_0_10px_#ff3366] mb-8" />

        <NotFoundTerminal />
        <NotFoundDetails />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Button
            asChild
            variant="default"
            className="w-full sm:w-auto"
          >
            <Link href="/">&gt; SYS//OP</Link>
          </Button>
          <Button
            asChild
            variant="neutral"
            className="w-full sm:w-auto hover:border-accent-tertiary hover:text-accent-tertiary"
          >
            <Link href="/blogs">READ_LOGS</Link>
          </Button>
          <Button
            asChild
            variant="neutral"
            className="w-full sm:w-auto hover:border-accent-secondary hover:text-accent-secondary glow-btn-secondary"
          >
            <Link href="/contacts">CONTACT.EXE</Link>
          </Button>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-destructive/30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-destructive/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-destructive/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-destructive/30 pointer-events-none" />
      </div>
    </div>
  );
}
