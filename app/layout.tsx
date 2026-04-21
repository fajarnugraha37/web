import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./app.css";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";

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
  title: "SYS//OP - Lead Backend Engineer",
  description:
    "High-performance backend engineering, cloud architecture, and AI-driven development.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://fajarnugraha37.github.io/web",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SYS//OP - Lead Backend Engineer",
    description:
      "High-performance backend engineering, cloud architecture, and AI-driven development.",
    siteName: "SYS//OP",
  },
  twitter: {
    card: "summary_large_image",
    title: "SYS//OP - Lead Backend Engineer",
    description:
      "High-performance backend engineering, cloud architecture, and AI-driven development.",
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
        <ScrollProgress />
      </body>
    </html>
  );
}
