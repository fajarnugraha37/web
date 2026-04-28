"use client";

import React from "react";
import { Cpu } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { CareerItem } from "@/components/molecules/CareerItem";
import { Experience } from "@/types";

interface CareerSectionProps {
  jobs: Experience[];
}

/**
 * Organism: CareerSection
 * Renders the timeline of career history entries.
 */
export function CareerSection({ jobs }: CareerSectionProps) {
  return (
    <section id="career">
      <ScrollReveal direction="up">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-2 bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xs font-bold font-mono text-accent-secondary tracking-[0.4em] uppercase">
            CAREER_HISTORY.EXE
          </h2>
          <div className="h-px flex-1 bg-accent-secondary/10" />
        </div>

        <div className="space-y-16">
          {jobs.map((job, i) => (
            <CareerItem key={`${job.company}-${i}`} job={job} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
