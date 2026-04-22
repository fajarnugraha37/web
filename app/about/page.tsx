import { Metadata } from "next";
import { ExpandableSummary } from "@/components/ExpandableSummary";
import { ExpandableDescriptions } from "@/components/ExpandableDescriptions";
import { PageTransition } from "@/components/PageTransition";

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
    role: "LEAD SOFTWARE DEVELOPER",
    company: "Xtremax",
    descriptions: [
      "Lead Software Developer for a GovTech Singapore project, responsible for end-to-end delivery, reliability, and technical direction.",
      "Lead a cross-functional team of 9 engineers (7 Backend, 2 Frontend), driving execution, coaching, and quality standards across 50+ microservices and 50+ UI modules.",
      "Own yearly planning and quarterly execution: resource planning, capacity vs commitment checks, roadmap sequencing, dependency management, and delivery governance.",
      "Provide solutioning and technical leadership for change requests and modernization initiatives (architecture decisions, integration patterns, rollout/rollback plans).",
      "Run risk assessments and research spikes for security, compliance, maintainability, and platform sustainability; translate findings into pragmatic mitigation plans.",
      "Act as a client-facing technical focal point with stakeholders: clarifying requirements, aligning trade-offs, presenting options, and ensuring delivery transparency.",
      "Improve production readiness through incident triage, RCA, and preventive guardrails (defensive coding, review checklists, documentation-first practices).",
    ],
    tech: [
      "Java",
      "Spring Boot",
      "NodeJS",
      ".NET",
      "Vue",
      "OracleSQL",
      "RabbitMQ",
      "Cloud",
      "Microservices",
      "AWS",
      "EKS",
      "K8s",
      "Docker",
    ],
  },
  {
    year: "Jul 2023 - May 2025",
    role: "Software Developer - Backend",
    company: "Xtremax",
    descriptions: [
      "Assigned to a GovTech Singapore project (30+ services) utilizing Java Spring Boot, Node.js, and .NET.",
      "Acted as the main PIC for 5 services (1 .NET service, 1 Nodejs service and 3 Java Spring Boot services); responsibilities included troubleshooting, bug fixing, root cause analysis, and implementing solutions. Communicated technical issues and resolutions to stakeholders.",
      "Collaborated with Business Analysts and Team Leader on system improvements and Change Requests (CRs), from initial feasibility assessment to solution design, detailing tasks, effort estimations, dependencies and implementation plans.",
    ],
    tech: [
      "Java",
      "Spring Boot",
      "NodeJS",
      ".NET",
      "Vue",
      "OracleSQL",
      "RabbitMQ",
      "Cloud",
      "Microservices",
      "AWS",
      "EKS",
      "K8s",
      "Docker",
    ],
  },
  {
    year: "Oct 2022 - Jun 2023",
    role: "Software Developer - Backend",
    company: "Xtremax",
    descriptions: [
      "Served as a Center of Excellence (CoE/RnD) member, supporting Business Analysts (BAs) and Solution Architects (SAs) during tenders.",
      "Developed demo applications to showcase technical solutions for client pitches and tenders.",
      "Provided technical expertise on Adobe Experience Manager (AEM) and Adobe Analytics, including solution formulation, proposal documentation, and client Q&A.",
      "Researched and documented technologies like AEM, Apache Sling, Adobe Analytics, Google Analytics 4 (GA4), Amazon Kendra, etc, creating wikis and training syllabi.",
    ],
    tech: [
      "Java",
      "Adobe Experience Manager (AEM)",
      "Adobe Experience Cloud",
      "AWS",
      "Docker",
    ],
  },
  {
    year: "Feb 2022 - Oct 2022",
    role: "Back End Developer",
    company: "QuickPro / FOREXimf / PT International Mitra Futures",
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
    tech: [
      "NodeJS",
      "Typescript",
      "PHP",
      "MySQL",
      "RabbitMQ",
      "Redis",
      "GCP",
      "Docker",
      "Meta Trader",
      "ZeroMQ",
      "MQL4",
    ],
  },
  {
    year: "Jan 2020 - Jan 2022",
    role: "Fullstack Developer",
    company: "QuickPro / FOREXimf / PT International Mitra Futures",
    descriptions: [
      "Designed, developed, and maintained a trading application (QuickPro) featuring real-time market data, OHLC charts, price/volatility alerts, trading signals, news, economic calendars, custom indicators, candlestick pattern detection, safety alert (to notify if the user&apos;s trading activity has a high risk such as overtrade, stop loss is too big), and more.",
      "Worked with marketing and sales teams to implement new features aligned with business objectives and user needs.",
      "Integrated the backend with the MetaTrader trading platform for real-time market data, enabling the application to display up-to-date price information and facilitate trading activities.",
      "Developed web crawlers to collect economic calendar data and technical analysis from external sources (Investing.com).",
      "Created systems for content generation and notifications based on custom technical indicators and candlestick patterns.",
      "Built an internal application for sales and account managers teams to handling lead tracking, webinar information, client registration, and task management.",
    ],
    tech: [
      "Java",
      "Android",
      "Flutter",
      "PHP",
      "MySQL",
      "Redis",
      "Meta Trader",
      "ZeroMQ",
      "MQL4",
    ],
  },
  {
    year: "Sep 2019 - Dec 2019",
    role: "Fullstack Web Developer",
    company: "QuickPro / FOREXimf / PT International Mitra Futures",
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
    location: "-",
    description: "Credential ID 70L27VTCKNQEQ33K",
  },
  {
    year: "Issued Dec 2022",
    degree: "Adobe Analytics Developer",
    school: "Adobe",
    location: "-",
    description: "Credential ID KY2VK0GKKBB4QT9D",
  },
  {
    year: "2015 - 2019",
    degree: "BACHELOR OF INFORMATICS ENGINEERING",
    school: "UNIVERSITAS KOMPUTER INDONESIA",
    location: "Bandung, West Java",
    description:
      "Graduated with GPA 3.59. Final project: 'Implementation of Q-Learning Combined with CNN Agents Playing the Flappy Bird Game.' Built using Python and TensorFlow libraries.",
  },
  {
    year: "2012 - 2015",
    degree: "SENIOR HIGH SCHOOL",
    school: "SMAN 1 BALEENDAH",
    location: "Bandung, West Java",
    description: "Natural Sciences Major.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen font-mono text-foreground overflow-x-hidden">
      {/* Solid Sunset Background to override global body theme */}
      <div className="fixed inset-0 bg-background -z-50 pointer-events-none" />

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay" />

      {/* Sunset Vibe Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-40] bg-gradient-to-br from-accent/10 via-background to-accent-secondary/10" />

      <PageTransition>
        <div className="py-12 md:py-24 max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          {/* Section 1: Executive Summary */}
          <div className="mb-24 animate-[fadeIn_1s_ease-out]">
            <div className="inline-flex items-center border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-bold mb-6 text-accent cyber-chamfer-reverse shadow-[0_0_10px_rgba(255,115,0,0.3)]">
              {/* SYSTEM_INIT */}
              <span className="animate-blink mr-2 text-accent-tertiary">
                &gt;
              </span>
              SYSTEM_INIT
            </div>

            <ExpandableSummary>
              <p className="text-base md:text-lg leading-relaxed mb-6 text-foreground/90">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary drop-shadow-[0_0_5px_rgba(255,115,0,0.5)]">
                  Lead Software Engineer
                </span>{" "}
                working on a{" "}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-tertiary drop-shadow-[0_0_5px_rgba(255,0,127,0.5)]">
                  GovTech microservices platform
                </span>{" "}
                (Singapore). I keep production alive, delivery predictable, and
                plans honest. Heavily involved in ensuring plans match reality
                (capacity vs commitment), not just optimism.
              </p>
              <p className="text-sm md:text-base leading-relaxed mb-6 text-muted-foreground">
                I&apos;m adaptive and tend to place myself where I can create
                the most impact. Sometimes that means being the firefighter,
                jumping into issues, unblocking delivery, and doing the hard
                triage when things go sideways. But systems that rely on heroes
                are already broken.
              </p>
              <p className="text-sm md:text-base leading-relaxed mb-6 text-muted-foreground">
                I handle solutioning, yearly planning, resource management,
                speed up development, risk assessment, and research spikes, as
                well as being the technical point of contact for stakeholders.
                If there are cost-benefit considerations, I&apos;ll draw it,
                quantify it, and make it explicit, no hidden complexity, no
                wishful thinking.
              </p>
              <p className="text-sm md:text-base leading-relaxed mb-6 text-muted-foreground">
                Work closely across BA, QA, Infra and PMTs because shipping
                software is a team sport, not a solo speedrun and{" "}
                <span className="text-destructive font-bold drop-shadow-[0_0_5px_rgba(255,51,51,0.5)]">
                  &ldquo;ship it&rdquo; without &ldquo;safely&rdquo; is just
                  shipping problems
                </span>
                .
              </p>
              <p className="text-sm md:text-base leading-relaxed text-accent font-bold drop-shadow-[0_0_2px_rgba(255,115,0,0.3)]">
                I strongly believe in a documentation-based approach and clear
                engineering guidelines, because heroics don&apos;t scale. I like
                boring production, docs that don&apos;t lie, honest plans, and
                systems that don&apos;t require heroic measures to operate.
              </p>
            </ExpandableSummary>
          </div>

          {/* Section 2: Career Logs */}
          <div className="mb-12">
            <div className="inline-flex items-center border border-accent-secondary/50 bg-accent-secondary/10 px-3 py-1 text-xs font-bold mb-4 text-accent-secondary cyber-chamfer-reverse shadow-[0_0_10px_rgba(255,0,127,0.3)]">
              <span className="animate-blink mr-2 text-accent">&gt;</span>{" "}
              USER_PROFILE
            </div>
            <h2
              className="text-4xl md:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary cyber-glitch-text pb-2"
              data-text="CAREER LOGS"
            >
              CAREER LOGS
            </h2>
          </div>

          <div className="relative mb-32">
            {/* Glowing Neon Conduit Timeline */}
            <div className="absolute left-6 md:left-[140px] top-4 w-1 h-[calc(100%-2rem)] bg-gradient-to-b from-accent via-accent-secondary to-transparent shadow-[0_0_15px_rgba(255,115,0,0.6)] z-0 rounded-full" />

            <div className="flex flex-col gap-12 relative z-10">
              {CAREER_DATA.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 md:gap-12 relative group"
                >
                  {/* Year Sidebar */}
                  <div className="md:w-[140px] shrink-0 pt-2 flex items-center md:items-start pl-14 md:pl-0 relative z-20">
                    {/* Glowing Node */}
                    <div className="absolute left-[19px] md:left-[135px] top-[14px] w-4 h-4 rounded-full border-2 border-background bg-accent z-20 shadow-[0_0_15px_rgba(255,115,0,1)] group-hover:scale-150 group-hover:bg-accent-secondary transition-all duration-300" />
                    {/* Connection Line */}
                    <div className="hidden md:block absolute left-[140px] top-[21px] w-6 border-t-2 border-accent group-hover:border-accent-secondary transition-colors duration-300 z-10 shadow-[0_0_5px_rgba(255,115,0,0.5)]" />

                    <span className="font-bold text-xs md:text-sm text-accent-tertiary drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                      {item.year}
                    </span>
                  </div>

                  {/* Glassmorphism Card */}
                  <div className="flex-1 ml-14 md:ml-0 relative">
                    {/* Hover Glow Behind Card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="bg-card/40 backdrop-blur-xl border border-accent/20 p-6 md:p-8 group-hover:border-accent/80 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,115,0,0.3)] group-hover:-translate-y-1">
                      <h3 className="text-xl md:text-2xl font-black font-sans text-foreground mb-1 group-hover:text-accent transition-colors drop-shadow-[0_0_2px_rgba(255,115,0,0.5)]">
                        {item.role}
                      </h3>
                      <h4 className="text-xs md:text-sm font-bold text-accent-secondary mb-6 tracking-widest uppercase">
                        // {item.company}
                      </h4>

                      <div className="text-sm text-muted-foreground/90">
                        <ExpandableDescriptions
                          descriptions={item.descriptions}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-accent/10 relative z-30">
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-accent bg-accent/5 border border-accent/30 px-3 py-1 cyber-chamfer-reverse hover:bg-accent hover:text-background hover:shadow-[0_0_10px_rgba(255,115,0,0.8)] transition-all cursor-default"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Education & Certifications */}
          <div className="mb-12">
            <div className="inline-flex items-center border border-accent-tertiary/50 bg-accent-tertiary/10 px-3 py-1 text-xs font-bold mb-4 text-accent-tertiary cyber-chamfer-reverse shadow-[0_0_10px_rgba(255,215,0,0.3)]">
              <span className="animate-blink mr-2 text-accent-secondary">
                &gt;
              </span>{" "}
              ACADEMIC_RECORD
            </div>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-tertiary cyber-glitch-text pb-2"
              data-text="CERTIFICATIONS & EDUCATION"
            >
              CERTIFICATIONS & EDUCATION
            </h2>
          </div>

          <div className="relative mb-12">
            {/* Glowing Neon Conduit Timeline (Pink to Yellow) */}
            <div className="absolute left-6 md:left-[140px] top-4 w-1 h-[calc(100%-2rem)] bg-gradient-to-b from-accent-secondary via-accent-tertiary to-transparent shadow-[0_0_15px_rgba(255,215,0,0.6)] z-0 rounded-full" />

            <div className="flex flex-col gap-12 relative z-10">
              {EDUCATION_DATA.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 md:gap-12 relative group"
                >
                  {/* Year Sidebar */}
                  <div className="md:w-[140px] shrink-0 pt-2 flex items-center md:items-start pl-14 md:pl-0 relative z-20">
                    {/* Glowing Node */}
                    <div className="absolute left-[19px] md:left-[135px] top-[14px] w-4 h-4 rounded-full border-2 border-background bg-accent-secondary z-20 shadow-[0_0_15px_rgba(255,0,127,1)] group-hover:scale-150 group-hover:bg-accent-tertiary transition-all duration-300" />
                    {/* Connection Line */}
                    <div className="hidden md:block absolute left-[140px] top-[21px] w-6 border-t-2 border-accent-secondary group-hover:border-accent-tertiary transition-colors duration-300 z-10 shadow-[0_0_5px_rgba(255,0,127,0.5)]" />

                    <span className="font-bold text-xs md:text-sm text-accent drop-shadow-[0_0_5px_rgba(255,115,0,0.5)] bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                      {item.year}
                    </span>
                  </div>

                  {/* Glassmorphism Card */}
                  <div className="flex-1 ml-14 md:ml-0 relative">
                    {/* Hover Glow Behind Card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-tertiary/10 to-transparent blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="bg-card/40 backdrop-blur-xl border border-accent-secondary/20 p-6 md:p-8 group-hover:border-accent-tertiary/80 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] group-hover:-translate-y-1">
                      <h3 className="text-lg md:text-xl font-black font-sans text-foreground mb-1 group-hover:text-accent-tertiary transition-colors drop-shadow-[0_0_2px_rgba(255,215,0,0.5)]">
                        {item.degree}
                      </h3>
                      <h4 className="text-xs md:text-sm font-bold text-accent mb-4 tracking-widest">
                        // {item.school}{" "}
                        <span className="text-muted-foreground ml-2 opacity-60">
                          [{item.location}]
                        </span>
                      </h4>

                      <p className="text-sm leading-relaxed text-muted-foreground/90 bg-black/40 p-4 border-l-2 border-accent-tertiary/50 shadow-inner">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
