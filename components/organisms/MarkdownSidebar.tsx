"use client";

import React from "react";
import { FileTabs } from "@/components/molecules/FileTabs";
import { LabFile } from "@/types";

interface MarkdownSidebarProps {
  files: LabFile[];
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
  addFile: (name: string, content: string) => string;
  duplicateFile: (id: string) => string | undefined;
  onRenameRequest: (id: string, name: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function MarkdownSidebar({
  files,
  activeFileId,
  setActiveFileId,
  addFile,
  duplicateFile,
  onRenameRequest,
  onDeleteRequest
}: MarkdownSidebarProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <FileTabs 
        files={files}
        activeFileId={activeFileId || ""}
        setActiveFileId={setActiveFileId}
        addFile={addFile}
        duplicateFile={duplicateFile}
        onRename={onRenameRequest}
        onDelete={onDeleteRequest}
      />
    </div>
  );
}
