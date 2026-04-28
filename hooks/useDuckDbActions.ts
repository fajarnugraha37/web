"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/atoms/Toast";

interface UseDuckDbActionsProps {
  registerFile: (file: File) => Promise<string>;
  exec: (query: string) => Promise<any>;
}

/**
 * Headless Hook: useDuckDbActions
 * Manages UI-specific actions for the DuckDB laboratory.
 */
export function useDuckDbActions({ registerFile, exec }: UseDuckDbActionsProps) {
  const [registeredFiles, setRegisteredFiles] = useState<string[]>([]);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(text);
    toast("QUERY_COPIED_TO_CLIPBOARD", "success");
    setTimeout(() => setCopiedQuery(null), 2000);
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const name = await registerFile(file);
        setRegisteredFiles((prev) => [...new Set([...prev, name])]);
        toast(`FILE_MOUNTED: ${name}`, "success");
      } catch (err: any) {
        console.error("File registration failed", err);
        toast("FILE_MOUNT_FAILED", "error");
      }
    }
  }, [registerFile]);

  const handleExportFull = useCallback(async (query: string) => {
    try {
      const res = await exec(query);
      if (!res.rows || res.rows.length === 0) {
        toast("NO_DATA_TO_EXPORT", "error");
        return;
      }
      
      const headers = Object.keys(res.rows[0]);
      const csvContent = [
        headers.join(','),
        ...res.rows.map((row: any) => 
          headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `duckdb_full_export_${new Date().getTime()}.csv`;
      link.click();
      toast("EXPORT_COMPLETE", "success");
    } catch (err) {
      console.error("Full export failed", err);
      toast("EXPORT_FAILED", "error");
    }
  }, [exec]);

  return {
    registeredFiles,
    copiedQuery,
    handleCopy,
    handleFileUpload,
    handleExportFull,
  };
}
