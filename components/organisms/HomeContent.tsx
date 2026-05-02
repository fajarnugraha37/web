"use client";

import { PageTransition } from "@/components/atoms/PageTransition";
import { HeroSection } from "@/components/organisms/HeroSection";
import { StaticTerminalSection } from "@/components/organisms/StaticTerminalSection";
import { HardwareNodesSection } from "@/components/organisms/HardwareNodesSection";
import { ParadigmsSection } from "@/components/organisms/ParadigmsSection";
import { RecentTransmissionsSection } from "@/components/organisms/RecentTransmissionsSection";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BlogMetadata } from "@/types";

interface HomeContentProps {
  recentBlogs: BlogMetadata[];
  jsonLd: any;
}

/**
 * Organism: HomeContent
 * A Client Component that orchestrates the global boot-up theme transition.
 * Data is injected from the server.
 */
export function HomeContent({ recentBlogs, jsonLd }: HomeContentProps) {
  const [isBooted, setIsBooted] = useState(false);

  return (
    <PageTransition>
      <div className={cn(
        "flex flex-col min-h-[calc(100vh-4rem)] transition-colors duration-1000",
        !isBooted ? "theme-sunset" : ""
      )}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Background Overlays */}
        <div className="cyber-grid-bg fixed inset-0 bg-background -z-50 pointer-events-none" />
        <div className={cn(
          "fixed inset-0 pointer-events-none z-[-40] transition-opacity duration-1000",
          !isBooted 
            ? "bg-gradient-to-t from-accent-secondary/10 via-accent/5 to-transparent opacity-100" 
            : "bg-accent/5 opacity-40"
        )} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <HeroSection onBootComplete={() => setIsBooted(true)} />
          </div>
          <div className="lg:col-span-5">
            <StaticTerminalSection />
          </div>
        </div>

        <HardwareNodesSection />
        <ParadigmsSection />
        <RecentTransmissionsSection recentBlogs={recentBlogs} />
      </div>
    </PageTransition>
  );
}
