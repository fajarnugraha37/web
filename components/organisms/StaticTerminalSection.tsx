import React from "react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";

export function StaticTerminalSection() {
  return (
    <div className="hidden lg:flex flex-col relative justify-center w-full max-w-lg mx-auto lg:max-w-none">
      <ScrollReveal delay={0.4} direction="left">
        <div className="bg-card border border-border p-1 relative shadow-[0_10px_40px_rgba(255,115,0,0.15)] cyber-chamfer">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-muted mb-1 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive/70"></div>
              <div className="w-2 h-2 rounded-full bg-accent-tertiary/70"></div>
              <div className="w-2 h-2 rounded-full bg-accent/70"></div>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-sans">
              Terminal // dev_root
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-4 md:p-6 space-y-4 text-xs md:text-sm font-mono text-foreground/80 overflow-x-hidden">
            <div className="flex items-start gap-3">
              <span className="text-accent">&gt;</span>
              <p className="text-accent/90 break-all">
                cat telemetry.json | grep engine
              </p>
            </div>
            <div className="pl-6 space-y-2 text-foreground/70">
              <div className="flex justify-between border-b border-border pb-1">
                <span>Language_Stack</span>
                <span className="text-accent-secondary">
                  Java, Node.js, Go, .NET, PHP
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span>Primary_Focus</span>
                <span className="text-accent">
                  Backend, Sometimes Frontend
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <span className="text-accent">&gt;</span>
              <p className="text-accent/90 break-all">
                ./mount_volumes.sh --force
              </p>
            </div>
            <div className="pl-6">
              <span className="text-muted-foreground animate-pulse">
                Mounting virtual filesystems... [OK]
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-accent">&gt;</span>
              <span className="w-2 h-4 md:h-5 bg-accent animate-pulse shadow-[0_0_5px_#ff7300]"></span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

