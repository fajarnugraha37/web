import { Metadata } from "next";
import { ExpandableSummary } from "@/components/ExpandableSummary";
import { ExpandableDescriptions } from "@/components/ExpandableDescriptions";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Profile // SYS_OP",
  description: "Career and technical background.",
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
      "Designed, developed, and maintained a trading application (QuickPro) featuring real-time market data, OHLC charts, price/volatility alerts, trading signals, news, economic calendars, custom indicators, candlestick pattern detection, safety alert (to notify if the user's trading activity has a high risk such as overtrade, stop loss is too big), and more.",
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
    <PageTransition>
      <div className="py-12 md:py-20 max-w-4xl mx-auto">
        {/* Executive Summary */}
        <div className="mb-20">
          <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-4 text-accent-tertiary">
            <span className="animate-blink mr-2">&gt;</span> SYSTEM_INIT //
            EXECUTIVE_SUMMARY
          </div>
          <ExpandableSummary>
            <p className="font-mono text-foreground/90 leading-relaxed mb-4">
              Lead Software Engineer working on GovTech microservices platform
              (Singapore). I keep production alive, delivery predictable, and
              plans honest. Heavily involved in ensuring plans match reality
              (capacity vs commitment), not just optimism.
            </p>
            <p className="font-mono text-foreground/90 leading-relaxed mb-4">
              I&apos;m adaptive and tend to place myself where I can create the
              most impact. Sometimes that means being the firefighter, jumping
              into issues, unblocking delivery, and doing the hard triage when
              things go sideways. But systems that rely on heroes are already
              broken.
            </p>
            <p className="font-mono text-foreground/90 leading-relaxed mb-4">
              I handle solutioning, yearly planning, resource management, speed up
              development, risk assessment, and research spikes, as well as being
              the technical point of contact for stakeholders. If there are
              cost-benefit considerations, I&apos;ll draw it, quantify it, and
              make it explicit, no hidden complexity, no wishful thinking.
            </p>
            <p className="font-mono text-foreground/90 leading-relaxed mb-4">
              Work closely across BA, QA, Infra and PMTs because shipping software
              is a team sport, not a solo speedrun and{" "}
              <span className="text-destructive font-bold">
                &ldquo;ship it&rdquo; without &ldquo;safely&rdquo; is just
                shipping problems
              </span>
              .
            </p>
            <p className="font-mono text-accent leading-relaxed">
              I strongly believe in a documentation-based approach and clear
              engineering guidelines, because heroics don&apos;t scale. <br />I
              like boring production, docs that don&apos;t lie, honest plans, and
              systems that don&apos;t require heroic measures to operate.
            </p>
          </ExpandableSummary>
        </div>

        <div className="mb-16">
          <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-4 text-accent-tertiary">
            <span className="animate-blink mr-2">&gt;</span> USER_PROFILE
          </div>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-widest text-foreground cyber-glitch-text"
            data-text="CAREER LOGS"
          >
            CAREER LOGS
          </h2>
        </div>

        <div className="relative">
          {/* Main central circuit line */}
          <div className="absolute left-4 md:left-[120px] top-4 border-l-2 border-accent/30 h-full z-0" />

          {/* Decorative Grid */}
          <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none -z-10" />

          <div className="flex flex-col gap-12 relative z-10">
            {CAREER_DATA.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 md:gap-12 relative group"
              >
                {/* Year - Sidebar */}
                <div className="md:w-[120px] shrink-0 pt-1 flex items-center md:items-start pl-12 md:pl-0 relative z-20">
                  {/* Connection Node */}
                  <div className="absolute left-[13px] md:left-[117px] top-5 w-3 h-3 rounded-none border border-accent bg-background z-20 group-hover:bg-accent group-hover:shadow-[0_0_10px_rgba(0,255,136,0.8)] transition-all" />
                  {/* Horizontal lead line (md+) */}
                  <div className="hidden md:block absolute left-[120px] top-[25px] w-8 border-t-2 border-accent/30 group-hover:border-accent transition-colors z-10" />

                  <span className="font-mono text-sm text-accent-secondary bg-background md:pr-4 relative z-20">
                    {item.year}
                  </span>
                </div>

                {/* Card */}
                <div className="flex-1 ml-12 md:ml-0 bg-card/60 backdrop-blur-sm border border-border p-6 group-hover:border-accent/50 transition-colors relative z-10">
                  <h3 className="text-xl font-bold font-sans text-foreground mb-1 group-hover:text-accent transition-colors">
                    {item.role}
                  </h3>
                  <h4 className="text-sm font-mono text-muted-foreground mb-4">
                    {"@ " + item.company}
                  </h4>

                  <ExpandableDescriptions descriptions={item.descriptions} />

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30 relative z-30 px-8">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase font-mono tracking-widest text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/20 px-2 py-1 inline-block z-40 relative"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 mb-16">
          <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-4 text-accent-tertiary">
            <span className="animate-blink mr-2">&gt;</span> ACADEMIC_RECORD
          </div>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-widest text-foreground cyber-glitch-text"
            data-text="EDUCATION AND CERTIFICATION LOGS"
          >
            EDUCATION AND CERTIFICATION LOGS
          </h2>
        </div>

        <div className="relative">
          {/* Main central circuit line */}
          <div className="absolute left-4 md:left-[120px] top-4 border-l-2 border-accent-secondary/40 h-full z-0" />

          <div className="flex flex-col gap-12 relative z-10">
            {EDUCATION_DATA.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 md:gap-12 relative group"
              >
                {/* Year - Sidebar */}
                <div className="md:w-[120px] shrink-0 pt-1 flex items-center md:items-start pl-12 md:pl-0 relative z-20">
                  {/* Connection Node */}
                  <div className="absolute left-[13px] md:left-[117px] top-5 w-3 h-3 rounded-none border border-accent-secondary bg-background z-20 group-hover:bg-accent-secondary group-hover:shadow-[0_0_10px_rgba(255,0,255,0.8)] transition-all" />
                  {/* Horizontal lead line (md+) */}
                  <div className="hidden md:block absolute left-[120px] top-[25px] w-8 border-t-2 border-accent-secondary/30 group-hover:border-accent-secondary transition-colors z-10" />

                  <span className="font-mono text-sm text-accent-tertiary bg-background md:pr-4 relative z-20">
                    {item.year}
                  </span>
                </div>

                {/* Card */}
                <div className="flex-1 ml-12 md:ml-0 bg-card/60 backdrop-blur-sm border border-border p-6 group-hover:border-accent-secondary/50 transition-colors relative z-10">
                  <h3 className="text-xl font-bold font-sans text-foreground mb-1 group-hover:text-accent-secondary transition-colors">
                    {item.degree}
                  </h3>
                  <h4 className="text-sm font-mono text-muted-foreground mb-4">
                    {"@ " + item.school}{" "}
                    <span className="text-accent-tertiary/70 text-xs ml-2">
                      [{item.location}]
                    </span>
                  </h4>

                  <p className="font-mono text-sm leading-relaxed mb-2 text-foreground/80 px-6">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
