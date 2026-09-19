export type ProjectImage = {
  /** Path under /public — e.g. '/projects/proofaegis.png' */
  src: string
  alt: string
  /** Intrinsic size. Required: it reserves layout space and keeps CLS at zero. */
  width: number
  height: number
}

export type Award = {
  /** The programme or award name, exactly as it is published. */
  title: string
  /** The placement or cohort — kept separate so it can be emphasised. */
  placement: string
  year: string
}

/**
 * The visual language a project is drawn in. Four projects drawn by one
 * renderer look like four instances of a template, so each one gets the form
 * its own domain actually has: evidence converging, a transaction moving down
 * a lane, a graph spreading out, a hierarchy resolving. Colour stays constant —
 * vermilion is the site's only accent, and four accent hues would cheapen it.
 * The identity is the shape.
 */
export type Signature = 'bands' | 'lanes' | 'graph' | 'tree'

export type Project = {
  id: string
  index: string
  name: string
  concept: string
  year: string
  context: string
  /** How this project's system is drawn. Defaults to 'bands'. */
  signature?: Signature
  /**
   * Renders the long-form interactive case study under the scene. Keyed by id
   * in CaseStudy.tsx; omit for projects that tell their whole story in-scene.
   */
  study?: 'payment' | 'social'
  tech: readonly string[]
  /**
   * Technologies the system is designed around or that were worked through in
   * a cohort, but which are not in this repository. Rendered in a visibly
   * different state from `tech`, under its own label — never merged into it.
   */
  techDesigned?: readonly string[]
  /**
   * The whole project in two sentences: what was hard, and what was done about
   * it. This is the only prose on the index, and the opening of the project
   * page. If it needs a third sentence, the second one is not doing its job.
   */
  brief: string
  /**
   * Four lines at most, each one a decision rather than a description. A reader
   * who wants more opens the case study below; a reader who does not should be
   * able to finish this list in fifteen seconds.
   */
  architecture: readonly string[]
  impact: readonly { value: string; label: string }[]
  /** The one detail that makes the project memorable in conversation. */
  note?: { label: string; body: string }
  /** What this project is evidence of. One or two words, shown on the index. */
  kind: string
  /** External recognition. Rendered as a single restrained badge in the header. */
  award?: Award
  /**
   * Where the work was done, when that is a programme rather than a job.
   * Rendered as a quiet mono tag — deliberately not styled like the award,
   * because a cohort is context, not a prize.
   */
  credential?: { label: string; detail: string }
  /**
   * Honest state of the repository. Shown next to the year. Omit for finished
   * work; a project that is mid-build should say so rather than imply otherwise.
   */
  status?: string
  /**
   * Kept in the file but not rendered. Set to false (or delete the line) to put
   * the project back on the site — nothing else needs to change, and its
   * diagram in `diagrams.ts` is still keyed by the same id.
   */
  archived?: boolean
  links?: readonly { label: string; href: string }[]
  /**
   * Drop a screenshot into /public/projects and point at it here to replace the
   * generated diagram. Everything else stays as-is.
   *   image: { src: '/projects/proofaegis.png', alt: '…', width: 1600, height: 1000 }
   */
  image?: ProjectImage
}

