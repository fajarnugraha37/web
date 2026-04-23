import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Postgres Playground | SQL Laboratory - Fajar Abdi Nugraha",
  description:
    "A full, persistent PostgreSQL instance running entirely in your browser using PGlite (WASM). No server, no cloud, just pure SQL power with IndexedDB persistence.",
  keywords: ["PostgreSQL WASM", "PGlite", "Browser SQL", "Database Playground", "SQL Terminal", "Fajar Abdi Nugraha"],
};

export default function PostgresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
