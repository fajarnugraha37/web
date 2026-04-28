import { Experience, Education } from "@/types";

// --- DATA PROTECTION ZONE: DO NOT ALTER STRINGS ---
export const CAREER_DATA: Experience[] = [
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

export const EDUCATION_DATA: Education[] = [
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
