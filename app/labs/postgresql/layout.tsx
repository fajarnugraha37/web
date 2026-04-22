import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "PostgreSQL Labs | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description:
    "Browser-native persistent PostgreSQL terminal using PGlite. Part of Fajar Abdi Nugraha's technical labs.",
};

export default function PostgresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
