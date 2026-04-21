"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Wraps the Executive Summary block.
 * Collapsed: shows the first 3 lines (line-clamp-3).
 * Expanded: shows all content with a smooth height transition.
 */
export function ExpandableSummary({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  // Measure full height whenever content renders
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <div className="bg-card/40 border-l-4 border-accent p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      {/* Collapsible body */}
      <div
        className="relative"
        style={{
          maxHeight: expanded ? height : "4.8rem",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div ref={contentRef}>{children}</div>

        {/* Fade mask — lives inside the clipped box so it never overlaps the button */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#12121a] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle button — always outside the clipped area */}
      <button
        type="button"
        id="summary-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex items-center gap-2 font-mono text-xs text-accent-tertiary hover:text-accent transition-colors"
        aria-expanded={expanded}
      >
        <span
          className={`w-3 h-3 border border-accent-tertiary flex items-center justify-center text-[8px] transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
        {expanded ? "COLLAPSE_SUMMARY" : "EXPAND_SUMMARY"}
        <span className="animate-blink">_</span>
      </button>
    </div>
  );
}
