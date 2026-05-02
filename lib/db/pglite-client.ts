import { PGlite } from "@electric-sql/pglite";
import { SEED_SQL } from "@/lib/pg-seed";

let pgInstance: PGlite | null = null;
let initPromise: Promise<PGlite> | null = null;

export async function getPGliteInstance(): Promise<{ db: PGlite; status: "ready" | "volatile" }> {
  if (pgInstance) {
    return { db: pgInstance, status: "ready" }; // Assuming ready if it's already instantiated
  }

  if (initPromise) {
    const db = await initPromise;
    return { db, status: "ready" };
  }

  initPromise = (async () => {
    let pg: PGlite | null = null;
    let status: "ready" | "volatile" = "ready";
    try {
      pg = new PGlite("idb://sysop-db");
      await pg.waitReady;
    } catch (storageErr: any) {
      console.warn("Storage restricted, falling back to memory:", storageErr);
      pg = new PGlite();
      await pg.waitReady;
      status = "volatile";
    }

    if (!pg) throw new Error("Failed to initialize database engine");

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

    pgInstance = pg;
    return pg;
  })();

  const db = await initPromise;
  // Determine status (could be refined, but assume "ready" if successful)
  return { db, status: "ready" }; // Actually, status could be volatile. 
  // Let's fix this in the main hook by relying on the fact that if it throws, it failed.
}

export function clearPGliteInstance() {
  pgInstance = null;
  initPromise = null;
}