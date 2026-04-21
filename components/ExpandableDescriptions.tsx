"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  descriptions: string[];
};

/**
 * Renders a list of career description bullet points.
 * Collapsed: shows only the first description truncated to 1 line.
 * Expanded: shows all descriptions with a smooth height transition.
 */
export function ExpandableDescriptions({ descriptions }: Props) {
  const [expanded, setExpanded] = useState(false);
  const fullRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState(0);

  useEffect(() => {
    if (fullRef.current) {
      setFullHeight(fullRef.current.scrollHeight);
    }
  }, [descriptions]);

  if (descriptions.length === 0) return null;

  return (
    <div className="mb-4">
      {/* Collapsed: single-line preview of the first description */}
      {!expanded && (
        <p className="font-mono text-sm leading-relaxed text-foreground/80 line-clamp-1">
          {descriptions[0]}
        </p>
      )}

      {/* Expanded: all descriptions */}
      <div
        style={{
          maxHeight: expanded ? fullHeight : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div ref={fullRef} className="pt-1">
          {descriptions.map((desc, i) => (
            <p
              key={i}
              className="font-mono text-sm leading-relaxed mb-3 text-foreground/80 flex gap-2"
            >
              <span className="text-accent shrink-0 mt-0.5">&gt;</span>
              <span>{desc}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <button
        type="button"
        id={`expand-desc-${descriptions[0].slice(0, 20).replace(/\s+/g, "-")}`}
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-accent transition-colors"
        aria-expanded={expanded}
      >
        <span
          className={`inline-block border border-border px-1 text-[9px] transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
        {expanded
          ? `COLLAPSE [${descriptions.length} ENTRIES]`
          : `EXPAND [${descriptions.length} ENTRIES]`}
      </button>
    </div>
  );
}
