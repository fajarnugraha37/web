"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Tag,
  X,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PAGE_SIZE = 5;

type BlogListProps = {
  blogs: {
    title: string;
    date: string;
    tags: string[];
    description: string;
    slug: string;
  }[];
};

export function BlogList({ blogs }: BlogListProps) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const listTopRef = useRef<HTMLDivElement>(null);

  // Fix: Use conditional rendering or direct state management to avoid effect-based sync
  // If we want tags to be collapsed on mobile by default but open on desktop,
  // we control this with a derived state or logic within the render.
  const shouldTagsExpand = isMobile ? isTagsExpanded : true;

  // Extract unique tags
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags)),
  ).sort();

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => blog.tags.includes(tag))
        : true;
    return matchesSearch && matchesTags;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedBlogs = filteredBlogs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setPage(1);
  };

  const clearTags = () => {
    setSelectedTags([]);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 min-w-0" ref={listTopRef}>
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-mono group-focus-within:animate-pulse">
            &gt;
          </span>
          <input
            type="text"
            placeholder="SEARCH_LOGS..."
            aria-label="Search blog posts"
            className="w-full bg-input border border-border text-accent cyber-chamfer-sm pl-8 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all placeholder:opacity-30"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="bg-card border border-border cyber-chamfer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <Tag className="w-8 h-8" />
          </div>

          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => {
                if (isMobile) {
                  setIsTagsExpanded(!isTagsExpanded);
                }
              }}
              className={`flex justify-between items-center px-4 py-4 md:pt-4 md:pb-2 md:mb-2 md:border-b md:border-border w-full text-left ${
                isMobile ? "cursor-pointer" : "cursor-default"
              } group/header`}
            >
              <h3 className="text-sm font-sans font-bold text-foreground uppercase tracking-widest flex items-center gap-2 group-hover/header:text-accent md:group-hover/header:text-foreground transition-colors">
                / TAGS
                {selectedTags.length > 0 && (
                  <span className="text-[10px] font-mono text-accent">
                    ({selectedTags.length})
                  </span>
                )}
              </h3>

              <div className="flex items-center gap-3">
                {selectedTags.length > 0 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      clearTags();
                    }}
                    className="text-[10px] font-mono text-destructive hover:text-white transition-colors flex items-center gap-1 border border-destructive/30 px-2 py-0.5 cyber-chamfer-sm bg-destructive/5"
                  >
                    CLEAR
                  </div>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-accent transition-transform md:hidden ${
                    shouldTagsExpand ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {shouldTagsExpand && (
                <motion.div
                  key="tags-content"
                  initial={isMobile ? { height: 0, opacity: 0 } : false}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden md:!h-auto md:!opacity-100"
                >
                  <div className="px-4 pb-4 md:px-4 md:pb-4 flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs font-mono uppercase px-2 py-1 cyber-chamfer-sm transition-all border ${
                            isSelected
                              ? "bg-accent text-black border-accent shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                              : "bg-transparent border-border text-muted-foreground hover:border-accent hover:text-accent"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Blog List */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              ENTRIES_LOCATED:{" "}
              <span className="text-accent">{filteredBlogs.length}</span>
            </span>
            {selectedTags.length > 0 && (
              <div className="hidden md:flex gap-2">
                <span className="text-[10px] text-border">|</span>
                <span className="text-[10px] font-mono text-accent-tertiary">
                  FILTERS_ACTIVE
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
              PAGE {safePage}/{totalPages}
            </span>
            <span className="font-mono text-xs text-accent animate-blink">
              _
            </span>
          </div>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredBlogs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center py-24 border border-border/30 bg-card/10 border-dashed cyber-chamfer text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 cyber-grid-bg opacity-5" />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="w-12 h-12 text-destructive/40 mb-4" />
                </motion.div>
                <span
                  className="text-destructive font-mono text-xl mb-2 cyber-glitch-text"
                  data-text="Oops // 404"
                >
                  Oops // 404
                </span>
                <span className="text-muted-foreground font-mono text-sm max-w-xs">
                  No knowledge fragments match the provided parameters.
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6"
              >
                <AnimatePresence>
                  {pagedBlogs.map((blog, idx) => (
                    <motion.div
                      key={blog.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="group block"
                      >
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
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-8 border-t border-border/30">
            {/* FIRST PAGE */}
            {safePage > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 font-mono text-[10px] border border-border cyber-chamfer-sm transition-all hover:border-accent hover:text-accent group flex items-center gap-1"
              >
                <ChevronsLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />{" "}
                FIRST
              </button>
            )}

            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="px-4 py-2 font-mono text-xs border border-border cyber-chamfer-sm transition-all hover:border-accent hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">
                &lt;
              </span>{" "}
              PREV
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 font-mono text-xs cyber-chamfer-sm transition-all ${
                    safePage === p
                      ? "bg-accent text-black shadow-[0_0_12px_rgba(0,255,136,0.4)]"
                      : "border border-border hover:border-accent hover:text-accent bg-card/20"
                  }`}
                >
                  {p.toString().padStart(2, "0")}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="px-4 py-2 font-mono text-xs border border-border cyber-chamfer-sm transition-all hover:border-accent hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              NEXT{" "}
              <span className="group-hover:translate-x-1 transition-transform inline-block">
                &gt;
              </span>
            </button>

            {/* LAST PAGE */}
            {safePage < totalPages && (
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 font-mono text-[10px] border border-border cyber-chamfer-sm transition-all hover:border-accent hover:text-accent group flex items-center gap-1"
              >
                LAST{" "}
                <ChevronsRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
