"use client";

import { useEffect, useCallback } from "react";
import { PGlite } from "@electric-sql/pglite";
import { getPGliteInstance } from "@/lib/db/pglite-client";
import { useSqlStore, SqlEngineState } from "@/lib/store/useSqlStore";

export interface PGliteHook {
  db: PGlite | null;
  status: SqlEngineState['status'];
  error: string | null;
  exec: (sql: string) => Promise<any>;
}

export function usePglite(): PGliteHook {
  const status = useSqlStore((state) => state.status);
  const error = useSqlStore((state) => state.lastError);
  const setStatus = useSqlStore((state) => state.setStatus);
  const setExecuting = useSqlStore((state) => state.setExecuting);
  const setTotalRecords = useSqlStore((state) => state.setTotalRecords);

  useEffect(() => {
    // Only initialize if we haven't tried yet
    if (status !== "initializing") return;

    async function init() {
      try {
        const { status: dbStatus } = await getPGliteInstance();
        setStatus(dbStatus);
      } catch (err: any) {
        console.error("Critical DB failure:", err);
        setStatus("error", err.message || "Unknown hardware failure");
      }
    }

    init();
  }, [status, setStatus]);

  const exec = useCallback(
    async (sql: string) => {
      const { db } = await getPGliteInstance();
      if (!db) throw new Error("Database engine offline");
      
      setExecuting(true);
      try {
        const res = await db.query(sql);
        setTotalRecords(res.rows.length);
        return res;
      } catch (err) {
        throw err;
      } finally {
        setExecuting(false);
      }
    },
    [setExecuting, setTotalRecords]
  );

  return { db: null, status, error, exec };
}
