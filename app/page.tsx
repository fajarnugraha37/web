import { getSortedBlogsData } from "@/lib/mdx";
import { HomeContent } from "@/components/organisms/HomeContent";

/**
 * Home Page (Server-side Entry)
 * Fetches data and injects it into the HomeContent Client Orchestrator.
 */
export default async function Home() {
  const recentBlogs = getSortedBlogsData().slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Fajar Abdi Nugraha",
    alternateName: ["Fajar", "Fajar Abdi", "Fajar Nugraha"],
    jobTitle: [
      "Software Engineer",
      "Backend Developer",
      "Tech Lead",
      "Team Lead Software Engineer",
      "Solution Architect",
    ],
    url: "https://fajarnugraha37.github.io/web",
    sameAs: [
      "https://github.com/fajarnugraha37",
      "https://www.linkedin.com/in/fajar-abdi-nugraha-81b26618a/",
    ],
    knowsAbout: [
      "GovTech",
      "Microservices",
      "Cloud Service",
      "Modern Web Development",
      "DevOps",
      "Java",
      "Node.js",
      "Go",
      "AWS",
    ],
  };

  return <HomeContent recentBlogs={recentBlogs} jsonLd={jsonLd} />;
}
