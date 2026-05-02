"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2, Image as ImageIcon, Film, Music, FileText, UploadCloud, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { toast } from "@/components/atoms/Toast";
import { ENV } from "@/lib/env";
import { AssetItem, AssetCategory } from "@/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useAssetsQuery,
  useUploadAssetMutation,
  useDeleteAssetMutation,
} from "@/hooks/queries/useAssetsQuery";

interface AssetsPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (injectionText: string) => void;
}

export function AssetsPickerModal({ isOpen, onClose, onSelect }: AssetsPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteItem, setDeleteItem] = useState<AssetItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const parentRef = useRef<HTMLDivElement>(null);

  // Fetch only when modal is open
  const { data: assets = [], isLoading, isError, refetch } = useAssetsQuery(isOpen);
  const uploadMutation = useUploadAssetMutation();
  const deleteMutation = useDeleteAssetMutation();

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("gallery");
    }
  }, [isOpen]);

  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;
    const lowerQuery = searchQuery.toLowerCase();
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(lowerQuery)
    );
  }, [assets, searchQuery]);

  // Grid Logic: Calculate rows based on columns
  const columns = 4;
  const rows = useMemo(() => {
    const r = [];
    for (let i = 0; i < filteredAssets.length; i += columns) {
      r.push(filteredAssets.slice(i, i + columns));
    }
    return r;
  }, [filteredAssets, columns]);

  // Virtualizer for the rows
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 5,
    enabled: isOpen,
  });

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

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.url, {
      onSuccess: () => {
        toast("Asset deleted successfully", "success");
        setDeleteItem(null);
      },
      onError: (err: any) => {
        toast(err.message || "Delete failed", "error");
        setDeleteItem(null);
      },
    });
  };

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        toast(`FILE_TOO_LARGE: ${file.name} (Max 10MB)`, "error");
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);

      uploadMutation.mutate(formData, {
        onSuccess: (data) => {
          toast(`UPLOADED: ${data.data.name}`, "success");
          setActiveTab("gallery");
        },
        onError: (err: any) => {
          toast(err.message || "UPLOAD_FAILED", "error");
        },
      });
    }
  };

  if (!isOpen) return null;

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
                  <div className="p-4 relative z-10 border-b border-white/5 bg-black/20">
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

                  <div 
                    ref={parentRef}
                    className="flex-1 overflow-y-auto p-4 relative z-10 bg-[#0a0a0f] scrollbar-thin scrollbar-thumb-accent/20"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full text-accent space-y-4">
                        <Loader2 className="animate-spin" size={32} />
                        <div className="text-xs font-mono animate-pulse tracking-widest">SCANNING_REPOSITORY...</div>
                      </div>
                    ) : isError ? (
                      <div className="flex flex-col items-center justify-center h-full text-destructive space-y-2">
                        <X size={32} />
                        <div className="text-xs font-mono uppercase tracking-widest">SCAN_FAILED_SERVER_OFFLINE</div>
                      </div>
                    ) : filteredAssets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 opacity-50">
                        <Search size={32} />
                        <div className="text-xs font-mono uppercase tracking-widest">NO_MATCHING_SIGNALS_FOUND</div>
                      </div>
                    ) : (
                      <div 
                        style={{
                          height: `${rowVirtualizer.getTotalSize()}px`,
                          width: '100%',
                          position: 'relative',
                        }}
                      >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                          <div
                            key={virtualRow.index}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: `${virtualRow.size}px`,
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4"
                          >
                            {rows[virtualRow.index].map((asset) => (
                              <div 
                                key={asset.url}
                                className="group/item relative bg-black/40 border border-border/40 hover:border-accent/50 transition-all rounded-sm overflow-hidden flex flex-col h-[180px] sm:h-[200px]"
                              >
                                <div 
                                  className="flex-1 bg-black/60 flex items-center justify-center cursor-pointer overflow-hidden relative"
                                  onClick={() => handleSelect(asset)}
                                >
                                  {asset.category === "img" ? (
                                    <img 
                                      src={asset.url} 
                                      alt={asset.name} 
                                      loading="lazy"
                                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" 
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                      {asset.category === "video" && <Film size={32} className="text-purple-400" />}
                                      {asset.category === "audio" && <Music size={32} className="text-yellow-400" />}
                                      {asset.category === "doc" && <FileText size={32} className="text-blue-400" />}
                                      <span className="text-[8px] font-mono uppercase">{asset.category}</span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-accent tracking-[0.2em] bg-black/80 px-3 py-1 border border-accent/40">INJECT</span>
                                  </div>
                                </div>
                                <div className="p-2 flex items-start justify-between gap-2 border-t border-border/20 bg-black/40">
                                  <span className="text-[9px] font-mono text-muted-foreground truncate uppercase flex-1" title={asset.name}>
                                    {asset.name}
                                  </span>
                                  {ENV.IS_WRITE_MODE && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setDeleteItem(asset); }}
                                      className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-white/5 bg-black/40 flex justify-between items-center shrink-0">
                    <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                      Signals_Found: {filteredAssets.length} // Memory_Optimized: Virtual_Node_Active
                    </span>
                    <span className="text-[8px] font-mono text-accent animate-pulse uppercase tracking-widest">
                      SYSTEM_STABLE
                    </span>
                  </div>
                </>
              )}

              {activeTab === "upload" && (
                <div className="flex-1 p-8 relative z-10 flex flex-col items-center justify-center">
                   <div 
                    className={`w-full max-w-lg border-2 border-dashed transition-all p-12 flex flex-col items-center justify-center gap-6 cursor-pointer rounded-lg ${
                      dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                   >
                     <UploadCloud size={48} className={dragOver ? "text-accent animate-bounce" : "text-muted-foreground"} />
                     <div className="text-center space-y-2">
                       <p className="text-sm font-bold uppercase tracking-widest">Transmit New Data</p>
                       <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">Drag and drop or click to browse (MAX 10MB)</p>
                     </div>
                     <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      multiple 
                      onChange={(e) => handleUpload(e.target.files)} 
                     />
                     <Button variant="outline" size="sm" className="mt-4">BROWSER_FILESYSTEM</Button>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={!!deleteItem}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Confirm Purge"
        message={`This will permanently delete "${deleteItem?.name}" from the file system. Any references to this asset will break. Confirm purge?`}
        variant="destructive"
        confirmLabel="PURGE"
      />
    </>
  );
}
