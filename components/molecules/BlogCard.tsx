"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BlogMetadata } from "@/types";

interface BlogCardProps {
  blog: BlogMetadata;
  index: number;
  selectedTags: string[];
}

export function BlogCard({ blog, index, selectedTags }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/blogs/${blog.slug}`} className="group block">
        <article className="w-full bg-[#0a0a0f] border border-border p-5 md:p-6 cyber-chamfer hover:border-accent transition-all duration-300 relative overflow-hidden">
          {/* Animated background on hover */}
          <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/10 group-hover:bg-accent group-hover:shadow-[0_0_10px_#00ff88] transition-all" />

          <div className="flex flex-wrap items-center gap-3 mb-4 relative z-10">
            <time className="text-accent-secondary font-mono text-[10px] bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-0.5">
              [{blog.date}]
            </time>
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.map((t) => (
                <span
                  key={t}
                  className={`text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 border ${
                    selectedTags.includes(t)
                      ? "bg-accent/20 border-accent text-accent"
                      : "text-muted-foreground border-border bg-card/30"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <h2 className="text-lg md:text-2xl font-bold font-sans text-foreground mb-2 group-hover:text-accent transition-colors leading-tight relative z-10">
            {blog.title}
          </h2>

          <p className="text-sm font-mono text-muted-foreground leading-relaxed relative z-10 line-clamp-2">
            {blog.description}
          </p>

          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono text-accent">
              INITIATE_READ_SEQUENCE
            </span>
            <div className="h-px flex-1 bg-accent/20" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
