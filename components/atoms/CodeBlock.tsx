"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface CodeBlockProps {
  code: string;
  className?: string;
  [key: string]: any;
}

export const CodeBlock = ({
  code,
  className,
  ...props
}: CodeBlockProps) => {
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

  return (
    <div className="relative group my-4">
      {/* Copy Button - Always visible on mobile, hover on desktop */}
      <div className="absolute top-2 right-2 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
        <Button
          variant="neutral"
          size="icon-sm"
          onClick={handleCopy}
          aria-label="Copy code"
          className="backdrop-blur-sm shadow-md"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto p-4 bg-muted rounded-md border border-border/20",
          className
        )}
        {...props}
      >
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
};
