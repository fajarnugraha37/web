"use client";

import React from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-8 border-t border-border/30">
      {/* FIRST PAGE */}
      {currentPage > 1 && (
        <Button
          variant="neutral"
          size="sm"
          onClick={() => onPageChange(1)}
          className="gap-1 px-3"
        >
          <ChevronsLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          FIRST
        </Button>
      )}

      <Button
        variant="neutral"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="group"
      >
        <span className="group-hover:-translate-x-1 transition-transform inline-block">
          &lt;
        </span>{" "}
        PREV
      </Button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={currentPage === p ? "default" : "neutral"}
            size="sm"
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 ${
              currentPage === p
                ? "shadow-[0_0_12px_rgba(0,255,136,0.4)]"
                : "bg-card/20"
            }`}
          >
            {p.toString().padStart(2, "0")}
          </Button>
        ))}
      </div>

      <Button
        variant="neutral"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="group"
      >
        NEXT{" "}
        <span className="group-hover:translate-x-1 transition-transform inline-block">
          &gt;
        </span>
      </Button>

      {/* LAST PAGE */}
      {currentPage < totalPages && (
        <Button
          variant="neutral"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="gap-1 px-3"
        >
          LAST{" "}
          <ChevronsRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}
    </div>
  );
}
