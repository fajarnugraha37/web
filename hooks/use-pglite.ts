"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PGlite } from "@electric-sql/pglite";
import { SEED_SQL } from "@/lib/pg-seed";

export type DbStatus = "initializing" | "ready" | "error" | "volatile";

export interface PGliteHook {
  db: PGlite | null;
  status: DbStatus;
  error: string | null;
  exec: (sql: string) => Promise<any>;
}

export function usePglite() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [status, setStatus] = useState<DbStatus>("initializing");
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function initDb() {
      let pg: PGlite | null = null;
      try {
        // Try IndexedDB first
        try {
          pg = new PGlite("idb://sysop-db");
          await pg.waitReady;
          setStatus("ready");
        } catch (storageErr: any) {
          console.warn("Storage restricted, falling back to memory:", storageErr);
          pg = new PGlite(); // Memory fallback
          await pg.waitReady;
          setStatus("volatile");
        }

        if (!pg) throw new Error("Failed to initialize database engine");

        // Atomic seeding check
        try {
          const check = await pg.query(
            "SELECT 1 FROM information_schema.tables WHERE table_name = 'system_control';"
          );
          
          if (check.rows.length === 0) {
            console.log("System initializing... applying seed logs.");
            await pg.exec(SEED_SQL);
          }
        } catch (seedErr) {
          console.error("Seed failure:", seedErr);
        }

        setDb(pg);
      } catch (err: any) {
        console.error("Critical DB failure:", err);
        setError(err.message || "Unknown hardware failure");
        setStatus("error");
      }
    }

    initDb();
  }, []);

  const exec = useCallback(
    async (sql: string) => {
      if (!db) throw new Error("Database engine offline");
      return await db.query(sql);
    },
    [db]
  );

  return { db, status, error, exec };
}
