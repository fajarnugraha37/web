"use client";

import { PageTransition } from "@/components/atoms/PageTransition";
import { useState, useEffect, useRef } from "react";

const LINKS = [
  { name: "GITHUB", url: "https://github.com/fajarnugraha37", desc: "Open source contributions & dotfiles" },
  { name: "LINKEDIN", url: "https://www.linkedin.com/in/fajar-abdi-nugraha-81b26618a/", desc: "Corporate networking & resume" },
  { name: "INSTAGRAM", url: "https://www.instagram.com/fajarnugraha37/", desc: "Share what you're into with the people who get you" },
  { name: "EMAIL", url: "mailto:nugrahafajar37@gmail.com", desc: "Personal Email address" },
];

export default function ContactsPage() {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const lines = [
      "Welcome to SYS//OP Secure Terminal [MORNING_PROTO_v1.0]",
      "Establishing connection to neural net...",
      "Type 'help' to see available commands or 'ls' to view comm channels.",
      "",
    ];

    const runTyping = async () => {
      let currentOut: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        if (!isMounted) return;
        currentOut.push("");
        for (let c = 0; c < lines[i].length; c++) {
          if (!isMounted) return;
          currentOut[i] = lines[i].substring(0, c + 1);
          setOutput([...currentOut]);
          await new Promise((r) => setTimeout(r, 5));
        }
        await new Promise((r) => setTimeout(r, 5));
      }
    };
    runTyping();
    return () => { isMounted = false; };
  }, []);

  // Corrected Auto-scroll logic: scroll ONLY the terminal container
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTo({
        top: terminalContentRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [output]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response: string[] = [];
    if (!trimmed) return;

    if (trimmed === "help") {
      response = ["Available commands:", "  help    - Show this message", "  ls      - List protocols", "  connect [target]", "  clear   - Clear output"];
    } else if (trimmed === "ls") {
      response = ["Available protocols:", ...LINKS.map((link) => `  [${link.name.padEnd(8)}] - ${link.desc}`)];
    } else if (trimmed === "clear") {
      setOutput([]);
      return;
    } else if (trimmed.startsWith("connect ")) {
      const target = trimmed.split(" ")[1];
      const link = LINKS.find((l) => l.name.toLowerCase() === target);
      if (link) {
        response = [`Initiating handshake with ${link.name}...`, `Opening secure channel: ${link.url}`];
        setTimeout(() => { window.open(link.url, "_blank"); }, 800);
      } else {
        response = [`Error: Target '${target}' not found.`];
      }
    } else {
      response = [`Command not found: ${trimmed}.`];
    }
    setOutput((prev) => [...prev, `sys_op@terminal:~$ ${cmd}`, ...response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim()) setHistory((prev) => [...prev, input]);
      handleCommand(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(historyIndex - 1, 0);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) { setHistoryIndex(-1); setInput(""); }
        else { setHistoryIndex(newIndex); setInput(history[newIndex]); }
      }
    }
  };

  return (
    <div className="theme-morning relative min-h-screen font-mono text-foreground overflow-x-hidden pb-20">
      <div className="fixed inset-0 bg-background -z-50 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-[-40] bg-gradient-to-tr from-accent/5 via-background to-accent-secondary/5 mix-blend-screen" />
      <div className="fixed inset-0 cyber-grid-bg -z-20 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(56,189,248,0.03),rgba(251,146,60,0.02),rgba(253,224,71,0.03))] bg-[length:100%_4px,3px_100%] opacity-30 mix-blend-overlay" />

      <PageTransition>
        <div className="pt-12 md:pt-24 max-w-4xl mx-auto px-4 md:px-8 relative z-10 space-y-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary cyber-glitch-text pb-2" data-text="COMMS UPLINK">COMMS UPLINK</h1>
            <p className="text-muted-foreground mt-4 text-sm max-w-xl">Establish a secure connection vector. Awaiting user input parameters...</p>
          </div>

          <div className="flex flex-col gap-12 w-full max-w-3xl mx-auto">
            <section className="relative">
              <div className="inline-flex items-center border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold mb-4 text-accent cyber-chamfer-reverse shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                <span className="animate-blink mr-2 text-accent-tertiary">&gt;</span>HOLO_TERM // SYS_OP
              </div>
              <div className="relative p-[1px] bg-gradient-to-br from-accent/50 via-accent-secondary/30 to-transparent shadow-[0_0_30px_rgba(56,189,248,0.15)] group hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-shadow duration-500">
                <div className="bg-card/40 backdrop-blur-xl border border-transparent flex flex-col h-[400px] overflow-hidden relative">
                  <div className="bg-background/60 border-b border-accent/20 p-2 flex items-center justify-between z-20 backdrop-blur-sm">
                    <div className="flex space-x-2 px-2"><div className="w-3 h-3 bg-destructive/80 shadow-[0_0_5px_#ef4444]" /><div className="w-3 h-3 bg-accent-tertiary/80 shadow-[0_0_5px_#fde047]" /><div className="w-3 h-3 bg-accent/80 shadow-[0_0_5px_#38bdf8]" /></div>
                    <div className="text-[10px] md:text-xs font-mono text-accent-secondary uppercase tracking-widest drop-shadow-[0_0_2px_#fb923c]">root@sys_op: ~/comms</div>
                  </div>
                  {/* Target for internal scrolling */}
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
                        <div key={i} className={line.startsWith("sys_op@") ? "text-accent mt-4 font-bold" : line.startsWith("Error:") ? "text-destructive" : "text-accent-tertiary"}>{line}</div>
                      ))}
                    </div>
                    <div className="flex items-center text-accent mt-4"><span className="mr-2 font-bold">sys_op@terminal:~$</span><input id="terminal-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none border-none text-foreground caret-accent-secondary p-0 focus:ring-0" autoComplete="off" spellCheck="false" /></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="inline-flex items-center border border-accent-tertiary/40 bg-accent-tertiary/10 px-3 py-1 text-xs font-bold mb-4 text-accent-tertiary cyber-chamfer-reverse shadow-[0_0_10px_rgba(253,224,71,0.2)]">
                <span className="animate-blink mr-2 text-accent">&gt;</span>NEURAL_LINKS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LINKS.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col p-4 bg-card/30 backdrop-blur-md border border-accent/20 cyber-chamfer-sm hover:border-accent hover:bg-accent/5 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-bold text-xs md:text-sm text-foreground group-hover:text-accent transition-colors">{"//"} {link.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1 group-hover:text-accent/70">{link.desc}</span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-accent font-bold">]</div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
