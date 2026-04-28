"use client";

import React from "react";
import { Binary } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { EducationCard } from "@/components/molecules/EducationCard";
import { Education } from "@/types";

interface EducationSectionProps {
  education: Education[];
}

/**
 * Organism: EducationSection
 * Renders the grid of academic and certification records.
 */
export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education">
      <ScrollReveal direction="up">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-2 bg-accent-tertiary/10 border border-accent-tertiary/30 text-accent-tertiary">
            <Binary className="w-5 h-5" />
          </div>
          <h2 className="text-xs font-bold font-mono text-accent-tertiary tracking-[0.4em] uppercase">
            ACADEMIC_RECORD.ARCHIVE
          </h2>
          <div className="h-px flex-1 bg-accent-tertiary/10" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {education.map((edu, i) => (
            <EducationCard key={`${edu.school}-${i}`} edu={edu} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
