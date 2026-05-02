"use client";

import { useEffect, useCallback } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { getDuckDbInstance } from "@/lib/db/duckdb-client";
import { useSqlStore } from "@/lib/store/useSqlStore";
import { QueryResult } from "@/types";

export function useDuckDb() {
  const status = useSqlStore((state) => state.status);
  const error = useSqlStore((state) => state.lastError);
  const setStatus = useSqlStore((state) => state.setStatus);
  const setExecuting = useSqlStore((state) => state.setExecuting);
  const setTotalRecords = useSqlStore((state) => state.setTotalRecords);

  useEffect(() => {
    if (typeof window === "undefined" || status !== "initializing") return;

    async function init() {
      try {
        await getDuckDbInstance();
        setStatus("ready");
      } catch (err: any) {
        console.error("DuckDB initialization failed:", err);
        setStatus("error", err.message || "Failed to initialize DuckDB engine");
      }
    }

    init();
  }, [status, setStatus]);

  const exec = useCallback(async (query: string): Promise<QueryResult> => {
    const { conn } = await getDuckDbInstance();
    if (!conn) throw new Error("DuckDB not initialized");
    
    setExecuting(true);
    try {
      const result = await conn.query(query);
      
      const columns = result.schema.fields.map(f => f.name);
      const rowCount = result.numRows;
      const data = result.toArray();
      const rows = [];
      
      for (let i = 0; i < rowCount; i++) {
        const row = data[i];
        const obj: any = {};
        for (const col of columns) {
          const val = row[col];
          if (typeof val === "bigint") {
            obj[col] = val.toString();
          } else if (val instanceof Date) {
            obj[col] = val.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
          } else if (val !== null && typeof val === "object" && !Array.isArray(val)) {
             obj[col] = "[STRUCT]";
          } else {
            obj[col] = val;
          }
        }
        rows.push(obj);
      }

      setTotalRecords(rowCount);
      return { rows, result };
    } catch (err: any) {
      throw new Error(err.message || "Query failed");
    } finally {
      setExecuting(false);
    }
  }, [setExecuting, setTotalRecords]);

  const registerFile = useCallback(async (file: File) => {
    const { db } = await getDuckDbInstance();
    if (!db) throw new Error("DuckDB not initialized");
    
    const safeName = file.name.replace(/[^a-zA-Z0-9._]/g, '_');
    
    try {
      await db.registerFileHandle(
        safeName,
        file,
        duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
        true
      );
    } catch (e) {
      console.warn("Registration warning:", e);
    }
    
    return safeName;
  }, []);

  return { status, error, exec, registerFile };
}
