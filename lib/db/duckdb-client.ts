import * as duckdb from "@duckdb/duckdb-wasm";

let dbInstance: duckdb.AsyncDuckDB | null = null;
let connInstance: duckdb.AsyncDuckDBConnection | null = null;
let initPromise: Promise<{ db: duckdb.AsyncDuckDB; conn: duckdb.AsyncDuckDBConnection }> | null = null;

export async function getDuckDbInstance(): Promise<{ db: duckdb.AsyncDuckDB; conn: duckdb.AsyncDuckDBConnection }> {
  if (dbInstance && connInstance) {
    return { db: dbInstance, conn: connInstance };
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const origin = window.location.origin;
    const basePath = "/duckdb";
    
    const bundle = {
      mainModule: `${origin}${basePath}/duckdb-eh.wasm`,
      mainWorker: `${origin}${basePath}/duckdb-browser-eh.worker.js`,
    };
    
    const workerResponse = await fetch(bundle.mainWorker);
    if (!workerResponse.ok) {
      throw new Error(`Failed to fetch DuckDB worker: ${workerResponse.statusText}`);
    }
    let workerScript = await workerResponse.text();
    workerScript = workerScript.replace(/\/\/# sourceMappingURL=.*/, "");
    
    const proxyUrl = URL.createObjectURL(
      new Blob([workerScript], { type: "application/javascript" })
    );

    const logger = new duckdb.ConsoleLogger();
    const worker = new Worker(proxyUrl);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    
    await db.instantiate(bundle.mainModule, bundle.mainWorker);
    const conn = await db.connect();
    
    dbInstance = db;
    connInstance = conn;
    
    // Revoke the object URL after worker creation to avoid memory leaks
    // The worker has already been created from it
    URL.revokeObjectURL(proxyUrl);

    return { db, conn };
  })();

  return initPromise;
}

export function clearDuckDbInstance() {
  dbInstance = null;
  connInstance = null;
  initPromise = null;
}
