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
  problem: string
  solution: string
  architecture: readonly string[]
  impact: readonly { value: string; label: string }[]
  /** The one detail that makes the project memorable in conversation. */
  note?: { label: string; body: string }
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
    tech: ['Python', 'Flask', 'Google ADK', 'Gemini', 'Firestore', 'BigQuery', 'Cloud Run', 'React'],
    problem:
      'A three-way match approves an invoice by comparing it against its own purchase order and goods receipt. That is exactly why the most expensive failures survive it. The same work billed twice under a new number, four instalments that each pass but together exceed the order, a supplier’s bank details quietly changing, a rate creeping three percent a month inside tolerance every month — none of those are visible from inside the invoice they arrive on.',
    solution:
      'Five cross-case checks that read the rest of the workspace rather than the current document, layered onto a conventional matcher. The AI layer is deliberately confined to language and judgement — severity, plain-language explanation, a cited draft to the vendor, ranked hypotheses about what to check next. Matching, tolerance, financial impact and all five cross-case findings are plain Python, because a number a human acts on must never come from a model.',
    architecture: [
      'Flask API with four Google ADK agents on Gemini; every agent has a deterministic parser fallback that reads real bytes rather than inventing them.',
      'Deterministic core — matching, tolerance, financial impact, evidence graph and portfolio analytics — isolated in services that never call a model.',
      'A trust ledger compares every model-produced financial figure against the deterministic match result, overwrites on mismatch, and records the agreement or disagreement as a visible row instead of a log line.',
      'The hypothesis agent’s output schema contains no numeric field at all, so it is structurally incapable of fabricating a figure.',
      'Firestore for cases, BigQuery for portfolio analytics, Cloud Storage for documents, Cloud Run for the API, Firebase Hosting for the React client.',
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
        'The deterministic core fabricated a finding. Somebody uploaded the wrong purchase order — an invoice for 100 steel pipes matched against an order for 12 office chairs — and the system reported a quantity variance of 211,200 at high risk, basis "88 unreceived units". 88 is 100 minus 12. Every digit invented, no model involved. Confident fabrication turns out not to be a property of language models; it is a property of any system that answers a question without checking whether the question makes sense. A coherence check now runs before any variance is computed.',
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
    problem:
      'A payment API is easy to write for the case where everything works. The hard part is everything else: the network drops after the charge but before the response, the customer presses pay twice, the provider calls your webhook five times for one event, a card has to be stored without ever storing a CVV, and a support agent needs to know exactly what the payment was doing at 02:14. None of that is a feature you add later — it is decided in the schema, before any service exists.',
    solution:
      'I started this one at the data model rather than the controller, on the argument that in payments the schema is the system. Fourteen entities covering merchant onboarding and KYC, API keys, orders, payments, refunds, a card vault, webhook delivery and a dead-letter queue — designed so that the properties that matter cannot be forgotten later: idempotency keys are unique constraints, the audit log has no update path, and there is nowhere in the schema a CVV could be written even by accident.',
    architecture: [
      'Idempotency as a schema constraint, not a convention: both the order and the payment carry an idempotency key, and the order’s is a unique key — a retried request collides at the database rather than charging twice.',
      'Money is stored as integer paise on every amount. Nothing in the model is a float.',
      'Webhook delivery is modelled as state, not a fire-and-forget call: each event holds its attempt count, next and last retry timestamps, last response code and target URL, with a dead-letter table that records the final error and keeps a replay timestamp.',
      'API keys rotate with an explicit grace window — the record holds both a rotation time and a grace-period expiry, so a merchant can move keys without a broken deploy.',
      'The card vault stores an encrypted PAN and a separately encrypted data key, plus BIN, brand and last four. There is no CVV column, and the model notes why: storing one is a compliance violation. Merchant-scoped card tokens sit in front of the vault.',
      'Payment state changes are written to an append-only audit log — from-status, to-status, actor, reason, occurred-at — with no update path, so the payment timeline is reconstructable.',
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
        'The design is ahead of the code, and I would rather say so than imply otherwise. What is committed is the Spring Boot application, the merchant aggregate and the enums around it; the payment, refund, vault and webhook services are modelled but not yet built. The reason the model came first is that idempotency, an immutable audit trail and a keyless card vault are all things you cannot retrofit — they are unique constraints and absent columns, and both are decisions you make once.',
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
    problem:
      'A professional network is two systems wearing one interface. One of them is a graph — who knows whom, who follows whom, who shares an interest with whom — and the questions worth asking of it are all about paths rather than rows. The other is a firehose: one post has to reach a feed, a notification and an analytics counter, and the person who wrote it should not be waiting while any of that happens.',
    solution:
      'I built it as separate services behind one gateway, with the connection model in Neo4j rather than beside the rest of the data, and Kafka between the write side and everything that reacts to a write. The feed reads through Redis, because a feed is read far more often than it is written — which is the condition that makes a cache worth the two places it creates for you to be wrong.',
    architecture: [
      'Services split by what they own — profiles and connections, posts, feed, notifications — with an API gateway as the single entrance so a client never needs to know how many there are.',
      'Connections modelled as a property graph in Neo4j: a second-degree recommendation is a traversal, not a self-join that gets worse with every hop.',
      'Kafka between the write and the reactions. Posting publishes an event and returns; the feed, notification and analytics consumers each read it on their own schedule.',
      'Redis on the feed read path, populated on a miss, so the common case is the fast one.',
      'REST APIs between the client and the gateway; events, not calls, between the services themselves.',
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
        'That the database choice is a consequence of the query, not a preference. I had written second-degree connection logic against a relational schema before and thought the pain was mine. It was the shape: every extra hop is another join, and the query stops reading like the question. Moving the connection model into a graph did not make the system clever — it made the hard query legible, which is a different and more useful thing.',
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
    problem:
      'Wealth Product Taxonomy classification needed to run continuously over a moving catalogue of financial products, with every classification traceable to the rule that produced it. The shape of the problem was clear from a prototype I built in Python and FastAPI; the shape of the production system was not the same shape.',
    solution:
      'I re-architected it as two Java Spring Boot microservices with a single responsibility each — a classification service that resolves a product to a node in the hierarchy, and an enrichment service that decorates it downstream — connected by Kafka rather than a synchronous call, so enrichment falling behind slows the pipeline instead of failing the classification.',
    architecture: [
      'Classification and enrichment split into separate deployables so they can fail, scale and release independently.',
      'Kafka between them: classification publishes, enrichment consumes. Back-pressure becomes lag, not errors.',
      'Hierarchical taxonomy resolution over MongoDB, with the traversal kept in code that can be unit-tested against a fixture tree.',
      'AppDynamics instrumentation on both services; deployed to OpenShift through Harness pipelines.',
      'Prototyped first in Python, FastAPI, MongoDB and Angular — the prototype existed to answer modelling questions cheaply, then was thrown away.',
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
    problem:
      'More than 60% of rural primary health centres have intermittent or no connectivity, which makes a cloud-only assistant useless exactly where it is needed. The health workers who would use it largely do not work in English. And out-of-pocket medical cost is the leading cause of rural poverty, so a diagnosis without a financial answer leaves the patient no better off.',
    solution:
      'Gemma 2 2B quantised to INT4 runs on-device for triage, with Gemini as an upgrade path rather than a dependency when a connection appears. A four-agent pipeline separates triage routing, clinical assessment, financial counselling against Ayushman Bharat and Jan Aushadhi, and referral. A deterministic rule engine runs in parallel with the model and overrides it on emergency red flags, because a 2B model must not be the last line of defence on chest pain.',
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
    problem:
      'A synchronous call between two services quietly couples their availability: registration fails because the notifier is down, and the failure surfaces to a user who did nothing wrong. I wanted somewhere to make that failure happen on purpose, repeatedly, and to try the answers with my hands rather than from a diagram.',
    solution:
      'A small event-driven topology — a user service and a notification service that never call each other — connected by Kafka and brought up as one unit in Docker Compose. Registration succeeds by publishing; notification is a consumer that may be slow, restarted, or absent, and the system stays correct in all three cases.',
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
