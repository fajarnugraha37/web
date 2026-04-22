"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Wraps the Executive Summary block.
 * Collapsed: shows ~3 lines via .expandable-summary-panel max-height.
 * Expanded: grows to --expand-height CSS custom property value.
 */
export function ExpandableSummary({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <div className="bg-card/40 border-l-4 border-accent p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      {/* Collapsible body — overflow/transition in CSS, dynamic height via custom prop */}
      <div
        className="expandable-summary-panel"
        data-expanded={expanded ? "true" : "false"}
        // CSS variable is not a style declaration; it feeds the CSS class rule above
        style={{ "--expand-height": `${height}px` } as React.CSSProperties}
      >
        <div ref={contentRef}>{children}</div>

        {/* Fade mask — inside the clipped box so it never covers the button */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#12121a] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle button — outside the clipped area */}
      <button
        type="button"
        id="summary-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex items-center gap-2 font-mono text-xs text-accent-tertiary hover:text-accent transition-colors"
        aria-expanded={expanded ? "true" : "false"}
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
