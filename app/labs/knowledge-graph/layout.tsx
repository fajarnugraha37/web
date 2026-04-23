import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Graph | Content Network - Fajar Abdi Nugraha",
  description:
    "Explore the semantic network of Fajar Abdi Nugraha's technical blog. An interactive 3D visualization mapping relational connections between articles and concepts.",
  keywords: ["Knowledge Graph", "Content Network", "3D Visualization", "Blog Relationships", "D3 Force Graph", "Three.js", "Fajar Abdi Nugraha"],
};

export default function KnowledgeGraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
