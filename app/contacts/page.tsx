"use client";

import { useState, useEffect, useRef } from "react";

const LINKS = [
  {
    name: "GITHUB",
    url: "https://github.com/fajarnugraha37",
    desc: "Open source contributions & dotfiles",
  },
  {
    name: "LINKEDIN",
    url: "https://www.linkedin.com/in/fajar-abdi-nugraha-81b26618a/",
    desc: "Corporate networking & resume",
  },
  {
    name: "INSTAGRAM",
    url: "https://www.instagram.com/fajarnugraha37/",
    desc: "Share what you're into with the people who get you",
  },
  {
    name: "EMAIL",
    url: "mailto:nugrahafajar37@gmail.com",
    desc: "Personal Email address",
  },
];

export default function ContactsPage() {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const lines = [
      "Welcome to SYS//OP Secure Terminal",
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
          await new Promise((r) => setTimeout(r, 20)); // Typing speed
        }
        await new Promise((r) => setTimeout(r, 100)); // Pause between lines
      }
    };
    runTyping();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response: string[] = [];

    if (!trimmed) return;

    if (trimmed === "help") {
      response = [
        "Available commands:",
        "  help    - Show this message",
        "  ls      - List available connection protocols",
        "  connect [target] - Initiate connection to target (e.g. 'connect github')",
        "  clear   - Clear terminal output",
      ];
    } else if (trimmed === "ls") {
      response = [
        "Available protocols:",
        ...LINKS.map((link) => `  [${link.name.padEnd(8)}] - ${link.desc}`),
      ];
    } else if (trimmed === "clear") {
      setOutput([]);
      return;
    } else if (trimmed.startsWith("connect ")) {
      const target = trimmed.split(" ")[1];
      const link = LINKS.find((l) => l.name.toLowerCase() === target);
      if (link) {
        response = [
          `Initiating handshake with ${link.name}...`,
          `Opening secure channel: ${link.url}`,
        ];
        setTimeout(() => {
          window.open(link.url, "_blank");
        }, 800);
      } else {
        response = [
          `Error: Target '${target}' not found. Use 'ls' to see available targets.`,
        ];
      }
    } else {
      response = [
        `Command not found: ${trimmed}. Type 'help' for available commands.`,
      ];
    }

    setOutput((prev) => [...prev, `sys_op@terminal:~$ ${cmd}`, ...response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim()) {
        setHistory((prev) => [...prev, input]);
      }
      handleCommand(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(historyIndex - 1, 0);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="py-12 md:py-20 h-full flex flex-col items-center">
      <div className="w-full max-w-3xl flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-foreground">
            SECURE_COMMS
          </h1>
        </div>

        {/* Terminal Window */}
        <div className="border border-border bg-[#050508] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex-1 min-h-[500px] flex flex-col cyber-chamfer overflow-hidden relative">
          {/* Scanline overlay for terminal only */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10" />

          {/* Terminal Header */}
          <div className="bg-card border-b border-border p-2 flex items-center justify-between z-20">
            <div className="flex space-x-2 px-2">
              <div className="w-3 h-3 rounded-none bg-destructive cyber-chamfer-sm"></div>
              <div className="w-3 h-3 rounded-none bg-yellow-500 cyber-chamfer-sm"></div>
              <div className="w-3 h-3 rounded-none bg-accent cyber-chamfer-sm"></div>
            </div>
            <div
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest cyber-glitch-text"
              data-text="root@sys_op: ~/comms"
            >
              root@sys_op: ~/comms
            </div>
          </div>

          {/* Terminal Body */}
          <div
            className="p-6 font-mono text-sm leading-relaxed overflow-y-auto flex-1 z-20 scrollbar-hide"
            onClick={() => document.getElementById("terminal-input")?.focus()}
          >
            <div className="text-accent mb-6 whitespace-pre-wrap">
              {`   _____ __  _______  __   ____  ____ 
  / ___// / / / ___/ / /  / __ \\/ __ \\
  \\__ \\/ /_/ /\\__ \\ / /  / / / / /_/ /
 ___/ /\\__, /___/ // /__/ /_/ / ____/ 
/____/ /____//____//____\\____/_/     
`}
            </div>

            <div className="space-y-1 mb-4 text-foreground/80">
              {output.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith("sys_op@") ? "text-accent mt-4" : ""
                  }
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Input Line */}
            <div className="flex items-center text-accent mt-4">
              <span className="mr-2">sys_op@terminal:~$</span>
              <input
                id="terminal-input"
                type="text"
                aria-label="Terminal input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-foreground caret-accent p-0 focus:ring-0"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
            </div>
            {/* Blinking cursor effect handled by CSS caret or manual if needed */}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Fallback standard links for mobile/accessibility */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center font-mono text-xs p-3 border border-border hover:border-accent hover:text-accent hover:shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all cyber-chamfer-sm"
            >
              {"//"} {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
