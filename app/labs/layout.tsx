import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experimental Labs | Fajar Abdi Nugraha - Software Engineer",
  description:
    "Interactive technical laboratories featuring browser-native SQL (PostgreSQL), high-speed analytics (DuckDB), and real-time Markdown rendering. Built with WASM for zero-cloud latency.",
  keywords: ["PostgreSQL WASM", "DuckDB WASM", "Markdown Editor", "Browser Database", "Fajar Abdi Nugraha", "Technical Labs", "React 19", "Next.js 16"],
};

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
