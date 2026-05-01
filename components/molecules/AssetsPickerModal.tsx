"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2, Image as ImageIcon, Film, Music, FileText, UploadCloud, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { toast } from "@/components/atoms/Toast";
import { ENV } from "@/lib/env";
import { AssetItem, AssetCategory } from "@/types";

interface AssetsPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (injectionText: string) => void;
}

export function AssetsPickerModal({ isOpen, onClose, onSelect }: AssetsPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteItem, setDeleteItem] = useState<AssetItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const fetchUrl = ENV.IS_WRITE_MODE ? '/api/labs/assets' : '/assets-index.json';
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data;
      setAssets(items || []);
    } catch (err) {
      console.error("Failed to load assets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setActiveTab("gallery");
    }
  }, [isOpen, fetchAssets]);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: AssetItem) => {
    let text = "";
    if (item.category === "img") {
      text = `![${item.name}](${item.url})`;
    } else if (item.category === "video") {
      text = `<video controls width="100%">\n  <source src="${item.url}" />\n</video>`;
    } else if (item.category === "audio") {
      text = `<audio controls>\n  <source src="${item.url}" />\n</audio>`;
    } else {
      text = `[Download ${item.name}](${item.url})`;
    }
    onSelect(text);
    onClose();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/labs/assets', {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: deleteItem.url })
      });
      if (!res.ok) throw new Error("Delete failed");
      toast("Asset deleted successfully", "success");
      setAssets(prev => prev.filter(a => a.url !== deleteItem.url));
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    
    // Upload sequentially for simplicity and safety
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        
        const res = await fetch('/api/labs/assets', {
          method: "POST",
          body: formData
        });
        if (!res.ok) throw new Error(`Failed to upload ${files[i].name}`);
      }
      toast("Assets uploaded successfully", "success");
      await fetchAssets();
      setActiveTab("gallery");
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case "img": return <ImageIcon size={24} className="text-accent" />;
      case "video": return <Film size={24} className="text-purple-400" />;
      case "audio": return <Music size={24} className="text-yellow-400" />;
      case "doc": return <FileText size={24} className="text-blue-400" />;
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
              className="relative w-full max-w-4xl bg-[#0a0a0f] border border-accent/40 rounded-lg shadow-[0_0_30px_rgba(0,255,136,0.15)] overflow-hidden flex flex-col max-h-[85vh] h-[600px]"
            >
              <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
              
              <div className="flex items-center justify-between p-4 border-b border-accent/20 relative z-10 bg-[#0a0a0f]">
                <h2 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                  <ImageIcon size={14} /> ASSETS_PICKER.EXE
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex bg-black/50 border border-accent/30 p-1 rounded-sm">
                    <button
                      onClick={() => setActiveTab("gallery")}
                      className={`px-4 py-1 text-[10px] uppercase tracking-widest transition-all ${
                        activeTab === "gallery" ? "bg-accent text-black font-bold" : "text-muted-foreground hover:text-accent"
                      }`}
                    >
                      Gallery
                    </button>
                    {ENV.IS_WRITE_MODE && (
                      <button
                        onClick={() => setActiveTab("upload")}
                        className={`px-4 py-1 text-[10px] uppercase tracking-widest transition-all ${
                          activeTab === "upload" ? "bg-accent text-black font-bold" : "text-muted-foreground hover:text-accent"
                        }`}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                  <button onClick={onClose} className="text-muted-foreground hover:text-accent transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {activeTab === "gallery" && (
                <>
                  <div className="p-4 relative z-10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search assets by name..."
                        className="w-full bg-black border border-accent/30 text-foreground p-3 pl-10 text-sm focus:outline-none focus:border-accent font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 relative z-10 bg-[#0a0a0f]">
                    {loading ? (
                      <div className="flex justify-center items-center h-full text-accent">
                        <Loader2 className="animate-spin" size={24} />
                      </div>
                    ) : filteredAssets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs uppercase tracking-widest gap-2">
                        <FileText size={24} className="opacity-50" />
                        NO ASSETS FOUND
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredAssets.map(asset => (
                          <div key={asset.url} className="group relative bg-black border border-border/40 hover:border-accent/50 rounded overflow-hidden flex flex-col aspect-square transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.15)]">
                            <button 
                              onClick={() => handleSelect(asset)}
                              className="flex-1 flex items-center justify-center bg-[#111] p-2 relative overflow-hidden"
                            >
                              {asset.category === "img" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" loading="lazy" />
                              ) : (
                                getCategoryIcon(asset.category)
                              )}
                              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <div className="p-2 border-t border-border/40 bg-black flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-foreground truncate w-full" title={asset.name}>
                                {asset.name}
                              </span>
                              <div className="flex justify-between items-center text-[8px] text-muted-foreground uppercase">
                                <span>{(asset.size / 1024).toFixed(1)} KB</span>
                                <span>{asset.category}</span>
                              </div>
                            </div>
                            {ENV.IS_WRITE_MODE && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setDeleteItem(asset); }}
                                className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-20"
                                title="Delete Asset"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "upload" && (
                <div className="flex-1 p-6 relative z-10 flex flex-col h-full bg-[#0a0a0f]">
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
                    className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden ${
                      dragOver ? "border-accent bg-accent/5" : "border-accent/20 bg-card/5 hover:border-accent/40"
                    }`}
                  >
                    <div className="absolute inset-0 cyber-grid-bg opacity-5 pointer-events-none" />
                    
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3 text-accent">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-xs uppercase tracking-widest font-bold">Uploading to Server...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={48} className={dragOver ? "text-accent animate-bounce" : "text-muted-foreground"} />
                        <div className="text-center flex flex-col gap-2">
                          <p className="text-sm font-bold text-foreground uppercase tracking-widest">
                            Secure Asset Uplink
                          </p>
                          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                            Drag & drop files here to upload to local storage buffer.<br/>
                            Supports Images, Video, Audio, and Documents.
                          </p>
                          <label className="mt-4 inline-flex">
                            <span className="px-6 py-2 bg-accent/10 border border-accent/50 text-accent hover:bg-accent hover:text-black cursor-pointer transition-colors text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                              Browse Files
                            </span>
                            <input 
                              type="file" 
                              className="hidden" 
                              multiple 
                              onChange={(e) => handleUpload(e.target.files)} 
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={!!deleteItem}
        isLoading={isDeleting}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Purge Asset"
        message={`This will permanently delete "${deleteItem?.name}" from the file system. Any references to this asset will break. Confirm purge?`}
        variant="destructive"
        confirmLabel="PURGE"
      />
    </>
  );
}
