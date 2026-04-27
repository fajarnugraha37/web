import { PageTransition } from "@/components/atoms/PageTransition";
import { ExpandableSummary } from "@/components/molecules/ExpandableSummary";
import { ExpandableDescriptions } from "@/components/molecules/ExpandableDescriptions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Profile | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description:
    "Career logs and technical background of Fajar Abdi Nugraha, a Team Lead Software Engineer and Solution Architect specializing in GovTech, Cloud, and Java/Node.js.",
  openGraph: {
    title:
      "Profile | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
    description:
      "Career logs and technical background of Fajar Abdi Nugraha, a Team Lead Software Engineer and Solution Architect specializing in GovTech, Cloud, and Java/Node.js.",
    type: "profile",
    url: "/about",
  },
};

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
      {/* Background and Overlays */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10 pointer-events-none" />
      <div className="fixed inset-0 not-found-scanlines opacity-30 pointer-events-none z-50" />

      <PageTransition>
        <div className="max-w-4xl mx-auto py-12 px-6">
          <header className="mb-16 border-b border-border pb-8 relative overflow-hidden">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic cyber-glitch-text" data-text="ABOUT_IDENTITY">
              ABOUT<span className="text-accent">_IDENTITY</span>
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-2 uppercase tracking-[0.3em]">
              // Accessing professional fragments...
            </p>
          </header>

          {/* Section 1: Executive Summary */}
          <section className="mb-20">
            <h2 className="text-xs font-bold font-mono text-accent mb-6 tracking-[0.5em] uppercase flex items-center gap-4">
              <span className="h-px flex-1 bg-accent/30" />
              SUMMARY.LOG
            </h2>
            <ExpandableSummary>
              <div className="font-mono text-sm md:text-base leading-relaxed space-y-4 text-foreground/90">
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
          </section>

          {/* Section 2: Career Logs */}
          <section className="mb-20">
            <h2 className="text-xs font-bold font-mono text-accent-secondary mb-12 tracking-[0.5em] uppercase flex items-center gap-4">
              <span className="h-px flex-1 bg-accent-secondary/30" />
              CAREER_HISTORY.EXE
            </h2>
            
            <div className="space-y-12">
              {CAREER_DATA.map((job, i) => (
                <div key={i} className="relative pl-8 md:pl-12 border-l border-border/50 pb-12 last:pb-0 group">
                  {/* Timeline Node */}
                  <div className="absolute left-[-5px] top-0 w-2 h-2 bg-accent-secondary rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(255,0,127,0.5)]" />
                    
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-accent-secondary transition-colors uppercase">
                      {job.role}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-0.5 border border-border/50">
                      [{job.year}]
                    </span>
                  </div>

                  <div className="text-xs font-mono text-accent-secondary font-bold mb-6 tracking-widest uppercase">
                    &gt; {job.company}
                  </div>

                  <ExpandableDescriptions descriptions={job.descriptions} />

                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-card border border-border px-2 py-0.5 text-muted-foreground uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Education */}
          <section className="mb-12">
            <h2 className="text-xs font-bold font-mono text-accent-tertiary mb-12 tracking-[0.5em] uppercase flex items-center gap-4">
              <span className="h-px flex-1 bg-accent-tertiary/30" />
              ACADEMIC_RECORD.ARCHIVE
            </h2>

            <div className="space-y-8">
              {EDUCATION_DATA.map((edu, i) => (
                <div key={i} className="p-6 bg-card/30 border border-border cyber-chamfer group hover:border-accent-tertiary transition-all">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground uppercase group-hover:text-accent-tertiary transition-colors">
                      {edu.school}
                    </h3>
                    <span className="text-xs font-mono text-accent-tertiary">
                      {edu.year}
                    </span>
                  </div>
                  <div className="text-sm font-mono text-foreground/80 mb-2">
                    {edu.degree}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    // {edu.location}
                    <br />
                    // {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageTransition>
    </div>
  );
}
