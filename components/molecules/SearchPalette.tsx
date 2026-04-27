"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useSearchIndex } from "@/hooks/useSearchIndex";

interface SearchPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SearchPalette = ({ isOpen, setIsOpen }: SearchPaletteProps) => {
  const { query, setQuery, results } = useSearchIndex();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 border border-border/50 bg-card/30 hover:border-accent hover:text-accent rounded-md text-xs font-mono transition-all"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">SEARCH</span>
        <kbd className="hidden sm:inline bg-border/20 px-1 py-0.5 rounded text-[10px]">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          /* MODAL WRAPPER: Centers the search box. No backdrop here, it's handled by Header. */
          <div className="fixed inset-0 z-[100] flex justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              className="relative w-full max-w-lg bg-card border border-accent/30 shadow-2xl rounded-xl overflow-hidden h-fit pointer-events-auto"
              onClick={(e) => e.stopPropagation()} // Prevents clicks inside from bubbling to parent
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-accent" />
                <input
                  ref={inputRef}
                  placeholder="QUERY LOGS..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm placeholder:opacity-50 text-foreground"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={() => setIsOpen(false)} className="p-1 hover:text-accent">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  results.map((res) => (
                    <Link
                      key={res.id}
                      href={`/blogs/${res.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 border-b border-border/30 hover:bg-accent/5 hover:border-accent/20 transition-all group"
                    >
                      <div className="font-bold font-sans text-sm group-hover:text-accent flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        {res.title}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1 truncate">
                        {res.description}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground font-mono text-xs opacity-50">
                    {query ? "NO_MATCHES_FOUND" : "INPUT_QUERY_TO_INITIALIZE"}
                  </div>
                )}
              </div>
              <div className="bg-muted/30 p-2 text-[9px] font-mono text-center opacity-60">
                ESC to DISCONNECT
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
