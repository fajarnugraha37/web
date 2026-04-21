"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Extract unique tags
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags)),
  ).sort();

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  // Reset to page 1 whenever filters change
  const safePage = Math.min(page, totalPages);
  const pagedBlogs = filteredBlogs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 min-w-0">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-mono">
            &gt;
          </span>
          <input
            type="text"
            placeholder="Search logs..."
            aria-label="Search blog posts"
            className="w-full bg-input border border-border text-accent cyber-chamfer-sm pl-8 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.5)] transition-all"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="bg-card border border-border p-4 cyber-chamfer">
          <h3 className="text-sm font-sans font-bold text-foreground mb-4 uppercase tracking-widest border-b border-border pb-2">
            / TAGS
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTagChange(null)}
              className={`text-xs font-mono uppercase px-2 py-1 cyber-chamfer-sm transition-all ${
                selectedTag === null
                  ? "bg-accent text-black shadow-[0_0_5px_rgba(0,255,136,0.5)]"
                  : "bg-transparent border border-border text-muted-foreground hover:bg-muted hover:text-accent"
              }`}
            >
              ALL
            </button>
            {allTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`text-xs font-mono uppercase px-2 py-1 cyber-chamfer-sm transition-all ${
                  selectedTag === tag
                    ? "bg-accent text-black shadow-[0_0_5px_rgba(0,255,136,0.5)]"
                    : "bg-transparent border border-border text-muted-foreground hover:bg-muted hover:text-accent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Blog List */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="font-mono text-xs text-muted-foreground">
            FOUND_ENTRIES: {filteredBlogs.length}
            {totalPages > 1 && (
              <span className="ml-3 text-border">
                PAGE {safePage}/{totalPages}
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-accent animate-blink">_</span>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center p-12 border border-border/50 bg-card/20 border-dashed cyber-chamfer text-center">
            <span className="text-destructive font-mono text-xl mb-2">
              404 // NOT_FOUND
            </span>
            <span className="text-muted-foreground font-mono text-sm">
              No knowledge fragments match the query.
            </span>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {pagedBlogs.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blogs/${blog.slug}`}
                  className="group block min-w-0"
                >
                  <article className="w-full min-w-0 bg-[#0a0a0f] border border-border p-5 md:p-6 cyber-chamfer hover:-translate-y-1 hover:border-accent transition-all duration-300 relative overflow-hidden">
                    {/* Decorative top bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 group-hover:bg-accent transition-colors" />

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <time className="text-accent-secondary font-mono text-xs shrink-0">
                        [{blog.date}]
                      </time>
                      <div className="flex flex-wrap gap-1.5">
                        {blog.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-1.5 py-0.5 whitespace-nowrap"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h2 className="text-lg md:text-2xl font-bold font-sans text-foreground mb-2 group-hover:text-accent transition-colors leading-tight break-words">
                      {blog.title}
                    </h2>

                    <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                      {blog.description}
                    </p>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
                <button
                  type="button"
                  id="blog-page-prev"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-2 font-mono text-xs border border-border cyber-chamfer-sm transition-all hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  &lt; PREV
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        id={`blog-page-${p}`}
                        onClick={() => setPage(p)}
                        aria-current={safePage === p ? "page" : undefined}
                        className={`w-8 h-8 font-mono text-xs cyber-chamfer-sm transition-all ${
                          safePage === p
                            ? "bg-accent text-black shadow-[0_0_8px_rgba(0,255,136,0.5)]"
                            : "border border-border hover:border-accent hover:text-accent"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  id="blog-page-next"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-3 py-2 font-mono text-xs border border-border cyber-chamfer-sm transition-all hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  NEXT &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
