"use client";

import { PageTransition } from "@/components/atoms/PageTransition";
import { ExpandableSummary } from "@/components/molecules/ExpandableSummary";
import { ExpandableDescriptions } from "@/components/molecules/ExpandableDescriptions";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { 
  Terminal, 
  Cpu, 
  Database, 
  Binary, 
  Activity, 
  Zap,
  Globe
} from "lucide-react";
import React from "react";

// --- DATA PROTECTION ZONE: DO NOT ALTER STRINGS ---
const CAREER_DATA = [
  {
    year: "Jun 2025 - March 2026",
    company: "XTREMAX",
    role: "LEAD SOFTWARE DEVELOPER",
    descriptions: [
      "Lead Software Developer for a GovTech Singapore project, responsible for end-to-end delivery, reliability, and technical direction.",
      "Lead a cross-functional team of 9 engineers (7 Backend, 2 Frontend), driving execution, coaching, and quality standards across 50+ microservices and 50+ UI modules.",
      "Own yearly planning and quarterly execution: resource planning, capacity vs commitment checks, roadmap sequencing, dependency management, and delivery governance.",
      "Provide solutioning and technical leadership for change requests and modernization initiatives (architecture decisions, integration patterns, rollout/rollback plans).",
      "Run risk assessments and research spikes for security, compliance, maintainability, and platform sustainability; translate findings into pragmatic mitigation plans.",
      "Act as a client-facing technical focal point with stakeholders: clarifying requirements, aligning trade-offs, presenting options, and ensuring delivery transparency.",
      "Improve production readiness through incident triage, RCA, and preventive guardrails (defensive coding, review checklists, documentation-first practices).",
    ],
    tech: ["Java", "Spring Boot", "NodeJS", ".NET", "Vue", "Oracle", "SQL", "RabbitMQ", "Cloud", "Microservices", "AWS", "EKS", "K8s", "Docker"],
  },
  {
    year: "Jul 2023 - May 2025",
    company: "XTREMAX",
    role: "SOFTWARE DEVELOPER - BACKEND",
    descriptions: [
      "Assigned to a GovTech Singapore project (30+ services) utilizing Java Spring Boot, Node.js, and .NET.",
      "Acted as the main PIC for 5 services (1 .NET service, 1 Nodejs service and 3 Java Spring Boot services); responsibilities included troubleshooting, bug fixing, root cause analysis, and implementing solutions. Communicated technical issues and resolutions to stakeholders.",
      "Collaborated with Business Analysts and Team Leader on system improvements and Change Requests (CRs), from initial feasibility assessment to solution design, detailing tasks, effort estimations, dependencies and implementation plans.",
    ],
    tech: ["Java", "Spring Boot", "NodeJS", ".NET", "Vue", "Oracle", "SQL", "RabbitMQ", "Cloud", "Microservices", "AWS", "EKS", "K8s", "Docker"],
  },
  {
    year: "Oct 2022 - Jun 2023",
    company: "XTREMAX",
    role: "SOFTWARE DEVELOPER - BACKEND",
    descriptions: [
      "Served as a Center of Excellence (CoE/RnD) member, supporting Business Analysts (BAs) and Solution Architects (SAs) during tenders.",
      "Developed demo applications to showcase technical solutions for client pitches and tenders.",
      "Provided technical expertise on Adobe Experience Manager (AEM) and Adobe Analytics, including solution formulation, proposal documentation, and client Q&A.",
      "Researched and documented technologies like AEM, Apache Sling, Adobe Analytics, Google Analytics 4 (GA4), Amazon Kendra, etc, creating wikis and training syllabi.",
    ],
    tech: ["Java", "Adobe Experience Manager (AEM)", "Adobe Experience Cloud", "AWS", "Docker"],
  },
  {
    year: "Feb 2022 - Oct 2022",
    company: "QUICKPRO / FOREXIMF / PT INTERNATIONAL MITRA FUTURES",
    role: "BACK END DEVELOPER",
    descriptions: [
      "Contributed to a system migration for a trading application, transitioning backend systems to Node.js with NestJS and splitting into multiple services.",
      "Built a data synchronization process between legacy systems and the new trading app server (user data, account registration, trading accounts, etc.).",
      "Developed a real-time market data capture system to aggregate third-party data ticks into candlesticks for analysis and display.",
      "Created a backup market data processing application using MQL4, Node.js, ZeroMQ, and RabbitMQ.",
      "Developed technical indicators and candlestick pattern detectors in Node.js for in-app market analysis.",
      "Built APIs for account onboarding, account management, and multi-registration flows based on user criteria.",
      "Implemented an application server using Node.js, Socket.io, MongoDB, and Redis to integrate with MetaTrader 4 for order execution, cancellation, and account info retrieval.",
      "Created a bridging system for trading robots in MT4, providing real-time notifications for new and closed orders, and enabling the application to display order history and trading results.",
    ],
    tech: ["NodeJS", "Typescript", "PHP", "MySQL", "RabbitMQ", "Redis", "GCP", "Docker", "Meta Trader", "ZeroMQ", "MQL4"],
  },
  {
    year: "Jan 2020 - Jan 2022",
    company: "QUICKPRO / FOREXIMF / PT INTERNATIONAL MITRA FUTURES",
    role: "FULLSTACK DEVELOPER",
    descriptions: [
      "Designed, developed, and maintained a trading application (QuickPro) featuring real-time market data, OHLC charts, price/volatility alerts, trading signals, news, economic calendars, custom indicators, candlestick pattern detection, safety alert (to notify if the user's trading activity has a high risk such as overtrade, stop loss is too big), and more.",
      "Worked with marketing and sales teams to implement new features aligned with business objectives and user needs.",
      "Integrated the backend with the MetaTrader trading platform for real-time market data, enabling the application to display up-to-date price information and facilitate trading activities.",
      "Developed web crawlers to collect economic calendar data and technical analysis from external sources (Investing.com).",
      "Created systems for content generation and notifications based on custom technical indicators and candlestick patterns.",
      "Built an internal application for sales and account managers teams to handling lead tracking, webinar information, client registration, and task management.",
    ],
    tech: ["Java", "Android", "Flutter", "PHP", "MySQL", "Redis", "Meta Trader", "ZeroMQ", "MQL4"],
  },
  {
    year: "Sep 2019 - Dec 2019",
    company: "QUICKPRO / FOREXIMF / PT INTERNATIONAL MITRA FUTURES",
    role: "FULLSTACK WEB DEVELOPER",
    descriptions: [
      "Maintained internal web applications built with PHP Laravel, focusing on customer data management, business operations, and client interactions.",
      "Integrated internal systems with third-party services (Active Campaign, MaxChat, etc). This involved working with APIs and ensuring seamless data flow between platforms.",
      "Maintained client-facing web applications in PHP Laravel (dashboards, client areas), enabling onboarding, account management, withdrawals/deposits, customer support, and promotional campaigns (included developing landing pages, onboarding flows, email marketing campaigns, backend process, etc).",
    ],
    tech: ["PHP", "Vue", "Javascript", "CSS", "MySQL", "Redis"],
  },
];

