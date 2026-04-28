"use client";

import React from "react";
import { ContactLink } from "@/types";

interface ContactLinkCardProps {
  link: ContactLink;
}

/**
 * Molecule: ContactLinkCard
 * Renders a single contact link with cyberpunk hover effects.
 */
export function ContactLinkCard({ link }: ContactLinkCardProps) {
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group relative flex flex-col p-4 bg-card/30 backdrop-blur-md border border-accent/20 cyber-chamfer-sm hover:border-accent hover:bg-accent/5 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="font-bold text-xs md:text-sm text-foreground group-hover:text-accent transition-colors">{"//"} {link.name}</span>
      <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1 group-hover:text-accent/70">{link.desc}</span>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-accent font-bold">]</div>
    </a>
  );
}
