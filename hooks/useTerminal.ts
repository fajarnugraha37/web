"use client";

import { useState, useEffect, useCallback } from "react";
import { ContactLink } from "@/types";

interface UseTerminalProps {
  links: ContactLink[];
}

/**
 * Headless Hook: useTerminal
 * Manages terminal state, history, command processing, and typing simulation.
 */
export function useTerminal({ links }: UseTerminalProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initial Boot-up Typing Effect
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

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response: string[] = [];
    if (!trimmed) return;

    if (trimmed === "help") {
      response = [
        "Available commands:", 
        "  help    - Show this message", 
        "  ls      - List protocols", 
        "  connect [target]", 
        "  clear   - Clear output"
      ];
    } else if (trimmed === "ls") {
      response = [
        "Available protocols:", 
        ...links.map((link) => `  [${link.name.padEnd(8)}] - ${link.desc}`)
      ];
    } else if (trimmed === "clear") {
      setOutput([]);
      return;
    } else if (trimmed.startsWith("connect ")) {
      const target = trimmed.split(" ")[1];
      const link = links.find((l) => l.name.toLowerCase() === target);
      if (link) {
        response = [
          `Initiating handshake with ${link.name}...`, 
          `Opening secure channel: ${link.url}`
        ];
        setTimeout(() => { window.open(link.url, "_blank"); }, 800);
      } else {
        response = [`Error: Target '${target}' not found.`];
      }
    } else {
      response = [`Command not found: ${trimmed}.`];
    }
    setOutput((prev) => [...prev, `sys_op@terminal:~$ ${cmd}`, ...response]);
  }, [links]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
        if (newIndex >= history.length) { 
          setHistoryIndex(-1); 
          setInput(""); 
        } else { 
          setHistoryIndex(newIndex); 
          setInput(history[newIndex]); 
        }
      }
    }
  }, [input, history, historyIndex, handleCommand]);

  return {
    output,
    input,
    setInput,
    onKeyDown,
    setOutput
  };
}
