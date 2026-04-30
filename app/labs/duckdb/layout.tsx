import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DuckDB Playground | OLAP Lab - Fajar Abdi Nugraha",
  description:
    "High-performance analytical database (DuckDB WASM) for large-scale data processing directly in the browser. Query Parquet, CSV, and JSON with sub-second latency.",
  keywords: ["DuckDB WASM", "OLAP in browser", "Data Analytics", "Parquet Query", "Fajar Abdi Nugraha", "Web Analytics"],
};

export default function DuckDBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
