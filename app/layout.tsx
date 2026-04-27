import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, JetBrains_Mono } from "next/font/google";
import "./app.css";
import "katex/dist/katex.min.css";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { ScrollProgress } from "@/components/atoms/ScrollProgress";
import { ScrollToTop } from "@/components/atoms/ScrollToTop";
import { ToastProvider } from "@/components/atoms/Toast";

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
    process.env.NEXT_PUBLIC_BASE_URL || "https://fajarnugraha37.github.io",
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
        url: "/icon.svg",
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
    images: ["/icon.svg"],
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-black">
        <ToastProvider />
        <ScrollProgress />
        <ScrollToTop />
        <Header />
        <main className="flex-1 pt-16 relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 pb-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
