"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";

interface ContentEditorSearchModalProps {
  isOpen: boolean;
  mode?: 'open' | 'delete';
  onClose: () => void;
  onSelect: (slug: string, data?: any) => void;
}

export function ContentEditorSearchModal({ isOpen, mode = 'open', onClose, onSelect }: ContentEditorSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResults = useCallback(async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/labs/markdown?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`);
      const json = await res.json();
      if (res.ok) {
        setResults(json.data || []);
        setTotalPages(json.meta?.totalPages || 1);
        setPage(json.meta?.page || 1);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Throttle search typing
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchResults(query, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, isOpen, fetchResults]);

  // Refetch results if opened again
  useEffect(() => {
    if (isOpen) {
      fetchResults(query, page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchResults(query, newPage);
  };

  const handleSelect = async (slug: string) => {
    if (mode === 'delete') {
      setDeleteConfirmSlug(slug);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/labs/markdown/${slug}`);
      const json = await res.json();
      if (res.ok && json.data) {
        onSelect(slug, json.data);
        onClose();
      }
    } catch (err) {
      console.error("Failed to load blog", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmSlug) {
      setIsDeleting(true);
      await onSelect(deleteConfirmSlug);
      // Remove from local list manually or refetch
      setResults(prev => prev.filter(r => r.slug !== deleteConfirmSlug));
      setIsDeleting(false);
      setDeleteConfirmSlug(null);
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }} 
              className="relative w-full max-w-2xl bg-[#0a0a0f] border border-accent/40 rounded-lg shadow-[0_0_30px_rgba(0,255,136,0.15)] overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
              
              <div className="flex items-center justify-between p-4 border-b border-accent/20 relative z-10 bg-[#0a0a0f]">
                <h2 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                  {mode === 'delete' ? <Trash2 size={14} className="text-red-500" /> : <Search size={14} />} 
                  {mode === 'delete' ? <span className="text-red-500">Delete Post</span> : "Content Database"}
                </h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-accent transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 relative z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, slug, or description..."
                    className="w-full bg-black border border-accent/30 text-foreground p-3 pl-10 text-sm focus:outline-none focus:border-accent font-mono"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10 min-h-[300px]">
                {loading && results.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-accent py-10">
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10 text-xs uppercase tracking-widest">
                    No records found
                  </div>
                ) : (
                  results.map((blog) => (
                    <button
                      key={blog.slug}
                      onClick={() => handleSelect(blog.slug)}
                      className={`w-full text-left p-4 border bg-black/50 transition-all group flex flex-col gap-2 rounded ${
                        mode === 'delete' 
                          ? "border-red-500/40 hover:border-red-500 hover:bg-red-500/10" 
                          : "border-border/40 hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className={`text-sm font-bold text-foreground flex items-center gap-2 ${
                          mode === 'delete' ? "group-hover:text-red-500" : "group-hover:text-accent"
                        }`}>
                          {mode === 'delete' ? <Trash2 size={14} className="text-red-500" /> : <FileText size={14} className="text-accent" />} {blog.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground uppercase bg-border/30 px-2 py-0.5 rounded">
                          {blog.slug}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {blog.description}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="p-4 border-t border-accent/20 bg-[#0a0a0f] relative z-10 flex items-center justify-between">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="xs" onClick={() => handlePageChange(1)} disabled={page === 1} className="px-2">
                      <ChevronsLeft size={12} />
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-2">
                      <ChevronLeft size={12} />
                    </Button>
                    <div className="flex gap-1 mx-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <Button 
                          key={i} 
                          variant={page === i + 1 ? "default" : "outline"} 
                          size="xs" 
                          onClick={() => handlePageChange(i + 1)}
                          className="px-3"
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="xs" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-2">
                      <ChevronRight size={12} />
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} className="px-2">
                      <ChevronsRight size={12} />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={!!deleteConfirmSlug}
        isLoading={isDeleting}
        onClose={() => setDeleteConfirmSlug(null)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteConfirmSlug}"? This action cannot be undone.`}
        variant="destructive"
        confirmLabel="DELETE"
      />
    </>
  );
}
