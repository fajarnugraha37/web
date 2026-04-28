"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/atoms/Toast";

interface UsePgliteActionsProps {
  exec: (query: string) => Promise<any>;
}

/**
 * Headless Hook: usePgliteActions
 * Manages UI-specific actions for the PostgreSQL laboratory.
 */
export function usePgliteActions({ exec }: UsePgliteActionsProps) {
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  const executePurge = useCallback(() => {
    const request = indexedDB.deleteDatabase("/pglite/sysop-db");
    request.onsuccess = () => {
      localStorage.removeItem("sysop_cmd_history");
      toast("SYSTEM_PURGED", "success");
      window.location.reload();
    };
    request.onerror = () => {
      toast("PURGE_FAILED", "error");
    };
  }, []);

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
      link.download = `pg_full_export_${new Date().getTime()}.csv`;
      link.click();
      toast("EXPORT_COMPLETE", "success");
    } catch (err) {
      console.error("Full export failed", err);
      toast("EXPORT_FAILED", "error");
    }
  }, [exec]);

  return {
    isPurgeModalOpen,
    setIsPurgeModalOpen,
    executePurge,
    handleExportFull,
  };
}
