"use client";

import React, { useState, useEffect, useMemo } from "react";
import MiniSearch from "minisearch";
import { Search, X, Command, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  tags: string[];
  description: string;
}

export const SearchPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);

  // Use useMemo to handle results derived from query/index, avoiding useEffect setState sync
  const results = useMemo(() => {
    if (miniSearch && query) {
      return miniSearch.search(query, { fuzzy: 0.2 }) as unknown as SearchResult[];
    }
    return [];
  }, [query, miniSearch]);

  useEffect(() => {
    const fetchIndex = async () => {
      const res = await fetch("/search-index.json");
      const data = await res.json();
      const ms = new MiniSearch({
        fields: ["title", "tags", "description"],
        storeFields: ["title", "tags", "description"],
      });
      ms.addAll(data);
      setMiniSearch(ms);
    };
    fetchIndex();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center pt-[15vh] px-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-lg bg-card border border-accent/30 shadow-2xl rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-accent" />
                <input
                  autoFocus
                  placeholder="QUERY_KNOWLEDGE_BASE..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm placeholder:opacity-50"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
