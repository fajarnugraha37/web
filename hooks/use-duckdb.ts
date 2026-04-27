"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { DbStatus, QueryResult } from "@/types";

export function useDuckDb() {
  const [status, setStatus] = useState<DbStatus>("initializing");
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<duckdb.AsyncDuckDB | null>(null);
  const connRef = useRef<duckdb.AsyncDuckDBConnection | null>(null);

  useEffect(() => {
    let isMounted = true;
    let proxyUrl: string | null = null;

    async function init() {
      try {
        const origin = window.location.origin;
        const basePath = "/duckdb"; 
        
        const bundle = {
          mainModule: `${origin}${basePath}/duckdb-eh.wasm`,
          mainWorker: `${origin}${basePath}/duckdb-browser-eh.worker.js`,
        };
        
        const workerResponse = await fetch(bundle.mainWorker);
        let workerScript = await workerResponse.text();
        
        workerScript = workerScript.replace(/\/\/# sourceMappingURL=.*/, "");
        
        proxyUrl = URL.createObjectURL(
          new Blob([workerScript], { type: "application/javascript" })
        );

        const logger = new duckdb.ConsoleLogger();
        const worker = new Worker(proxyUrl);
        const db = new duckdb.AsyncDuckDB(logger, worker);
        
        await db.instantiate(bundle.mainModule, bundle.mainWorker);
        const conn = await db.connect();
        
        if (isMounted) {
          dbRef.current = db;
          connRef.current = conn;
          setStatus("ready");
        }
      } catch (err: any) {
        console.error("DuckDB initialization failed:", err);
        if (isMounted) {
          setError(err.message || "Failed to initialize DuckDB engine");
          setStatus("error");
        }
      }
    }

    if (!dbRef.current && typeof window !== "undefined") {
      init();
    }

    return () => {
      isMounted = false;
      if (proxyUrl) URL.revokeObjectURL(proxyUrl);
    };
  }, []);

  const exec = useCallback(async (query: string): Promise<QueryResult> => {
    if (!connRef.current) throw new Error("DuckDB not initialized");
    setStatus("executing");
    try {
      const result = await connRef.current.query(query);
      
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

      setStatus("ready");
      return { rows, result };
    } catch (err: any) {
      setStatus("ready");
      throw new Error(err.message || "Query failed");
    }
  }, []);

  const registerFile = useCallback(async (file: File) => {
    if (!dbRef.current) throw new Error("DuckDB not initialized");
    
    const safeName = file.name.replace(/[^a-zA-Z0-9._]/g, '_');
    
    try {
      await dbRef.current.registerFileHandle(
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
