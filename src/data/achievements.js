export const achievements = [
  {
      id: 1,
      title: "Star of the Month (4x)",
      description: "Awarded Star of the Month four times within a single year for consistent delivery and technical ownership.",
      icon: "Trophy"
  },
  {
      id: 2,
      title: "Smart India Hackathon Winner",
      description: "National Level Hackathon, Ministry of Education, 2022 â recognized for innovative technical solutions.",
      icon: "Zap"
  },
  {
      id: 3,
      title: "ICPC Gwalior-Pune Regional â Rank 70",
      description: "Secured 70th rank at Regionals and 139th at Prelims in ICPC 2021, demonstrating advanced algorithmic skills.",
      icon: "Code"
  },
  {
      id: 4,
      title: "ICPC Kanpur-Mathura Regional â Rank 125",
      description: "Secured 125th rank at Regionals and 300th at Prelims in ICPC 2022.",
      icon: "Code"
  },
  {
      id: 6,
      title: "Performance Optimization",
      description: "Reduced dashboard API response time from 2s to 100ms by optimizing OpenSearch queries and removing redundant lookups.",
      icon: "Zap"
  }
];

export const experienceData = [
  {
      id: 1,
      role: "Software Engineer",
      company: "Vittaka (Subsidiary of Equirus Wealth)",
      period: "Sep 2025 - Present",
      techStack: "Kotlin, Java, Spring Boot, OpenSearch, PostgreSQL, MyBatis",
      bullets: [
      "Production Stability: Identified and fixed production deadlocks in batch jobs and OpenSearch sync by restructuring transaction boundaries and query execution order.",
      "Batch Scheduling Module: Designed a configurable batch/cron scheduling module from scratch for a SaaS multi-tenant platform, using dynamic JSON-based metadata allowing scheduling changes at runtime.",
      "End-to-End Feature Ownership: Owned critical features including SEBI nominee compliance, risk profiling, 5-step client onboarding, tech support, and multi-admin client mapping across tenants.",
      "Mentorship: Mentored interns by providing technical guidance, conducting code reviews, and creating a structured learning environment while balancing project delivery."
    ]
  },
  {
      id: 2,
      role: "Software Engineer",
      company: "Equirus Wealth",
      period: "July 2024 - Aug 2025",
      techStack: "Kotlin, Java, Spring Boot, OpenSearch, PostgreSQL, MyBatis",
      bullets: [
      "Fuzzy Search: Built a fuzzy search module using OpenSearch, enabling typo-tolerant search and improving result accuracy across the platform.",
      "CSV Export at Scale: Built a CSV export service that streams 1M+ records using batched reads and buffered writes, avoiding memory issues and timeouts.",
      "Dashboard Optimization: Reduced dashboard API response time from 2s to 100ms by optimizing OpenSearch queries and removing redundant lookups.",
      "Data Masking: Built a field-level data masking layer with role-based access, using annotations to control which fields are masked or visible per API response.",
      "Account Aggregator Integration: Integrated Account Aggregator APIs to fetch real-time bank data using webhooks and data normalization for account analytics."
    ]
  },
  {
      id: 3,
      role: "Software Engineer Intern",
      company: "Equirus Wealth",
      period: "Feb 2024 - June 2024",
      techStack: "Kotlin, Spring Boot, Redis, PostgreSQL",
      bullets: [
      "Excel Report Generator: Built an Excel report generator with dynamic logos, auto-merge, and nested data rendering using Apache POI.",
      "API Development: Developed 30+ REST APIs with database indexing, cursor-based pagination, and schema-level input validation.",
      "Session Management: Implemented session management with activity-based expiry and remember-me token logic using Redis, ensuring secure session persistence across user logins."
    ]
  }
];

export const educationData = [
  {
      id: 1,
      degree: "B.Tech in Computer Science and Engineering",
      institution: "JSS Academy of Technical Education, Noida",
      period: "2020 - 2024",
      score: "CGPA: 8.47"
  }
];
