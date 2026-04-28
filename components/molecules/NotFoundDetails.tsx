"use client";

import React from "react";

/**
 * Molecule: NotFoundDetails
 * Renders a grid of error details (Code, Status, Sector).
 */
export function NotFoundDetails() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full mb-10 text-center font-mono text-xs">
      <div className="border border-border/50 bg-card/40 p-3 cyber-chamfer-sm">
        <div className="text-muted-foreground mb-1">ERROR_CODE</div>
        <div className="text-destructive font-bold">0x404</div>
      </div>
      <div className="border border-border/50 bg-card/40 p-3 cyber-chamfer-sm">
        <div className="text-muted-foreground mb-1">NODE_STATUS</div>
        <div className="text-accent-secondary font-bold">NULL</div>
      </div>
      <div className="border border-border/50 bg-card/40 p-3 cyber-chamfer-sm">
        <div className="text-muted-foreground mb-1">SECTOR</div>
        <div className="text-accent-tertiary font-bold">VOID</div>
      </div>
    </div>
  );
}
