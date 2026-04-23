import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Playground | Advanced Editor - Fajar Abdi Nugraha",
  description:
    "A feature-rich Markdown editor with Vim mode, synchronized scrolling, GitHub-style alerts, and LaTeX support. Secure, client-side only rendering with PDF and HTML export capabilities.",
  keywords: ["Markdown Editor", "Vim Markdown", "LaTeX Rendering", "GitHub Alerts", "Browser Editor", "Fajar Abdi Nugraha"],
};

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
