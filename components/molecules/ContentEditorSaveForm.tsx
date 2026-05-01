"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Save, AlertTriangle, Plus, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { LabFile } from "@/types";

interface ContentEditorSaveFormProps {
  activeFile?: LabFile;
  activeContent: string;
  updateFileMetadata: (id: string, metadata: any) => void;
  onSaveSuccess?: () => void;
}

export function ContentEditorSaveForm({ 
  activeFile, 
  activeContent,
  updateFileMetadata,
  onSaveSuccess
}: ContentEditorSaveFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-[#111] border border-accent/20 rounded-md overflow-visible mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-accent/5 hover:bg-accent/10 transition-colors rounded-t-md"
      >
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
          <Save size={12} /> Post Metadata
        </span>
        {isOpen ? <ChevronUp size={14} className="text-accent" /> : <ChevronDown size={14} className="text-accent" />}
      </button>

      {isOpen && (
        <div className="p-4 flex flex-col gap-4 border-t border-accent/10">
          {error && (
            <div className="text-[10px] text-red-500 bg-red-500/10 p-2 border border-red-500/20 flex items-center gap-2 uppercase tracking-wide">
              <AlertTriangle size={12} /> {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Slug</label>
              <input 
                type="text"
                name="slug"
                value={metadata.slug}
                onChange={handleInputChange}
                placeholder="my-awesome-post"
                className="bg-black border border-accent/30 text-foreground p-2 text-sm focus:outline-none focus:border-accent font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Title</label>
              <input 
                type="text"
                name="title"
                value={metadata.title}
                onChange={handleInputChange}
                placeholder="My Awesome Post"
                className="bg-black border border-accent/30 text-foreground p-2 text-sm focus:outline-none focus:border-accent font-mono"
              />
            </div>
            
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Tags</label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-black border border-accent/30 min-h-[42px]">
                {metadata.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-accent/10 text-accent border border-accent/20 px-2 py-1 text-xs uppercase tracking-widest rounded-sm">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="text-accent/60 hover:text-red-500 transition-colors ml-1"
                      title="Remove Tag"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                
                <div className="relative">
                  {!isAddingTag ? (
                    <button 
                      onClick={() => setIsAddingTag(true)}
                      className="flex items-center justify-center w-6 h-6 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-sm transition-colors"
                      title="Add Tag"
                    >
                      <Plus size={12} />
                    </button>
                  ) : (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-[#0a0a0f] border border-accent/40 shadow-[0_0_15px_rgba(0,255,136,0.15)] p-2 rounded-sm w-48 flex flex-col gap-2">
                      <input 
                        ref={tagInputRef}
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Tag name..."
                        className="bg-black border border-accent/30 text-foreground p-1.5 text-xs focus:outline-none focus:border-accent font-mono w-full"
                      />
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="xs" onClick={() => setIsAddingTag(false)} className="px-2 py-1">CANCEL</Button>
                        <Button variant="outline" size="xs" onClick={handleAddTag} className="px-2 py-1">ADD</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Description</label>
              <textarea 
                name="description"
                value={metadata.description}
                onChange={handleInputChange}
                placeholder="A brief summary of this post..."
                rows={2}
                className="bg-black border border-accent/30 text-foreground p-2 text-sm focus:outline-none focus:border-accent font-mono resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-6">
              {isSaving ? "SAVING..." : "SAVE POST"} <Save size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
