import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./app.css";
import "katex/dist/katex.min.css";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});
const shareTech = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
});

export const metadata: Metadata = {
  title: "Fajar Abdi Nugraha | Software Engineer & Solution Architect",
  description:
    "Portfolio of Fajar Abdi Nugraha, a Team Lead Software Engineer and Solution Architect specializing in GovTech, Microservices, Cloud Services, and Modern Web Development.",
  keywords: [
    "Fajar",
    "Fajar Abdi",
    "Fajar Abdi Nugraha",
    "Fajar Nugraha",
    "Software Engineer",
    "Backend Developer",
    "Backend Engineer",
    "Tech Lead",
    "Team Lead Software Engineer",
    "Team Lead Software Developer",
    "Solution Architect",
    "GovTech",
    "Microservices",
    "Cloud Service",
    "Modern Web Development",
    "DevOps",
  ],
  authors: [{ name: "Fajar Abdi Nugraha" }],
  creator: "Fajar Abdi Nugraha",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://fajarnugraha37.github.io/web",
  ),
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/",
    title: "Fajar Abdi Nugraha | Software Engineer & Solution Architect",
    description:
      "Portfolio of Fajar Abdi Nugraha, a Team Lead Software Engineer and Solution Architect specializing in GovTech, Microservices, Cloud Services, and Modern Web Development.",
    siteName: "Fajar Abdi Nugraha - SYS//OP",
    images: [
      {
        url: "/web/icon.svg", // Replace with a dedicated OG image if available
        width: 1200,
        height: 630,
        alt: "Fajar Abdi Nugraha - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fajar Abdi Nugraha | Software Engineer & Solution Architect",
    description:
      "Portfolio of Fajar Abdi Nugraha, a Team Lead Software Engineer and Solution Architect specializing in GovTech, Microservices, Cloud Services, and Modern Web Development.",
    images: ["/web/icon.svg"],
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  icons: {
    icon: [{ url: "/web/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetbrains.variable} ${shareTech.variable}`}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <ScrollProgress />
        <ScrollToTop />
        <header className="fixed top-0 w-full z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-sans font-bold text-xl text-accent cyber-glitch-text"
              data-text="SYS//OP"
            >
              SYS//OP
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest items-center">
              <Link
                href="/blogs"
                className="hover:text-accent transition-colors"
              >
                /Blogs
              </Link>
              <Link
                href="/about"
                className="hover:text-accent-secondary transition-colors"
              >
                /About
              </Link>

              {/* Labs Dropdown */}
              <div className="relative group">
                <Link
                  href="/labs"
                  className="hover:text-accent-tertiary transition-colors flex items-center gap-1"
                >
                  /Labs
                  <span className="text-[8px] opacity-50 group-hover:rotate-180 transition-transform duration-300">
                    ▼
                  </span>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full -left-4 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="min-w-[180px] bg-background border border-border p-2 cyber-chamfer-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
                    <Link
                      href="/labs/postgresql"
                      className="block px-3 py-2 hover:bg-accent/10 hover:text-accent transition-all border-l-2 border-transparent hover:border-accent font-mono text-[10px]"
                    >
                      SQL_LAB.EXE
                    </Link>
                    <Link
                      href="/labs/duckdb"
                      className="block px-3 py-2 hover:bg-accent-secondary/10 hover:text-accent-secondary transition-all border-l-2 border-transparent hover:border-accent-secondary font-mono text-[10px]"
                    >
                      TELEMETRY_ANALYTICS.EXE
                    </Link>
                    <Link
                      href="/labs/knowledge-graph"
                      className="block px-3 py-2 hover:bg-accent-tertiary/10 hover:text-accent-tertiary transition-all border-l-2 border-transparent hover:border-accent-tertiary font-mono text-[10px]"
                    >
                      NEURAL_MAPPING.EXE
                    </Link>
                    <div className="mt-2 pt-2 border-t border-border/50 text-[8px] px-3 text-muted-foreground italic">
                      Hardware accelerated nodes
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/feed.xml"
                className="hover:text-accent transition-colors"
                prefetch={false}
              >
                /RSS Feed
              </Link>
              <Link
                href="/contacts"
                className="px-4 py-1 border border-accent text-accent shadow-[0_0_8px_rgba(0,255,136,0.3)] cyber-chamfer-sm hover:bg-accent hover:text-black transition-all"
              >
                Contact.exe
              </Link>
            </nav>

            {/* Mobile nav */}
            <MobileNav />
          </div>
        </header>
        <main className="flex-1 pt-16 relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 pb-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
