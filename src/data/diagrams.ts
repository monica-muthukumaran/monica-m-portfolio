/**
 * Architecture diagrams as data.
 *
 * Every project is drawn by the same renderer, so four different systems end up
 * speaking one visual language: hairline boxes, a bus between bands, mono
 * labels, and vermilion reserved for the band that carries the project's actual
 * claim. Bands map one-to-one onto the narrative steps, so the diagram builds
 * itself as the story is told.
 */

export type DiagramBox = {
  label: string
  sub?: string
  /** Emphasised band — the part of the system the project is an argument about. */
  accent?: boolean
}

export type DiagramBand = {
  /** Shown to the left of the band. Keep to one or two words. */
  tag: string
  boxes: readonly DiagramBox[]
  accent?: boolean
}

export const diagrams: Record<string, readonly DiagramBand[]> = {
  proofaegis: [
    {
      tag: 'Intake',
      boxes: [
        { label: 'Invoice', sub: 'PDF' },
        { label: 'Purchase order', sub: 'PDF' },
        { label: 'Goods receipt', sub: 'PDF' },
      ],
    },
    {
      tag: 'Read',
      boxes: [{ label: 'Extraction', sub: 'Gemini via ADK — deterministic parser fallback' }],
    },
    {
      tag: 'Decide',
      accent: true,
      boxes: [
        { label: 'Three-way match', sub: 'Python', accent: true },
        { label: 'Cross-case checks ×5', sub: 'reads the workspace', accent: true },
        { label: 'Financial impact', sub: 'arithmetic only', accent: true },
      ],
    },
    {
      tag: 'Explain',
      boxes: [
        { label: 'Severity & draft', sub: 'Gemini, cited' },
        { label: 'Trust ledger', sub: 'model vs. deterministic' },
        { label: 'Reviewer', sub: 'React · human sign-off' },
      ],
    },
  ],

  /* Drawn as lanes, not bands — see Signature.tsx. A payment is one object
     moving down a track past stations that each have to be survivable. */
  'payment-gateway': [
    {
      tag: 'Accept',
      boxes: [
        { label: 'Payment API', sub: 'merchant key · idempotency key' },
        { label: 'Order', sub: 'unique idempotency key' },
      ],
    },
    {
      tag: 'Authorise',
      accent: true,
      boxes: [
        { label: 'Payment service', sub: 'authorise · capture · refund', accent: true },
        { label: 'Audit log', sub: 'append-only, no update path', accent: true },
      ],
    },
    {
      tag: 'Publish',
      boxes: [{ label: 'Kafka', sub: 'the seam — everything after is a consumer' }],
    },
    {
      tag: 'React',
      boxes: [
        { label: 'Ledger', sub: 'integer paise' },
        { label: 'Settlement', sub: 'scheduled' },
        { label: 'Webhooks', sub: 'delivery state · dead letter' },
      ],
    },
  ],

  /* No entry for 'social-platform' on purpose: it is drawn as a graph, and its
     nodes and relationships live in `socialGraph` in systems.ts. Bands would
     be unused data that looks authoritative. */

  'taxonomy-engine': [
    {
      tag: 'Source',
      boxes: [
        { label: 'Product catalogue', sub: 'moving' },
        { label: 'Taxonomy rules', sub: 'WPT hierarchy' },
      ],
    },
    {
      tag: 'Classify',
      boxes: [{ label: 'Classification service', sub: 'Java · Spring Boot · MongoDB' }],
    },
    {
      tag: 'Stream',
      accent: true,
      boxes: [{ label: 'Kafka topic', sub: 'back-pressure becomes lag, not errors', accent: true }],
    },
    {
      tag: 'Enrich',
      boxes: [
        { label: 'Enrichment service', sub: 'independent deployable' },
        { label: 'MongoDB', sub: 'classified products' },
        { label: 'AppDynamics', sub: 'OpenShift · Harness' },
      ],
    },
  ],

  'sahayak-ai': [
    {
      tag: 'Input',
      boxes: [{ label: 'Voice or text', sub: 'local language, on a sub-₹10,000 phone' }],
    },
    {
      tag: 'Infer',
      accent: true,
      boxes: [
        { label: 'Gemma 2 2B · INT4', sub: 'on-device, grammar-constrained', accent: true },
        { label: 'Red-flag engine', sub: 'non-LLM, can override', accent: true },
      ],
    },
    {
      tag: 'Reason',
      boxes: [
        { label: 'Clinical specialist', sub: 'green / yellow / red' },
        { label: 'Financial counsellor', sub: 'PM-JAY · Jan Aushadhi' },
        { label: 'Referral', sub: 'offline Haversine routing' },
      ],
    },
    {
      tag: 'Persist',
      boxes: [
        { label: 'Encrypted vault', sub: 'SQLite · AES-256-GCM' },
        { label: 'CRDT outbox', sub: 'append-only, resumable' },
        { label: 'Doctor sign-off', sub: 'on sync, before prescription' },
      ],
    },
  ],

  'event-platform': [
    {
      tag: 'Request',
      boxes: [{ label: 'POST /users', sub: 'the caller waits for one thing only' }],
    },
    {
      tag: 'Produce',
      boxes: [
        { label: 'User service', sub: 'Spring Boot' },
        { label: 'MySQL', sub: 'committed before publish' },
      ],
    },
    {
      tag: 'Transport',
      accent: true,
      boxes: [{ label: 'Kafka topic', sub: 'consumer group · at-least-once', accent: true }],
    },
    {
      tag: 'Consume',
      boxes: [
        { label: 'Notification service', sub: 'may be slow, restarted or absent' },
        { label: 'Dead-letter topic', sub: 'poison messages park here' },
      ],
    },
  ],
}
