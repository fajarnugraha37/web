"use client";

import React from "react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { TerminalSection } from "@/components/organisms/TerminalSection";
import { ContactLinksSection } from "@/components/organisms/ContactLinksSection";
import { CONTACT_LINKS } from "@/lib/data/contacts";

/**
 * Organism: ContactsContent
 * Orchestrates the full layout of the Contacts page, including
 * the terminal and direct link sections.
 */
export function ContactsContent() {
  return (
    <div className="theme-morning relative min-h-screen font-mono text-foreground overflow-x-hidden pb-20">
      <div className="fixed inset-0 bg-background -z-50 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-[-40] bg-gradient-to-tr from-accent/5 via-background to-accent-secondary/5 mix-blend-screen" />
      <div className="fixed inset-0 cyber-grid-bg -z-20 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(56,189,248,0.03),rgba(251,146,60,0.02),rgba(253,224,71,0.03))] bg-[length:100%_4px,3px_100%] opacity-30 mix-blend-overlay" />

      <PageTransition>
        <div className="pt-12 md:pt-24 max-w-4xl mx-auto px-4 md:px-8 relative z-10 space-y-16">
          <div className="flex flex-col items-center text-center">
            <h1 
              className="text-4xl md:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary cyber-glitch-text pb-2" 
              data-text="COMMS UPLINK"
            >
              COMMS UPLINK
            </h1>
            <p className="text-muted-foreground mt-4 text-sm max-w-xl">
              Establish a secure connection vector. Awaiting user input parameters...
            </p>
          </div>

          <div className="flex flex-col gap-12 w-full max-w-3xl mx-auto">
            <TerminalSection links={CONTACT_LINKS} />
            <ContactLinksSection links={CONTACT_LINKS} />
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
