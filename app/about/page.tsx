import { AboutContent } from "@/components/organisms/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identity | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description: "Professional fragments and academic records of Fajar Abdi Nugraha (SYS//OP).",
  openGraph: {
    title: "Identity | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
    description: "Professional fragments and academic records of Fajar Abdi Nugraha (SYS//OP).",
    type: "profile",
    url: "/about",
  },
};

/**
 * About Page
 * Serves as the professional identity hub.
 */
export default function AboutPage() {
  return <AboutContent />;
}
