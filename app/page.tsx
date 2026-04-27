import { getSortedBlogsData } from "@/lib/mdx";
import { HeroSection } from "@/components/organisms/HeroSection";
import { TerminalSection } from "@/components/organisms/TerminalSection";
import { HardwareNodesSection } from "@/components/organisms/HardwareNodesSection";
import { ParadigmsSection } from "@/components/organisms/ParadigmsSection";
import { RecentTransmissionsSection } from "@/components/organisms/RecentTransmissionsSection";

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

  return (
    <div className="theme-sunset flex flex-col min-h-[calc(100vh-4rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background Overlays */}
      <div className="fixed inset-0 bg-background -z-50 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none z-[-40] bg-gradient-to-t from-accent/5 via-accent-secondary/5 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <HeroSection />
        </div>
        <div className="lg:col-span-5">
          <TerminalSection />
        </div>
      </div>

      <HardwareNodesSection />
      <ParadigmsSection />
      <RecentTransmissionsSection recentBlogs={recentBlogs} />
    </div>
  );
}
