import { PostgresLabContent } from "@/components/organisms/PostgresLabContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Lab | Fajar Abdi Nugraha",
  description: "Persistent PostgreSQL WASM Node for transactional database exploration in the browser.",
};

/**
 * PostgreSQL Laboratory Page
 * Features a persistent local database instance with transactional terminal support.
 */
export default function PostgreSQLPlayground() {
  return <PostgresLabContent />;
}
