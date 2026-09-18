export type Role = {
  id: string
  company: string
  role: string
  period: string
  from: string
  to: string
  location: string
  summary: string
  responsibilities: readonly string[]
  systems: readonly { name: string; detail: string }[]
  stack: readonly string[]
  current?: boolean
}

export const experience: readonly Role[] = [
  {
    id: 'citi',
    company: 'Citi',
    role: 'Application Development Programmer Analyst 2',
    period: 'April 2025 — Present',
    from: '2025-04',
    to: 'present',
    location: 'Chennai · Capital Markets',
    summary:
      'Backend and full-stack work on enterprise capital-markets applications, with end-to-end ownership of services from design through production support.',
    responsibilities: [
      'Designed and built a hierarchical taxonomy engine for Wealth Product Taxonomy classification, prototyped in Python and FastAPI to settle the modelling questions first.',
      'Re-architected and delivered it as two production Java Spring Boot microservices — classification and enrichment — with Kafka streaming between them.',
      'Instrumented both services with AppDynamics and deployed to OpenShift through Harness pipelines.',
      'Took complete ownership of the Security Onboarding application on Palantir Foundry: development, deployment and production support, end to end.',
      'Built and maintained several Foundry applications after upskilling on the platform inside a short window.',
      'Contributed to shared UI component libraries and reusable front-end modules used across applications.',
      'Contributed to a Git Diff Tracker initiative that surfaces configuration and code changes between releases.',
    ],
    systems: [
      { name: 'Taxonomy Engine', detail: 'Two Spring Boot services, Kafka-streamed, MongoDB-backed' },
      { name: 'Security Onboarding', detail: 'Palantir Foundry application, owned solo end to end' },
      { name: 'Git Diff Tracker', detail: 'Release-over-release configuration and code change surfacing' },
    ],
    stack: ['Java', 'Spring Boot', 'Kafka', 'MongoDB', 'Python', 'FastAPI', 'Angular', 'OpenShift', 'Palantir Foundry'],
    current: true,
  },
  {
    id: 'infosys-dse',
    company: 'Infosys',
    role: 'Digital Specialist Engineer',
    period: 'December 2021 — March 2025',
    from: '2021-12',
    to: '2025-03',
    location: 'Chennai',
    summary:
      'Secure Angular and Electron applications, with a long run of performance and reliability work — and a code-review lead role that shaped how I read other people’s systems.',
    responsibilities: [
      'Delivered secure, production-grade applications in Angular and Electron, owning technical troubleshooting and performance optimisation.',
      'Led code reviews for coding standards, architectural compliance and long-term maintainability.',
      'Contributed to quarterly PI planning — scope definition, user-story prioritisation and aligning features to business goals.',
      'Packaged Electron applications into MSI and EXE installers for Windows deployment.',
      'Implemented automated upgrade and downgrade deployment strategies so updates and rollbacks were both routine.',
      'Built file-logging and crash-report systems so runtime failures could be diagnosed from the machine they happened on.',
      'Explored an Electron release server on PostgreSQL and Docker for automated deployment.',
    ],
    systems: [
      { name: 'Service-worker upgrade strategy', detail: '26% reduction in application downtime' },
      { name: 'Performance observability', detail: 'Datadog, Lighthouse and Performance API — 31% faster' },
      { name: 'IndexedDB logging', detail: 'Dexie and File APIs — 8% improvement in log accessibility' },
      { name: 'Electron packaging', detail: 'MSI/EXE installers — 80% more deployable' },
    ],
    stack: ['Angular', 'Electron', 'TypeScript', 'Datadog', 'Karma–Jasmine', 'Docker', 'PostgreSQL'],
  },
  {
    id: 'infosys-trainee',
    company: 'Infosys',
    role: 'Digital Specialist Engineer Trainee',
    period: 'September 2021 — December 2021',
    from: '2021-09',
    to: '2021-12',
    location: 'Mysuru',
    summary: 'The MERN stack, end to end, and the first time I shipped something other people depended on.',
    responsibilities: [
      'Hands-on full-stack development across MongoDB, Express, React and Node.',
      'Built responsive front-end interfaces in React.',
      'Worked inside agile practice — stand-ups, sprint reviews and the habit of showing work before it is finished.',
    ],
    systems: [{ name: 'MERN training projects', detail: 'Full-stack delivery from schema to interface' }],
    stack: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
]

export const education = {
  degree: 'Bachelor of Engineering',
  institution: "St. Joseph's Institute of Technology",
  period: '2017 — 2021',
  detail: 'CGPA 8.5',
}

export const certifications: readonly string[] = [
  'Palantir Foundry — Software Development Essentials',
  'MongoDB SI Associate',
  'Infosys Certified Front-End Web Developer',
  'FastAPI — Udemy',
]

export const recognition: readonly string[] = [
  'Google Patchamomma 2026 — Top 100 Build, for ProofAegis',
  'Insta Awards for client engagement and delivery',
  'Outstanding ratings across yearly performance reviews',
]
