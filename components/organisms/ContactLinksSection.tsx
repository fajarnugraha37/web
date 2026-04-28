"use client";

import React from "react";
import { ContactLinkCard } from "@/components/molecules/ContactLinkCard";
import { ContactLink } from "@/types";

interface ContactLinksSectionProps {
  links: ContactLink[];
}

/**
 * Organism: ContactLinksSection
 * Renders the grid of contact link cards.
 */
export function ContactLinksSection({ links }: ContactLinksSectionProps) {
  return (
    <section className="relative">
      <div className="inline-flex items-center border border-accent-tertiary/40 bg-accent-tertiary/10 px-3 py-1 text-xs font-bold mb-4 text-accent-tertiary cyber-chamfer-reverse shadow-[0_0_10px_rgba(253,224,71,0.2)]">
        <span className="animate-blink mr-2 text-accent">&gt;</span>NEURAL_LINKS
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <ContactLinkCard key={link.name} link={link} />
        ))}
      </div>
    </section>
  );
}
