"use client";

import React, { useRef, useEffect } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { ContactLink } from "@/types";

interface TerminalSectionProps {
  links: ContactLink[];
}

/**
 * Organism: TerminalSection
 * Renders the interactive terminal with auto-scrolling and command execution.
 */
export function TerminalSection({ links }: TerminalSectionProps) {
  const { output, input, setInput, onKeyDown } = useTerminal({ links });
  const terminalContentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic: scroll ONLY the terminal container
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTo({
        top: terminalContentRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [output]);

  return (
    <section className="relative">
      <div className="inline-flex items-center border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold mb-4 text-accent cyber-chamfer-reverse shadow-[0_0_10px_rgba(56,189,248,0.3)]">
        <span className="animate-blink mr-2 text-accent-tertiary">&gt;</span>HOLO_TERM // SYS_OP
      </div>
      <div className="relative p-[1px] bg-gradient-to-br from-accent/50 via-accent-secondary/30 to-transparent shadow-[0_0_30px_rgba(56,189,248,0.15)] group hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-shadow duration-500">
        <div className="bg-card/40 backdrop-blur-xl border border-transparent flex flex-col h-[400px] overflow-hidden relative">
          <div className="bg-background/60 border-b border-accent/20 p-2 flex items-center justify-between z-20 backdrop-blur-sm">
            <div className="flex space-x-2 px-2">
              <div className="w-3 h-3 bg-destructive/80 shadow-[0_0_5px_#ef4444]" />
              <div className="w-3 h-3 bg-accent-tertiary/80 shadow-[0_0_5px_#fde047]" />
              <div className="w-3 h-3 bg-accent/80 shadow-[0_0_5px_#38bdf8]" />
            </div>
            <div className="text-[10px] md:text-xs font-mono text-accent-secondary uppercase tracking-widest drop-shadow-[0_0_2px_#fb923c]">root@sys_op: ~/comms</div>
          </div>
          
          <div 
            ref={terminalContentRef}
            className="p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed overflow-y-auto flex-1 z-20" 
            onClick={() => document.getElementById("terminal-input")?.focus()}
          >
            <div className="text-accent-secondary mb-6 whitespace-pre font-bold">
{`   _____ __  _______  __   ____  ____ 
  / ___// / / / ___/ / /  / __ \\/ __ \\
  \\__ \\/ /_/ /\\__ \\ / /  / / / / /_/ /
 ___/ /\\__, /___/ // /__/ /_/ / ____/ 
/____/ /____//____//____\\____/_/     `}
            </div>
            <div className="space-y-2 mb-4 text-foreground/90">
              {output.map((line, i) => (
                <div 
                  key={i} 
                  className={
                    line.startsWith("sys_op@") 
                      ? "text-accent mt-4 font-bold" 
                      : line.startsWith("Error:") 
                        ? "text-destructive" 
                        : "text-accent-tertiary"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center text-accent mt-4">
              <span className="mr-2 font-bold">sys_op@terminal:~$</span>
              <input 
                id="terminal-input" 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={onKeyDown} 
                className="flex-1 bg-transparent outline-none border-none text-foreground caret-accent-secondary p-0 focus:ring-0" 
                autoComplete="off" 
                spellCheck="false" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