const EDUCATION_DATA = [
  {
    year: "Issued Dec 2022",
    degree: "Adobe Experience Manager Assets Developer",
    school: "Adobe",
    location: "Adobe Inc.",
    description: "Credential ID 70L27VTCKNQEQ33K",
  },
  {
    year: "Issued Dec 2022",
    degree: "Adobe Analytics Developer",
    school: "Adobe",
    location: "Adobe Inc.",
    description: "Credential ID KY2VK0GKKBB4QT9D",
  },
  {
    year: "2015 - 2019",
    school: "UNIVERSITAS KOMPUTER INDONESIA",
    degree: "BACHELOR OF INFORMATICS ENGINEERING",
    location: "BANDUNG, WEST JAVA",
    description: "Graduated with GPA 3.59. Final project: 'Implementation of Q-Learning Combined with CNN Agents Playing the Flappy Bird Game.' Built using Python and TensorFlow libraries.",
  },
  {
    year: "2012 - 2015",
    school: "SMAN 1 BALEENDAH",
    degree: "SENIOR HIGH SCHOOL",
    location: "BANDUNG, WEST JAVA",
    description: "Natural Sciences Major.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* --- HUD & AMBIENCE LAYERS (CENTRALIZED VIA TAILWIND DESIGN TOKENS) --- */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10 pointer-events-none" />
      <div className="fixed inset-0 not-found-scanlines opacity-30 pointer-events-none z-50" />
      
      {/* Glow Orbs - Using design tokens for theme consistency */}
      <div className="fixed top-[-10%] -left-[10%] w-[40vw] h-[40vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] -right-[10%] w-[40vw] h-[40vw] bg-accent-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <PageTransition>
        <div className="max-w-4xl mx-auto py-12 px-6 relative z-10">
          
          {/* --- HEADER (ORGANISM-LEVEL COMPOSITION) --- */}
          <header className="mb-20 relative group">
            <div className="absolute -left-4 top-0 w-1 h-full bg-accent/30 group-hover:bg-accent transition-colors" />
            <ScrollReveal direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 font-mono text-[10px] text-accent mb-4 cyber-chamfer-reverse">
                <Activity className="w-3 h-3 animate-pulse" />
                SECURE_DATA_STREAM // IDENTITY_QUERY
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic cyber-glitch-text leading-none" data-text="ABOUT_IDENTITY">
                ABOUT<span className="text-accent">_IDENTITY</span>
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-[0.3em]">
                  // Decrypting professional fragments...
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
              </div>
            </ScrollReveal>
          </header>

          <div className="space-y-24">
            
            {/* --- SECTION 1: SUMMARY (MOLECULE COMPOSITION) --- */}
            <section id="summary">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-2 bg-accent/10 border border-accent/30 text-accent">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h2 className="text-xs font-bold font-mono text-accent tracking-[0.4em] uppercase">
                    SUMMARY.LOG
                  </h2>
                  <div className="h-px flex-1 bg-accent/10" />
                </div>
                
                <div className="relative group">
                  {/* Decorative Corner Accents */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent/40 pointer-events-none group-hover:border-accent transition-colors" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent/40 pointer-events-none group-hover:border-accent transition-colors" />
                  
                  <ExpandableSummary>
                    <div className="font-mono text-sm md:text-base leading-relaxed space-y-6 text-foreground/90 py-2">
                      <p>
                        Lead Software Engineer working on a GovTech microservices platform (Singapore). I keep production alive, delivery predictable, and plans honest. Heavily involved in ensuring plans match reality (capacity vs commitment), not just optimism.
                      </p>
                      <p>
                        I'm adaptive and tend to place myself where I can create the most impact. Sometimes that means being the firefighter, jumping into issues, unblocking delivery, and doing the hard triage when things go sideways. But systems that rely on heroes are already broken.
                      </p>
                      <p>
                        I handle solutioning, yearly planning, resource management, speed up development, risk assessment, and research spikes, as well as being the technical point of contact for stakeholders. If there are cost-benefit considerations, I'll draw it, quantify it, and make it explicit, no hidden complexity, no wishful thinking.
                      </p>
                      <p>
                        Work closely across BA, QA, Infra and PMTs because shipping software is a team sport, not a solo speedrun and “ship it” without “safely” is just shipping problems.
                      </p>
                      <p>
                        I strongly believe in a documentation-based approach and clear engineering guidelines, because heroics don't scale. I like boring production, docs that don't lie, honest plans, and systems that don't require heroic measures to operate.
                      </p>
                    </div>
                  </ExpandableSummary>
                </div>
              </ScrollReveal>
            </section>

            {/* --- SECTION 2: CAREER (MOLECULE REPETITION) --- */}
            <section id="career">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-4 mb-12">
                  <div className="p-2 bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h2 className="text-xs font-bold font-mono text-accent-secondary tracking-[0.4em] uppercase">
                    CAREER_HISTORY.EXE
                  </h2>
                  <div className="h-px flex-1 bg-accent-secondary/10" />
                </div>

                <div className="space-y-16">
                  {CAREER_DATA.map((job, i) => (
                    <div key={i} className="relative pl-10 md:pl-16 border-l-2 border-border/30 pb-2 group">
                      {/* Interactive Node */}
                      <div className="absolute left-[-11px] top-0 z-20">
                        <div className="relative w-5 h-5 bg-background border-2 border-accent-secondary rotate-45 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-accent-secondary group-hover:shadow-[0_0_15px_#ff00ff]">
                          <div className="absolute inset-0 bg-accent-secondary/20 animate-pulse" />
                        </div>
                      </div>

                      <div className="absolute left-[-2px] top-0 w-0.5 h-full bg-gradient-to-b from-accent-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-accent-secondary transition-all duration-300 uppercase leading-none tracking-tighter">
                              {job.role}
                            </h3>
                            <div className="flex items-center gap-2 mt-3 font-mono text-xs font-bold text-accent-secondary tracking-widest">
                              <span className="p-1 bg-accent-secondary/10 border border-accent-secondary/20">
                                <Database className="w-3 h-3" />
                              </span>
                              {job.company}
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">Timestamp</span>
                            <span className="text-xs font-mono text-foreground bg-muted/30 px-3 py-1 border border-border/50 cyber-chamfer-sm">
                              [{job.year}]
                            </span>
                          </div>
                        </div>

                        <div className="bg-card/20 p-4 border border-border/30 backdrop-blur-sm cyber-chamfer transition-all group-hover:border-accent-secondary/40">
                          <ExpandableDescriptions descriptions={job.descriptions} />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-2">
                          {job.tech.map((t) => (
                            <span 
                              key={t} 
                              className="text-[9px] font-mono font-bold bg-background/50 border border-border/40 px-2 py-1 text-muted-foreground uppercase tracking-tighter hover:border-accent-secondary/50 hover:text-accent-secondary transition-all cursor-default"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>

            {/* --- SECTION 3: EDUCATION --- */}
            <section id="education">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-4 mb-12">
                  <div className="p-2 bg-accent-tertiary/10 border border-accent-tertiary/30 text-accent-tertiary">
                    <Binary className="w-5 h-5" />
                  </div>
                  <h2 className="text-xs font-bold font-mono text-accent-tertiary tracking-[0.4em] uppercase">
                    ACADEMIC_RECORD.ARCHIVE
                  </h2>
                  <div className="h-px flex-1 bg-accent-tertiary/10" />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {EDUCATION_DATA.map((edu, i) => (
                    <div key={i} className="group relative p-8 bg-card/30 border border-border cyber-chamfer hover:border-accent-tertiary transition-all duration-500 overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Binary className="w-24 h-24 text-accent-tertiary" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-tertiary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-foreground uppercase group-hover:text-accent-tertiary transition-colors tracking-tight">
                              {edu.school}
                            </h3>
                            <div className="text-xs font-mono text-accent-tertiary font-bold uppercase mt-2 tracking-widest flex items-center gap-2">
                              <Zap className="w-3 h-3" />
                              {edu.degree}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/30 px-3 py-1 shadow-[0_0_10px_rgba(255,215,0,0.15)]">
                            {edu.year}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/20 pb-2">
                            <Globe className="w-3 h-3" /> {edu.location}
                          </div>
                          <p className="text-xs md:text-sm font-mono text-foreground/70 leading-relaxed italic border-l-2 border-accent-tertiary/20 pl-4 py-1">
                            // {edu.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
