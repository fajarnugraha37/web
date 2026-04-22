import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Hardware Nodes | Fajar Abdi Nugraha Labs - Software Engineer & Solution Architect",
  description:
    "Technical laboratory and hardware nodes by Fajar Abdi Nugraha. Experiment with browser-native databases and analytics.",
};

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
