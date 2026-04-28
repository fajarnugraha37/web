"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface FfmpegDropzoneProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

/**
 * Molecule: FfmpegDropzone
 * Cyberpunk-styled dropzone for media file ingestion.
 */
export function FfmpegDropzone({ onFileSelect, className }: FfmpegDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && onFileSelect(files[0]),
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
      'image/gif': ['.gif']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "group relative flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed transition-all cursor-pointer cyber-chamfer",
        isDragActive 
          ? "border-accent bg-accent/10 shadow-neon scale-[1.01]" 
          : "border-border/50 bg-card/20 hover:border-accent/50 hover:bg-accent/5",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="relative mb-4">
        <Film className={cn(
          "w-12 h-12 transition-colors",
          isDragActive ? "text-accent" : "text-muted-foreground group-hover:text-accent/70"
        )} />
        <FileUp className="w-5 h-5 absolute -bottom-1 -right-1 text-accent animate-bounce" />
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-black tracking-widest uppercase">
          {isDragActive ? "RELEASE_TO_INGEST" : "INGEST_MEDIA_NODE"}
        </h3>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          DRAG & DROP OR TAP TO SCAN FILESystem
        </p>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30" />
    </div>
  );
}
