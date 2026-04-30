"use client";

import React from "react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Activity } from "lucide-react";
import { SummarySection } from "@/components/organisms/SummarySection";
import { CareerSection } from "@/components/organisms/CareerSection";
import { EducationSection } from "@/components/organisms/EducationSection";
import { CAREER_DATA, EDUCATION_DATA } from "@/lib/data/about";

/**
 * Organism: AboutContent
 * Orchestrates all sections and ambient layers of the About page.
 */
export function AboutContent() {
  return (
    <div className="relative min-h-screen">
      {/* --- HUD & AMBIENCE LAYERS --- */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10 pointer-events-none" />
      <div className="fixed inset-0 not-found-scanlines opacity-30 pointer-events-none z-50" />
      
      {/* Glow Orbs */}
      <div className="fixed top-[-10%] -left-[10%] w-[40vw] h-[40vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] -right-[10%] w-[40vw] h-[40vw] bg-accent-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <PageTransition>
        <div className="max-w-4xl mx-auto py-12 px-6 relative z-10">
          <PageHeader 
            title="ABOUT"
            accentText="IDENTITY"
            tagText="DATA_STREAM // IDENTITY_QUERY"
            tagIcon={Activity}
            subtitle="Professional fragments..."
            className="mb-20"
          />
          <div className="space-y-24">
            <SummarySection />
            <CareerSection jobs={CAREER_DATA} />
            <EducationSection education={EDUCATION_DATA} />
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
