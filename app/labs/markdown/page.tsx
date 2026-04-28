import { MarkdownPlaygroundContent } from "@/components/organisms/MarkdownPlaygroundContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Lab | Fajar Abdi Nugraha",
  description: "Advanced Markdown editor with VIM mode, real-time preview, and telemetry analytics.",
};

/**
 * Markdown Laboratory Page
 * Features a high-performance local editor with VIM support and multi-format exports.
 */
export default function MarkdownPlayground() {
  return <MarkdownPlaygroundContent />;
}
