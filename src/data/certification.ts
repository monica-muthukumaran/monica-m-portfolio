/**
 * Structured learning, stated plainly.
 *
 * The section this feeds is deliberately smaller than a project scene. The
 * projects are the evidence; this is the supporting proof, and the layout says
 * so. Nothing in here may be invented — no credential id, no score, no issue
 * date that has not been confirmed.
 */

export type CertificateAsset = {
  /** A file under /public — image or PDF. */
  src: string
  alt: string
  /** Intrinsic size for images, so the lightbox reserves its space. */
  width: number
  height: number
  kind: 'image' | 'pdf'
}

export const certification = {
  issuer: 'Coding Shuttle',
  programme: 'Spring Boot 0 to 100',
  cohort: 'Cohort 5.0',
  completed: '2026',
  issuerUrl: 'https://codingshuttle.com',

  summary:
    'A structured, project-based course in Spring Boot and distributed systems. Two systems came out of it — a payment gateway and a social platform — and they are the two case studies above. The certificate says the course was completed; the systems are what I would rather be judged on.',

  /** Covered by the programme. Not a claim that I shipped each one. */
  covered: [
    'Spring Boot & Spring Framework',
    'REST API design',
    'Spring Data JPA',
    'Spring Security & JWT',
    'Microservices',
    'Apache Kafka',
    'Redis',
    'Neo4j',
    'Resilience4j',
    'Docker',
    'Kubernetes',
    'System design',
  ],

  /**
   * Drop the certificate into /public/certificates and point at it here — the
   * "View Certificate" button and its lightbox appear automatically. Until
   * then the section shows the credential and links to the issuer, which is
   * the honest state. Do not substitute a rendered look-alike.
   *
   *   asset: {
   *     src: '/certificates/coding-shuttle-spring-boot.png',
   *     alt: 'Coding Shuttle Spring Boot 0 to 100, Cohort 5.0 — certificate of completion',
   *     width: 1600, height: 1131, kind: 'image',
   *   },
   */
  asset: null as CertificateAsset | null,

  /** A public verification URL, if one is issued. Rendered only when present. */
  verifyUrl: null as string | null,
} as const