const allProjects: readonly Project[] = [
  {
    id: 'proofaegis',
    index: '01',
    name: 'ProofAegis',
    concept: 'An exception engine that investigates what passed, not just what failed.',
    year: '2026',
    context: 'Independent product · Accounts payable & procurement',
    signature: 'bands',
    kind: 'AI · Evidence',
    tech: ['Python', 'Flask', 'Google ADK', 'Gemini', 'Firestore', 'BigQuery', 'Cloud Run', 'React'],
    brief:
      'A three-way match approves an invoice by comparing it against its own purchase order, which is exactly why the expensive failures survive it — a duplicate under a new number, four instalments that each pass, a rate creeping inside tolerance every month. So the checks read the rest of the workspace instead of the current document, and every number a human acts on is computed in plain Python rather than produced by a model.',
    architecture: [
      'Four Gemini agents behind a Flask API, each with a deterministic parser fallback.',
      'Matching, tolerance, financial impact and all five cross-case checks never call a model.',
      'A trust ledger compares every model figure against the deterministic result and overwrites on mismatch.',
      'The hypothesis agent’s output schema has no numeric field, so it cannot fabricate one.',
    ],
    impact: [
      { value: '321', label: 'invoice synthetic portfolio' },
      { value: '13', label: 'exceptions only findable cross-case' },
      { value: '9 of 13', label: 'scored a full three-way match' },
      { value: '320', label: 'labelled cases through shipping code' },
    ],
    award: {
      title: 'Google Patchamomma',
      placement: 'Top 100 Build',
      year: '2026',
    },
    note: {
      label: 'What I did not expect',
      body:
        'The deterministic core fabricated a finding. An invoice for 100 steel pipes was matched against an order for 12 office chairs, and the system reported a variance of 211,200 at high risk, basis “88 unreceived units” — every digit invented, no model involved. Confident fabrication is not a property of language models; it is a property of any system that answers a question without checking whether the question makes sense.',
    },
    links: [{ label: 'Write-up', href: 'https://github.com/monica-muthukumaran' }],
  },

  {
    id: 'payment-gateway',
    index: '02',
    name: 'Distributed Payment Gateway',
    concept: 'Engineering a payment system where reliability matters more than the happy path.',
    year: '2026',
    status: 'In progress — domain model implemented, services in design',
    context: 'Payments infrastructure · Distributed systems',
    signature: 'lanes',
    study: 'payment',
    credential: { label: 'Coding Shuttle', detail: 'Spring Boot 0 to 100 · Cohort 5.0' },
    tech: ['Java 25', 'Spring Boot 4.1', 'Spring Data JPA', 'PostgreSQL', 'Bean Validation', 'Lombok'],
    techDesigned: ['Kafka', 'Redis', 'Resilience4j', 'SAGA', 'Webhooks', 'Docker', 'Kubernetes'],
    kind: 'Distributed systems',
    brief:
      'A payment API is easy to write for the case where everything works; the hard part is the network dropping after the charge, the customer pressing pay twice, and the provider sending the same webhook five times. So I started at the schema rather than the controller — fourteen entities in which idempotency is a unique constraint, the audit log has no update path, and there is nowhere a CVV could be written even by accident.',
    architecture: [
      'Idempotency as a unique constraint, not a convention — a retry collides at the database.',
      'Every amount is integer paise. Nothing in the model is a float.',
      'Webhook delivery is a row with attempt count and retry state, ending in a dead-letter table.',
      'Status changes append to an audit log with no update path, so the timeline survives a dispute.',
    ],
    impact: [
      { value: '14', label: 'entities in the payment domain model' },
      { value: '2', label: 'idempotency keys, one a unique constraint' },
      { value: 'DLQ', label: 'dead-letter table with replay timestamp' },
      { value: 'No CVV', label: 'column exists anywhere in the schema' },
    ],
    note: {
      label: 'Where this actually stands',
      body:
        'The design is ahead of the code, and I would rather say so. Committed: the Spring Boot application, the merchant aggregate and its enums. Modelled but not built: the payment, refund, vault and webhook services. The model came first because idempotency, an immutable audit trail and a keyless vault cannot be retrofitted — they are constraints and absent columns, decided once.',
    },
    links: [{ label: 'Repository', href: 'https://github.com/monica-muthukumaran/Razorpay-Application' }],
  },

  {
    id: 'social-platform',
    index: '03',
    name: 'Distributed Social Platform',
    concept: 'Building the systems behind a professional network.',
    year: '2026',
    context: 'Distributed systems · Graph data',
    signature: 'graph',
    study: 'social',
    credential: { label: 'Coding Shuttle', detail: 'Spring Boot 0 to 100 · Cohort 5.0' },
    tech: ['Spring Boot', 'Microservices', 'Kafka', 'Redis', 'Neo4j', 'REST APIs'],
    kind: 'Distributed systems · Graph',
    brief:
      'A professional network is two systems wearing one interface: a graph, where every question worth asking is about paths rather than rows, and a firehose, where one post must reach a feed, a notification and a counter without the author waiting for any of it. So the connection model went into Neo4j, and Kafka sits between the write and everything that reacts to it.',
    architecture: [
      'Five services behind one gateway, split by what they own rather than by layer.',
      'Connections as a property graph — a second-degree recommendation is a traversal, not a self-join.',
      'Posting publishes an event and returns; feed, notification and analytics each read on their own schedule.',
      'Redis on the feed read path, populated on a miss, so the common case is the fast one.',
    ],
    impact: [
      { value: 'Neo4j', label: 'connections as a property graph' },
      { value: '5', label: 'services behind one gateway' },
      { value: '1 → 3', label: 'one write, three independent consumers' },
      { value: 'Redis', label: 'read-through cache on the feed path' },
    ],
    note: {
      label: 'What I actually took from it',
      body:
        'That the database choice is a consequence of the query, not a preference. I had written second-degree connection logic against a relational schema and thought the pain was mine; it was the shape. Moving the model into a graph did not make the system clever — it made the hard query legible, which is a different and more useful thing.',
    },
  },

  {
    id: 'taxonomy-engine',
    index: '04',
    name: 'Taxonomy Engine',
    concept: 'Hierarchical wealth-product classification, taken from prototype to two production services.',
    year: '2025 — present',
    context: 'Citi · Capital markets',
    signature: 'tree',
    tech: ['Java', 'Spring Boot', 'Kafka', 'MongoDB', 'OpenShift', 'AppDynamics', 'Angular'],
    kind: 'Financial systems',
    brief:
      'Wealth Product Taxonomy classification had to run continuously over a moving catalogue, with every result traceable to the rule that produced it. I prototyped it in Python to settle the modelling questions cheaply, then threw that away and rebuilt it as two Spring Boot services with Kafka between them — so enrichment falling behind slows the pipeline instead of failing the classification.',
    architecture: [
      'Classification and enrichment as separate deployables — independent failure, scale and release.',
      'Kafka between them, so back-pressure becomes consumer lag rather than errors.',
      'Hierarchy resolution over MongoDB, kept in code so it unit-tests against a fixture tree.',
      'AppDynamics on both services, deployed to OpenShift through Harness.',
    ],
    impact: [
      { value: '2', label: 'production microservices, owned end to end' },
      { value: 'Kafka', label: 'real-time streaming between stages' },
      { value: 'Solo', label: 'design, build, deploy and support' },
    ],
  },

  {
    id: 'sahayak-ai',
    archived: true,
    index: '03',
    name: 'Sahayak AI',
    concept: 'A triage assistant that runs a language model offline, on a sub-₹10,000 phone.',
    year: '2026',
    context: 'Independent product · Rural healthcare',
    tech: ['Gemma 2 2B', 'React Native', 'llama.rn', 'SQLite', 'CRDT', 'Gemini', 'Supabase'],
    kind: 'Edge AI · Healthcare',
    brief:
      'Most rural primary health centres have intermittent connectivity, which makes a cloud-only assistant useless exactly where it is needed. So Gemma 2 2B runs quantised on-device, with a non-LLM rule engine beside it that overrides the model on emergency red flags — because a 2B model must not be the last line of defence on chest pain.',
    architecture: [
      'On-device inference through llama.rn with output constrained to JSON schemas by grammar sampling — the model cannot return a shape the app did not ask for.',
      'A non-LLM red-flag engine runs alongside every inference and overrides it when a safety threshold is breached.',
      'Records are append-only CRDTs with vector clocks, so an offline ASHA update and an online clinic update merge deterministically instead of overwriting each other.',
      'Encrypted local SQLite vault (AES-256-GCM) plus a transactional resumable outbox; scheme data arrives as sub-500KB compressed delta bundles when a connection briefly appears.',
      'Offline Haversine routing to the nearest health centre, and a bilingual PDF referral slip generated on-device.',
      'Every yellow and red case is branded preliminary guidance and queued for certified doctor sign-off on sync.',
    ],
    impact: [
      { value: '~1.4 GB', label: 'INT4 model, inside 1.5 GB RAM' },
      { value: '~210 ms', label: 'time to first token' },
      { value: '18–22', label: 'tokens/sec on octa-core mobile' },
      { value: '< 4 s', label: 'full offline triage' },
    ],
    note: {
      label: 'The constraint that shaped everything',
      body:
        'Designing for a 3GB-RAM Android phone is not a performance optimisation applied at the end — it decides the model, the quantisation, the storage engine and the sync protocol. Once the target device is fixed, most architectural arguments resolve themselves.',
    },
  },

  {
    id: 'event-platform',
    archived: true,
    index: '04',
    name: 'Distributed Event Platform',
    concept: 'A services lab for the failure modes you only meet when something is already down.',
    year: '2024 — present',
    context: 'Personal systems lab',
    tech: ['Java', 'Spring Boot', 'Kafka', 'Docker Compose', 'MySQL', 'JUnit'],
    kind: 'Systems lab',
    brief:
      'A synchronous call between two services quietly couples their availability: registration fails because the notifier is down, and a user who did nothing wrong sees the error. This is somewhere to cause that on purpose — two services that never call each other, one Docker Compose file, and a consumer that may be slow, restarted or absent.',
    architecture: [
      'Producer and consumer as separate Spring Boot deployables, sharing an event contract rather than a codebase.',
      'The entire topology — brokers, services, datastore — declared in one Docker Compose file so a broken broker is one command away.',
      'Consumer groups for horizontal scale, with retry and dead-letter handling so a poison message parks instead of stalling the partition.',
      'Deliberate fault injection: kill the consumer mid-stream, restart it, and verify that offsets and at-least-once delivery behave the way the documentation claims.',
    ],
    impact: [
      { value: 'Async', label: 'availability decoupled from the consumer' },
      { value: '1 file', label: 'full topology, reproducible locally' },
      { value: 'DLT', label: 'poison messages park, partitions keep moving' },
    ],
  },
] as const

/** Everything, including archived entries. Use this only for tooling. */
export const projectArchive = allProjects

/** What the site actually renders, in order. */
export const projects: readonly Project[] = allProjects.filter((p) => !p.archived)
