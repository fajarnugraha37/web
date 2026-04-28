"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TocNav } from "@/components/molecules/TocNav";
import { BlogActions } from "@/components/molecules/BlogActions";
import { Blog, TocHeading } from "@/types";
import { PageTransition } from "@/components/atoms/PageTransition";

interface BlogContentProps {
  postData: Blog;
  headings: TocHeading[];
  relatedPosts: Blog[];
  children: React.ReactNode; // The rendered MDX content
}

/**
 * Organism: BlogContent
 * Orchestrates the full blog post layout with TOC and related posts.
 * Accepts rendered MDX content as children to support RSC.
 */
export function BlogContent({ postData, headings, relatedPosts, children }: BlogContentProps) {
  return (
    <PageTransition>
      <div className="relative min-h-screen">
        <article className="max-w-[1400px] mx-auto relative z-10 px-4 pt-8 md:pt-12 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_240px] gap-12">
          {/* Left Sidebar: TOC */}
          <aside className="hidden lg:block relative">
            <div className="sticky top-24 font-mono text-xs">
              <h3 className="text-accent uppercase tracking-widest mb-6 border-b border-border pb-2">
                [ STRUCTURE ]
              </h3>
              <TocNav headings={headings} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-accent/20 shadow-[0_15px_35px_rgba(0,0,0,0.9)] -mx-4 md:-mx-10 mb-12 px-4 md:px-10 py-4 flex items-center justify-between gap-4">
              <Link
                href="/blogs"
                className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all group"
              >
                <div className="mr-3 p-1 border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all cyber-chamfer-sm">
                  <ChevronLeft className="w-3 h-3" />
                </div>
                <span className="sm:inline">DISCONNECT</span>
              </Link>
              <time className="text-accent-secondary font-mono text-[9px] bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-0.5 tracking-tighter">
                [ TS: {postData.date} ]
              </time>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            </div>

            <h1 id={headings[0].id} className="text-2xl md:text-4xl font-black font-sans text-foreground leading-tight tracking-tighter mb-6">
              {postData.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-2 lg:mb-8">
              {postData.tags.map((t) => (
                <span key={t} className="text-[10px] md:text-xs uppercase font-mono tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/30 px-3 py-1 cyber-chamfer-sm hover:bg-accent-tertiary/20 transition-colors">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 mb-8">
              <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-mono">
                <span>{postData.stats.readingTime} MIN READ</span>
                <span className="text-accent/50">&bull;</span>
                <span>{postData.stats.wordCount} WORDS</span>
              </div>
              <BlogActions title={postData.title} slug={postData.slug} content={postData.content} />
            </div>

            <div className="markdown-body p-6 md:p-10 bg-card/5 border border-border/20 text-foreground/90 font-mono relative overflow-x-auto mb-16">
              <div className="relative z-10 prose prose-invert max-w-none">
                {children}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest pb-20">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent/40 rounded-full" />
                  TRANSMISSION_COMPLETE
                </span>
                <span className="text-border">|</span>
                <span>NODE: {postData.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>EOF</span>
                <span className="w-1.5 h-3 bg-accent animate-blink" />
              </div>
            </div>
          </main>

          {/* Right Sidebar: Related Posts */}
          <aside className="hidden lg:block relative">
            <div className="sticky top-24">
              <h3 className="font-mono text-accent-secondary text-xs uppercase tracking-widest mb-6 border-b border-border pb-2">
                [ TELEMETRY_FEED ]
              </h3>
              <div className="space-y-6">
                {relatedPosts.map((post) => (
                  <Link href={`/blogs/${post.slug}`} key={post.slug} className="block group">
                    <div className="bg-card/30 border border-border p-4 hover:border-accent-secondary transition-all">
                      <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-accent-secondary truncate">
                        {post.title}
                      </h4>
                      <p className="text-[10px] font-mono text-muted-foreground line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </article>

        {/* Ambient Overlays */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-accent/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-accent-secondary/5 blur-[150px] rounded-full" />
        </div>
      </div>
    </PageTransition>
  );
}
