"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { MermaidDiagram } from "./MermaidDiagram";

export const CodeBlock = ({
  code,
  className,
  ...props
}: {
  code: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error("Clipboard API not available");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const isMermaid = className?.includes("mermaid") || className === "mermaid";

  if (isMermaid) {
    return <MermaidDiagram chart={code} />;
  }

  return (
    <div className="relative group my-4">
      {/* Copy Button - Always visible on mobile, hover on desktop */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-background/90 border border-border/50 text-muted-foreground hover:text-accent hover:border-accent cyber-chamfer-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all z-10 backdrop-blur-sm shadow-md"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      <pre
        className={`overflow-x-auto p-4 bg-muted rounded-md border border-border/20 ${className || ""}`}
        {...props}
      >
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
};
