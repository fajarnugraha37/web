"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { BlogMetadata } from "@/types";
import { BlogCard } from "@/components/molecules/BlogCard";

interface RecentTransmissionsSectionProps {
  recentBlogs: BlogMetadata[];
}

export function RecentTransmissionsSection({
  recentBlogs,
}: RecentTransmissionsSectionProps) {
  return (
    <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-accent-tertiary/5 to-background -z-10 pointer-events-none opacity-25" /> */}

      <ScrollReveal direction="up">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground flex items-center gap-4">
            <span className="text-accent-tertiary drop-shadow-[0_0_5px_#ffd700]">
              05 //
            </span>{" "}
            RECENT TRANSMISSIONS
          </h2>
          <Link
            href="/blogs"
            className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent-tertiary transition-colors"
          >
            [VIEW_ALL_LOGS] <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6">
        {recentBlogs.map((blog, idx) => (
          <BlogCard key={blog.slug} blog={blog} index={idx} selectedTags={[]} />
        ))}
      </div>
      <div className="mt-6 md:hidden flex justify-center">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-xs font-mono text-accent-tertiary hover:text-white transition-colors"
        >
          [VIEW_ALL_LOGS] <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
