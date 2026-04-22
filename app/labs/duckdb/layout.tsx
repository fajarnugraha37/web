import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "DuckDB Labs | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description:
    "High-speed OLAP engine running DuckDB-WASM for local file analysis. Part of Fajar Abdi Nugraha's technical labs.",
};

export default function DuckDBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
