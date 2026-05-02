"use client";

import { useState, useCallback } from "react";
import { ContactLink } from "@/types";
import { useTerminalStore } from "@/lib/store/useTerminalStore";

interface UseTerminalProps {
  links: ContactLink[];
}

export function useTerminal({ links }: UseTerminalProps) {
  const output = useTerminalStore(state => state.output);
  const history = useTerminalStore(state => state.history);
  const addOutput = useTerminalStore(state => state.addOutput);
  const clearOutput = useTerminalStore(state => state.clearOutput);
  const addHistory = useTerminalStore(state => state.addHistory);
  const clearHistory = useTerminalStore(state => state.clearHistory);

  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    addOutput([`guest@sysop:~$ ${trimmedCmd}`]);
    addHistory(trimmedCmd);

    const args = trimmedCmd.toLowerCase().split(" ");
    const mainCmd = args[0];

    switch (mainCmd) {
      case "help":
        addOutput([
          "AVAILABLE_COMMANDS:",
          "  help     - Display this manual",
          "  clear    - Clear terminal buffer",
          "  ls       - List available neural links",
          "  connect  - Initiate link (usage: connect <link_name>)",
          "  whoami   - Display identity matrix",
          "  date     - Display system time",
          "  sudo     - Attempt privilege escalation",
          " ",
        ]);
        break;
      case "clear":
        clearOutput();
        break;
      case "ls":
        addOutput([
          "NEURAL_LINKS_DETECTED:",
          ...links.map((link) => `  - ${link.name.toLowerCase()}`),
          " ",
        ]);
        break;
      case "connect":
        const target = args[1];
        if (!target) {
          addOutput(["ERROR: Target parameter required. Usage: connect <link_name>", " "]);
          break;
        }
        const link = links.find((l) => l.name.toLowerCase() === target);
        if (link) {
          addOutput([
            `ESTABLISHING_LINK: ${link.name}...`,
            "HANDSHAKE: OK",
            "REDIRECTING...",
            " ",
          ]);
          setTimeout(() => {
            window.open(link.url, "_blank");
          }, 1000);
        } else {
          addOutput([`ERROR: Link '${target}' not found in registry.`, " "]);
        }
        break;
      case "whoami":
        addOutput(["guest_user", "ACCESS_LEVEL: VISITOR", " "]);
        break;
      case "date":
        addOutput([new Date().toISOString(), " "]);
        break;
      case "sudo":
        addOutput([
          "WARNING: UNAUTHORIZED_ACCESS_ATTEMPT",
          "INCIDENT_LOGGED.",
          "Nice try.",
          " ",
        ]);
        break;
      default:
        addOutput([`Command not found: ${mainCmd}`, "Type 'help' for available commands.", " "]);
    }
  }, [links, addOutput, addHistory, clearOutput]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        if (newIndex >= 0) {
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  }, [input, history, historyIndex, handleCommand]);

  return {
    output,
    input,
    setInput,
    onKeyDown,
    setOutput: (newOutput: string[] | ((prev: string[]) => string[])) => {
       // Support for backward compatibility
       if (typeof newOutput === 'function') {
         // edge case logic if needed
       } else {
         addOutput(newOutput);
       }
    }
  };
}
