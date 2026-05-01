"use client";

import React, { useState, useRef, useEffect } from "react";
import { Save, AlertTriangle, Plus, X, PenTool } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { LabFile } from "@/types";
import { motion, AnimatePresence } from "motion/react";

interface ContentEditorSaveFormProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile?: LabFile;
  activeContent: string;
  updateFileMetadata: (id: string, metadata: any) => void;
  onSaveSuccess?: () => void;
}

export function ContentEditorSaveForm({ 
  isOpen,
  onClose,
  activeFile, 
  activeContent,
  updateFileMetadata,
  onSaveSuccess
}: ContentEditorSaveFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagPopoverRef = useRef<HTMLDivElement>(null);

  // Derive initial values from file metadata or default
  const metadata = activeFile?.metadata || {
    slug: activeFile?.name.replace(".mdx", "").replace(".md", "") || "",
    title: "",
    description: "",
    tags: [] as string[]
  };

  useEffect(() => {
    if (isAddingTag && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [isAddingTag]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagPopoverRef.current && !tagPopoverRef.current.contains(event.target as Node)) {
        setIsAddingTag(false);
      }
    };

    if (isAddingTag) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddingTag]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (activeFile) {
      updateFileMetadata(activeFile.id, { [name]: value });
    }
  };

  const handleAddTag = () => {
    if (activeFile && tagInput.trim()) {
      const newTags = [...metadata.tags, tagInput.trim()];
      // Ensure unique tags
      updateFileMetadata(activeFile.id, { tags: Array.from(new Set(newTags)) });
      setTagInput("");
    }
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (activeFile) {
      updateFileMetadata(activeFile.id, { tags: metadata.tags.filter(t => t !== tagToRemove) });
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setTagInput("");
    }
  };

  const handleSave = async () => {
    if (!activeFile) return;
    setError(null);
    
    if (!metadata.slug || !metadata.title || !metadata.description || !metadata.tags.length) {
      setError("All fields (Slug, Title, Tags, Description) are required.");
      return;
    }

    if (!activeContent.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/labs/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: metadata.slug,
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          content: activeContent
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-[#0a0a0f] border border-accent/30 shadow-[0_0_30px_rgba(0,255,136,0.15)] flex flex-col max-h-[90vh] cyber-chamfer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-accent/20 bg-accent/5">
              <h2 className="text-sm font-bold text-accent tracking-[0.2em] uppercase flex items-center gap-2">
                <PenTool size={16} /> POST METADATA
              </h2>
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {error && (
                <div className="text-[10px] text-red-500 bg-red-500/10 p-3 border border-red-500/20 flex items-center gap-2 uppercase tracking-wide">
                  <AlertTriangle size={14} /> {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-accent/80 uppercase tracking-widest font-bold">Slug</label>
                  <input 
                    type="text"
                    name="slug"
                    value={metadata.slug}
                    onChange={handleInputChange}
                    placeholder="my-awesome-post"
                    className="bg-black/50 border border-accent/30 text-foreground p-3 text-sm focus:outline-none focus:border-accent font-mono transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-accent/80 uppercase tracking-widest font-bold">Title</label>
                  <input 
                    type="text"
                    name="title"
                    value={metadata.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Post"
                    className="bg-black/50 border border-accent/30 text-foreground p-3 text-sm focus:outline-none focus:border-accent font-mono transition-colors"
                  />
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] text-accent/80 uppercase tracking-widest font-bold">Tags</label>
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-black/50 border border-accent/30 min-h-[50px]">
                    {metadata.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-2 bg-accent/10 text-accent border border-accent/30 px-3 py-1.5 text-xs uppercase tracking-widest rounded-sm">
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="text-accent/60 hover:text-red-500 transition-colors"
                          title="Remove Tag"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    
                    <div className="relative" ref={tagPopoverRef}>
                      {!isAddingTag ? (
                        <button 
                          onClick={() => setIsAddingTag(true)}
                          className="flex items-center justify-center w-8 h-8 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/40 rounded-sm transition-colors"
                          title="Add Tag"
                        >
                          <Plus size={14} />
                        </button>
                      ) : (
                        <div className="absolute top-full left-0 mt-2 z-50 bg-[#0a0a0f] border border-accent/40 shadow-[0_0_20px_rgba(0,255,136,0.2)] p-3 rounded-sm w-56 flex flex-col gap-3">
                          <input 
                            ref={tagInputRef}
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Tag name..."
                            className="bg-black border border-accent/30 text-foreground p-2 text-xs focus:outline-none focus:border-accent font-mono w-full"
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="xs" onClick={() => setIsAddingTag(false)} className="px-3 py-1.5">CANCEL</Button>
                            <Button variant="outline" size="xs" onClick={handleAddTag} className="px-3 py-1.5">ADD</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] text-accent/80 uppercase tracking-widest font-bold">Description</label>
                  <textarea 
                    name="description"
                    value={metadata.description}
                    onChange={handleInputChange}
                    placeholder="A brief summary of this post..."
                    rows={3}
                    className="bg-black/50 border border-accent/30 text-foreground p-3 text-sm focus:outline-none focus:border-accent font-mono resize-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-4 border-t border-accent/20 bg-black/40">
              <Button variant="outline" onClick={onClose} className="px-6">
                CANCEL
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-8">
                {isSaving ? "SAVING..." : "SAVE POST"} <Save size={14} />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
