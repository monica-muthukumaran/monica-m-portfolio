/**
 * The engineering graph. Positions are authored, not simulated — the layout
 * reads left to right the way a request does: clients, language, framework,
 * transport and runtime, then state and cloud.
 * Coordinate space is the authored grid; the section crops it to the content.
 */

export type StackNode = {
  id: string
  label: string
  x: number
  y: number
  group: 'client' | 'language' | 'framework' | 'runtime' | 'state'
  /** Emphasised nodes are drawn larger — these are the load-bearing ones. */
  weight: 1 | 2
  years: string
  /** What she actually built with it. No adjectives, no proficiency claims. */
  built: readonly string[]
}

export const stackNodes: readonly StackNode[] = [
  {
    id: 'react',
    label: 'React',
    x: 128,
    y: 94,
    group: 'client',
    weight: 1,
    years: '2021 —',
    built: [
      'The ProofAegis client: evidence graph, exception queue, match view and the analytics screen that computes the cross-case split live.',
      'The Sahayak senior-care PWA on Vite and React 19, with WebLLM running inference in the browser and IndexedDB holding the model.',
      'MERN-stack interfaces during the Infosys engineering programme — where I first learned that most front-end performance problems are architectural.',
    ],
  },
  {
    id: 'angular',
    label: 'Angular',
    x: 128,
    y: 474,
    group: 'client',
    weight: 2,
    years: '2021 — 2025',
    built: [
      'Five years of secure enterprise applications at Infosys and Citi, including the Wealth Product Taxonomy front end.',
      'Service-worker upgrade and downgrade strategies that cut application downtime by 26%.',
      'A real-time performance dashboard built on Datadog, the Performance API and Lighthouse budgets — 31% faster after the work it pointed at.',
      'IndexedDB logging through Dexie and the File APIs, making runtime logs readable by the people who actually had the problem.',
      'Shared UI component libraries and reusable modules used across applications.',
    ],
  },
  {
    id: 'java',
    label: 'Java',
    x: 330,
    y: 213,
    group: 'language',
    weight: 2,
    years: '2022 —',
    built: [
      'The two production services behind the Wealth Product Taxonomy engine at Citi — classification and enrichment.',
      'The producers and consumers in my event-platform lab, including retry and dead-letter handling.',
      'JUnit suites as the working surface: if a taxonomy traversal cannot be tested against a fixture tree, the traversal is wrong.',
    ],
  },
  {
    id: 'python',
    label: 'Python',
    x: 330,
    y: 576,
    group: 'language',
    weight: 1,
    years: '2022 —',
    built: [
      'The entire deterministic core of ProofAegis — matching, tolerance, financial impact, the evidence graph and all five cross-case checks.',
      'The FastAPI prototype of the taxonomy engine, built to answer modelling questions cheaply before committing to the production shape.',
      'Synthetic data generation: 321 invoices with ground truth written by a second, independent implementation.',
    ],
  },
  {
    id: 'spring',
    label: 'Spring Boot',
    x: 512,
    y: 94,
    group: 'framework',
    weight: 2,
    years: '2023 —',
    built: [
      'Classification and enrichment services at Citi, split so they scale, fail and release independently.',
      'Kafka producers and consumers with Spring Kafka, consumer groups and dead-letter topics.',
      'AppDynamics instrumentation, health endpoints and the operational surface a service needs before anyone will run it at 3am.',
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    x: 512,
    y: 583,
    group: 'framework',
    weight: 2,
    years: '2025 —',
    built: [
      'Four Google ADK agents on Gemini in ProofAegis, each with a deterministic fallback that reads real bytes rather than inventing them.',
      'A hypothesis agent whose output schema contains no numeric field, so it is structurally unable to fabricate a figure.',
      'Gemma 2 2B quantised to INT4 running on-device in Sahayak, with grammar-constrained JSON decoding and a non-LLM safety engine that can override it.',
      'A trust ledger that records every agreement and disagreement between a model and the deterministic core, instead of silently correcting.',
    ],
  },
  {
    id: 'kafka',
    label: 'Kafka',
    x: 688,
    y: 286,
    group: 'runtime',
    weight: 2,
    years: '2024 —',
    built: [
      'Real-time streaming between the classification and enrichment services in production at Citi.',
      'The spine of my event-platform lab: a user service and a notification service that never call each other.',
      'Consumer groups, offset behaviour and at-least-once delivery, verified by killing consumers mid-stream rather than by reading about them.',
    ],
  },
  {
    id: 'docker',
    label: 'Docker',
    x: 688,
    y: 532,
    group: 'runtime',
    weight: 1,
    years: '2023 —',
    built: [
      'The whole event topology — brokers, services and datastore — declared in one Compose file so a broken broker is one command away.',
      'Containerised Flask for ProofAegis, deployed to Cloud Run from source.',
      'An Electron release server on PostgreSQL, containerised for automated upgrade and rollback testing.',
    ],
  },
  {
    id: 'mongo',
    label: 'MongoDB',
    x: 866,
    y: 83,
    group: 'state',
    weight: 1,
    years: '2021 —',
    built: [
      'Hierarchical taxonomy storage for the WPT engine, with traversal logic kept in application code where it can be tested.',
      'MERN-stack work during the Infosys programme; MongoDB SI Associate certified.',
    ],
  },
  {
    id: 'mysql',
    label: 'MySQL',
    x: 866,
    y: 315,
    group: 'state',
    weight: 1,
    years: '2020 —',
    built: [
      'Relational modelling and query work behind service-side projects — the schema conversations that decide how much the application layer has to apologise for later.',
      'PostgreSQL alongside it for the Electron release server’s deployment history.',
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    x: 866,
    y: 547,
    group: 'state',
    weight: 2,
    years: '2024 —',
    built: [
      'ProofAegis on Google Cloud end to end: Cloud Run, Firestore, BigQuery, Cloud Storage, Firebase Hosting and Auth, with budget alerts wired before the first deploy.',
      'OpenShift deployments through Harness pipelines for the Citi services.',
      'Palantir Foundry — full ownership of the Security Onboarding application, from development through deployment to production support.',
    ],
  },
]

export const stackEdges: readonly (readonly [string, string])[] = [
  ['react', 'spring'],
  ['angular', 'spring'],
  ['react', 'ai'],
  ['java', 'spring'],
  ['python', 'ai'],
  ['java', 'kafka'],
  ['spring', 'kafka'],
  ['spring', 'mongo'],
  ['spring', 'mysql'],
  ['kafka', 'docker'],
  ['ai', 'docker'],
  ['ai', 'cloud'],
  ['docker', 'cloud'],
  ['kafka', 'cloud'],
  ['mongo', 'cloud'],
  ['mysql', 'cloud'],
  ['python', 'spring'],
]
