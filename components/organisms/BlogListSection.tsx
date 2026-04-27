"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePagination } from "@/hooks/usePagination";
import { useBlogFilter } from "@/hooks/useBlogFilter";
import { BlogMetadata } from "@/types";
import { TagList } from "@/components/molecules/TagList";
import { BlogCard } from "@/components/molecules/BlogCard";
import { PaginationControls } from "@/components/molecules/PaginationControls";

interface BlogListSectionProps {
  blogs: BlogMetadata[];
}

const PAGE_SIZE = 5;

export function BlogListSection({ blogs }: BlogListSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const listTopRef = useRef<HTMLDivElement>(null);

  const { filteredBlogs, allTags } = useBlogFilter({
    blogs,
    searchQuery,
    selectedTags,
  });

  const {
    safePage,
    totalPages,
    handlePageChange,
    startIndex,
    endIndex,
  } = usePagination({
    totalRecords: filteredBlogs.length,
    pageSize: PAGE_SIZE,
  });

  const pagedBlogs = filteredBlogs.slice(startIndex, endIndex);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    handlePageChange(1);
  };

  const clearTags = () => {
    setSelectedTags([]);
    handlePageChange(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    handlePageChange(1);
  };

  const onPageChange = (page: number) => {
    handlePageChange(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <TagList
          allTags={allTags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          clearTags={clearTags}
          isMobile={isMobile}
          isExpanded={isTagsExpanded}
          toggleExpanded={() => setIsTagsExpanded(!isTagsExpanded)}
        />
      </aside>

      {/* Blog List Content */}
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
                    <BlogCard
                      key={blog.slug}
                      blog={blog}
                      index={idx}
                      selectedTags={selectedTags}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <PaginationControls
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
