"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useState, useEffect, useCallback, useRef } from "react";
import { Play, RotateCcw, Clock } from "lucide-react";

interface SqlEditorProps {
  onExecute: (query: string, page?: number, size?: number) => void;
  isLoading: boolean;
  disabled: boolean;
}

export function SqlEditor({ onExecute, isLoading, disabled }: SqlEditorProps) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sysop_cmd_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse command history");
      }
    }
  }, []);

  const handleExecute = useCallback(() => {
    if (!query.trim() || isLoading || disabled) return;

    // Update history
    const newHistory = [query, ...history.filter((h) => h !== query)].slice(
      0,
      50,
    );
    setHistory(newHistory);
    localStorage.setItem("sysop_cmd_history", JSON.stringify(newHistory));
    setHistoryIndex(-1);

    onExecute(query);
  }, [query, history, isLoading, disabled, onExecute]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleExecute();
    }

    // Command History Navigation
    if (e.key === "ArrowUp" && (query === "" || historyIndex !== -1)) {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      if (nextIndex !== -1) {
        setHistoryIndex(nextIndex);
        setQuery(history[nextIndex]);
      }
    }

    if (e.key === "ArrowDown" && historyIndex !== -1) {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      if (nextIndex === -1) {
        setQuery("");
      } else {
        setQuery(history[nextIndex]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setQuery(content);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const clearHistory = () => {
    if (confirm("Clear command history?")) {
      setHistory([]);
      localStorage.removeItem("sysop_cmd_history");
    }
  };

  return (
    <div className="flex flex-col border border-border bg-[#0a0a0f] overflow-hidden group">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isLoading ? "bg-accent animate-pulse shadow-[0_0_8px_#00ff88]" : "bg-accent/40"}`}
            />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Terminal.exe // {isLoading ? "EXECUTING..." : "IDLE"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            id="sql-import"
            accept=".sql"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById("sql-import")?.click()}
            className="p-1.5 hover:text-accent transition-colors text-muted-foreground flex items-center gap-1 font-mono text-[9px] uppercase tracking-tighter"
            title="Import SQL File"
          >
            [IMPORT]
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1.5 hover:text-accent transition-colors text-muted-foreground"
            title="Command History"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={setQuery.bind(null, "")}
            className="p-1.5 hover:text-destructive transition-colors text-muted-foreground"
            title="Clear Buffer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExecute}
            disabled={isLoading || disabled || !query.trim()}
            className="ml-2 flex items-center gap-2 px-4 py-1 bg-accent text-black font-mono text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            RUN_QUERY
          </button>
        </div>
      </div>

      <div className="relative">
        <CodeMirror
          value={query}
          height="200px"
          theme={vscodeDark}
          extensions={[sql()]}
          onChange={(value) => {
            setQuery(value);
            if (historyIndex !== -1 && value !== history[historyIndex]) {
              setHistoryIndex(-1);
            }
          }}
          onKeyDownCapture={handleKeyDown}
          className="text-sm font-mono"
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: true,
            allowMultipleSelections: false,
            indentOnInput: true,
          }}
        />

        {/* History Overlay */}
        {showHistory && history.length > 0 && (
          <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md p-4 overflow-auto border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-accent">
                  RECENT_COMMANDS
                </span>
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-destructive hover:underline uppercase tracking-tighter"
                >
                  Clear History
                </button>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-[10px] text-muted-foreground hover:text-white underline"
              >
                CLOSE
              </button>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(h);
                    setShowHistory(false);
                  }}
                  className="w-full text-left p-2 border border-border/50 hover:border-accent/50 hover:bg-accent/5 font-mono text-xs truncate transition-all"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Boot Sequence Overlay */}
        {disabled && !isLoading && (
          <div className="absolute inset-0 z-40 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-accent animate-pulse tracking-[0.3em]">
                RE-INITIALIZING_HARDWARE...
              </span>
              <div className="w-32 h-1 bg-muted overflow-hidden relative">
                <div className="absolute inset-0 bg-accent w-1/2 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer shortcut info */}
      <div className="px-4 py-1 bg-muted/10 border-t border-border/50 flex justify-between">
        <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
          Ctrl+Enter to Execute | Arrows to navigate history
        </span>
      </div>
    </div>
  );
}
