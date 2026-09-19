/**
 * The two Coding Shuttle systems, as data.
 *
 * ── The one rule this file exists to enforce ──────────────────────────────
 * Every node, lane and step carries a `state`:
 *
 *   'built'    — it exists in the repository today.
 *   'designed' — it is decided in the schema or the design, not yet coded.
 *   'studied'  — it was worked through in the cohort, not built by me here.
 *
 * The renderers draw those three states differently and print a legend, so a
 * visitor can tell at a glance what is code and what is a decision. Nothing
 * here may claim a measured result. If a number is not measured, it is not a
 * number — it is a sentence that says what it was designed around.
 */

export type BuildState = 'built' | 'designed' | 'studied'

export type SystemNode = {
  id: string
  label: string
  /** One short line — the responsibility, not a description. */
  role: string
  state: BuildState
  /** Shown on hover/press. The reason this node is interesting. */
  note?: string
}

export const buildStates: Record<BuildState, { label: string; blurb: string }> = {
  built: { label: 'Implemented', blurb: 'In the repository today.' },
  designed: { label: 'Designed', blurb: 'Decided in the model — not yet coded.' },
  studied: { label: 'Studied', blurb: 'Worked through in the cohort.' },
}

/* ============================================================
   01 — Distributed Payment Gateway
   ============================================================ */

/** The spine: one request, and everything that has to happen after it. */
export const paymentSpine: readonly SystemNode[] = [
  {
    id: 'customer',
    label: 'Customer',
    role: 'Presses pay. Once, they think.',
    state: 'studied',
    note: 'The only actor here who is allowed to be impatient. Everything downstream has to survive them pressing pay twice.',
  },
  {
    id: 'api',
    label: 'Payment API',
    role: 'Authenticates the merchant, takes the idempotency key.',
    state: 'designed',
    note: 'Merchant identity and API keys are in the model, including a rotation time and a grace-period expiry — so a merchant can move keys without a broken deploy.',
  },
  {
    id: 'order',
    label: 'Order service',
    role: 'Creates the order the payment will be made against.',
    state: 'designed',
    note: 'The order carries a unique idempotency key. A retried create collides at the database rather than becoming a second order.',
  },
  {
    id: 'payment',
    label: 'Payment service',
    role: 'Authorises, captures, refunds — and writes every transition down.',
    state: 'designed',
    note: 'Each status change appends to an audit log: from-status, to-status, actor, reason, time. The table has no update path.',
  },
  {
    id: 'kafka',
    label: 'Kafka',
    role: 'The seam. Everything past this point is a consumer.',
    state: 'studied',
    note: 'Putting the broker here is the architectural claim: settlement being slow must not make authorisation fail.',
  },
]

/** What the broker fans out to. Five consumers, one event. */
export const paymentConsumers: readonly SystemNode[] = [
  {
    id: 'processing',
    label: 'Payment processing',
    role: 'Talks to the provider, retries, gives up loudly.',
    state: 'designed',
    note: 'The retry is the easy half. The hard half is knowing whether the attempt that timed out actually charged the card — which is what the idempotency key is for.',
  },
  {
    id: 'fraud',
    label: 'Fraud & security',
    role: 'Scores the payment before it settles.',
    state: 'studied',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    role: 'The money record. Integer paise, never a float.',
    state: 'designed',
    note: 'Every amount in the model is stored as integer paise. Nothing in the schema is a floating-point number.',
  },
  {
    id: 'settlement',
    label: 'Settlement',
    role: 'Moves the merchant their money on a schedule.',
    state: 'studied',
  },
  {
    id: 'notification',
    label: 'Notification',
    role: 'Tells the merchant and the customer what happened.',
    state: 'designed',
    note: 'Modelled as delivery state rather than a call: attempt count, next and last retry, last response code, target URL — and a dead-letter row when it finally gives up.',
  },
]

/* ---- Reliability ------------------------------------------------------- */

export type FailureScenario = {
  id: string
  /** What went wrong, in the fewest words that are still true. */
  title: string
  /** The path the request actually takes. The last step is the safe state. */
  path: readonly string[]
  /** Index of the step where the system does the interesting thing. */
  pivot: number
  answer: string
  /** The mechanism, named. */
  mechanism: string
  state: BuildState
  detail: string
}

export const failures: readonly FailureScenario[] = [
  {
    id: 'duplicate',
    title: 'The network drops after the charge, before the response.',
    path: ['Request', 'Payment service', 'Network failure', 'Retry', 'Duplicate?', 'Idempotency', 'One payment'],
    pivot: 5,
    answer: 'The second request finds the first one.',
    mechanism: 'Idempotency key · unique constraint',
    state: 'built',
    detail:
      'Both the order and the payment carry an idempotency key, and the order’s is a unique key in the schema. That is deliberate: a convention can be forgotten by the next person to write a controller, a unique constraint cannot. The retry collides at the database and returns the original payment instead of making a second one.',
  },
  {
    id: 'webhook-storm',
    title: 'The provider sends the same webhook five times.',
    path: ['Provider', 'Webhook', 'Signature check', 'Seen this id?', 'Skip or process', 'One state change'],
    pivot: 3,
    answer: 'At-least-once delivery is assumed, not resented.',
    mechanism: 'Event de-duplication · delivery state',
    state: 'designed',
    detail:
      'Webhook delivery is modelled as a row, not a call. Each event holds its attempt count, next and last retry timestamps, last response code and target URL — so a duplicate is recognisable, and a failure is still inspectable long after it happened.',
  },
  {
    id: 'dead-letter',
    title: 'The merchant’s endpoint has been down for six hours.',
    path: ['Event', 'Attempt 1', 'Attempt 2', 'Attempt n', 'Dead letter', 'Replay'],
    pivot: 4,
    answer: 'It parks. It does not disappear, and it does not block the queue.',
    mechanism: 'Dead-letter table · replay timestamp',
    state: 'designed',
    detail:
      'A dead-letter table records the final error and keeps a replay timestamp. The queue keeps moving, and the event is still there when somebody fixes the endpoint — which is the whole difference between a lost notification and a late one.',
  },
  {
    id: 'timeline',
    title: 'A support agent asks what the payment was doing at 02:14.',
    path: ['Question', 'Payment row', 'Current status only', 'Audit log', 'Full timeline'],
    pivot: 3,
    answer: 'The current row cannot answer it. The log can.',
    mechanism: 'Append-only audit log',
    state: 'designed',
    detail:
      'Status changes append rather than overwrite — from-status, to-status, actor, reason, occurred-at — with no update path anywhere in the model. The payment’s history stays reconstructable, which is the only version of this that survives a dispute.',
  },
  {
    id: 'vault',
    title: 'A card has to be stored — and a CVV must never be.',
    path: ['Card', 'Vault', 'Encrypted PAN', 'Encrypted data key', 'BIN · brand · last four', 'No CVV column'],
    pivot: 5,
    answer: 'There is nowhere in the schema a CVV could be written.',
    mechanism: 'Card vault · merchant-scoped tokens',
    state: 'designed',
    detail:
      'The vault holds an encrypted PAN and a separately encrypted data key, plus BIN, brand and last four. The absence of a CVV column is the control — storing one is a compliance violation, and a column that does not exist cannot be filled in by an ambitious afternoon.',
  },
]

/* ---- SAGA -------------------------------------------------------------- */

export type SagaStep = {
  label: string
  detail: string
  /** The step that undoes this one when a later step fails. */
  compensation: string
}

export const saga = {
  state: 'designed' as BuildState,
  /** Said plainly, once, so the diagram does not need a paragraph under it. */
  premise:
    'A payment touches several services, and no single database transaction spans them. So the rollback has to be written as a step, by hand, in advance.',
  steps: [
    {
      label: 'Order created',
      detail: 'The order exists, unpaid, with its idempotency key already claimed.',
      compensation: 'Order cancelled',
    },
    {
      label: 'Payment authorised',
      detail: 'The provider is holding the funds. Nothing has actually moved yet.',
      compensation: 'Authorisation voided',
    },
    {
      label: 'Business action',
      detail: 'The thing the customer bought is reserved, issued or allocated.',
      compensation: 'Reservation released',
    },
    {
      label: 'Settlement',
      detail: 'The captured amount is queued to move to the merchant.',
      compensation: 'Refund issued',
    },
  ] as readonly SagaStep[],
  /** Where the failure path is demonstrated, 0-indexed into `steps`. */
  failAt: 2,
  closing:
    'The compensation is not an error handler. It is a business decision — a void and a refund are different events with different money in them, and which one is owed depends on how far the transaction got.',
} as const

/* ---- Webhooks ---------------------------------------------------------- */

export const webhook = {
  state: 'designed' as BuildState,
  lane: [
    {
      id: 'provider',
      label: 'Payment provider',
      role: 'Fires an event. Possibly several times.',
      state: 'studied' as BuildState,
    },
    {
      id: 'endpoint',
      label: 'Webhook endpoint',
      role: 'Accepts fast, and does nothing clever.',
      state: 'designed' as BuildState,
    },
    {
      id: 'signature',
      label: 'Signature verification',
      role: 'The gate. An unsigned event is not an event.',
      state: 'designed' as BuildState,
      note: 'The only place in this flow where rejecting is the correct outcome.',
    },
    {
      id: 'record',
      label: 'Delivery record',
      role: 'Attempt count, last response, next retry.',
      state: 'designed' as BuildState,
    },
    {
      id: 'kafka',
      label: 'Kafka',
      role: 'Published once, read by everyone who cares.',
      state: 'studied' as BuildState,
    },
    {
      id: 'consumers',
      label: 'Consumers',
      role: 'Ledger, notification, reconciliation.',
      state: 'designed' as BuildState,
    },
  ] as readonly SystemNode[],
  note: 'A webhook handler that does work inline is a webhook handler that times out and gets retried. Accept, verify, record, publish — the work belongs to a consumer.',
} as const

/* ---- Scale ------------------------------------------------------------- */

export const scale = {
  heading: 'Built to think about scale.',
  /** Deliberately not a metric. There is no benchmark in this repository. */
  claim: 'Designed around a high-throughput payment-system scenario.',
  disclaimer:
    'No benchmark has been run against this implementation, so there is no throughput number on this page. What follows is what the design does about load — not what it has been measured doing.',
  points: [
    {
      label: 'An asynchronous seam',
      body: 'Authorisation does not wait on settlement, notification or analytics. Those are consumers, and a slow consumer becomes lag rather than a failed payment.',
      state: 'designed' as BuildState,
    },
    {
      label: 'Integer money',
      body: 'Amounts are integer paise everywhere in the model. Nothing rounds, so nothing has to be reconciled later because it rounded.',
      state: 'built' as BuildState,
    },
    {
      label: 'Collisions at the database',
      body: 'Idempotency is a unique constraint, so the duplicate-request path costs one failed insert rather than a distributed lock.',
      state: 'built' as BuildState,
    },
    {
      label: 'Failure has a parking space',
      body: 'Retries are bounded and end in a dead-letter row with a replay timestamp, so one bad endpoint cannot hold a partition hostage.',
      state: 'designed' as BuildState,
    },
  ],
} as const

/* ============================================================
   02 — Distributed Social Platform
   ============================================================ */

export type GraphNode = {
  id: string
  label: string
  /** Node kind — drives shape and size in the renderer. */
  kind: 'person' | 'topic' | 'content'
  /** Position in the field, in percent. Placed by eye. */
  x: number
  y: number
  /** Narrative step this node appears on, so the graph grows as it is told. */
  at: number
}

export type GraphEdge = {
  from: string
  to: string
  /** Rendered along the line, in Neo4j's uppercase relationship idiom. */
  label: string
  at: number
}

export const socialGraph: { nodes: readonly GraphNode[]; edges: readonly GraphEdge[] } = {
  nodes: [
    { id: 'a', label: 'User A', kind: 'person', x: 27, y: 50, at: 0 },
    { id: 'b', label: 'User B', kind: 'person', x: 72, y: 19, at: 1 },
    { id: 'c', label: 'User C', kind: 'person', x: 80, y: 55, at: 1 },
    { id: 'd', label: 'User D', kind: 'person', x: 60, y: 87, at: 1 },
    { id: 'p', label: 'Post', kind: 'content', x: 22, y: 86, at: 2 },
    { id: 't', label: 'Distributed systems', kind: 'topic', x: 24, y: 13, at: 3 },
  ],
  edges: [
    { from: 'a', to: 'b', label: 'CONNECTED_TO', at: 1 },
    { from: 'a', to: 'c', label: 'FOLLOWS', at: 1 },
    { from: 'a', to: 'd', label: 'INTERACTS_WITH', at: 1 },
    { from: 'a', to: 'p', label: 'AUTHORED', at: 2 },
    { from: 'a', to: 't', label: 'INTERESTED_IN', at: 3 },
    { from: 'b', to: 't', label: 'INTERESTED_IN', at: 3 },
  ],
}

/** What the graph becomes once it is a product rather than a diagram. */
export const socialDomains: readonly SystemNode[] = [
  { id: 'profile', label: 'Profile', role: 'The node everything else hangs off.', state: 'built' },
  { id: 'connections', label: 'Connections', role: 'Edges, with a direction and a state.', state: 'built' },
  { id: 'post', label: 'Post', role: 'Content, authored by a node.', state: 'built' },
  { id: 'feed', label: 'Feed', role: 'A read that must be fast and may be slightly stale.', state: 'built' },
  { id: 'notification', label: 'Notification', role: 'A consequence of somebody else’s write.', state: 'built' },
]

/** Why a graph database, shown as the query nobody wants to write in SQL. */
export const graphReasoning = {
  framing: 'What I explored through this project',
  chain: [
    { label: 'You', detail: 'One node.' },
    { label: 'Connection', detail: 'First degree — people already known.' },
    { label: 'Their connection', detail: 'Second degree — the interesting ring.' },
    { label: 'Shared interest', detail: 'An edge that is not a person: a topic, a company, a skill.' },
    { label: 'Recommended', detail: 'The answer, which is just a path that came back.' },
  ],
  body:
    'In a relational schema, “people two hops away who also follow what I follow” is a self-join that gets worse with every hop. In a property graph it is a traversal, and the query reads roughly the way the sentence does. That is the whole argument, and it is why the connection model went into Neo4j rather than beside the rest of the data.',
  caveat:
    'This is what I found by building it — not a claim about how any production professional network is actually architected.',
} as const

/* ---- Kafka fan-out ----------------------------------------------------- */

export type StreamEvent = {
  id: string
  event: string
  producer: string
  consumer: string
  purpose: string
}

export const socialEvents: readonly StreamEvent[] = [
  {
    id: 'post-created',
    event: 'PostCreated',
    producer: 'Post service',
    consumer: 'Feed service',
    purpose: 'Fan the post out to the author’s connections, so the read side is already warm.',
  },
  {
    id: 'post-notify',
    event: 'PostCreated',
    producer: 'Post service',
    consumer: 'Notification service',
    purpose: 'Tell the people who asked to be told — without the author’s request waiting for it.',
  },
  {
    id: 'post-analytics',
    event: 'PostCreated',
    producer: 'Post service',
    consumer: 'Analytics',
    purpose: 'Count it. The slowest consumer, and the one nobody should ever wait on.',
  },
  {
    id: 'connection',
    event: 'ConnectionAccepted',
    producer: 'User service',
    consumer: 'Feed · Notification',
    purpose: 'A new edge changes what both people should see next.',
  },
]

/* ---- Redis ------------------------------------------------------------- */

export const cachePath = {
  state: 'built' as BuildState,
  question: 'Is it in Redis?',
  hit: {
    label: 'Hit',
    steps: ['Return'],
    note: 'The common case, and the only one that should feel instant.',
  },
  miss: {
    label: 'Miss',
    steps: ['Database', 'Write to cache', 'Return'],
    note: 'Pay the cost once, on behalf of everyone who asks next.',
  },
  body:
    'A feed is read far more often than it is written, which is the condition that makes a cache worth its problems. And the problems are real: the cache can be stale, and the write path now has two places to be correct instead of one.',
} as const

/* ---- Service map ------------------------------------------------------- */

export type ServiceNode = SystemNode & {
  /** Row in the map, 0-indexed from the gateway down. */
  tier: number
  /** Ids this service depends on. Drawn as edges. */
  edges?: readonly string[]
}

export const socialServices: readonly ServiceNode[] = [
  {
    id: 'gateway',
    label: 'API Gateway',
    role: 'One entrance. Routing and auth handoff, nothing clever.',
    state: 'built',
    tier: 0,
    edges: ['user', 'post', 'feed'],
    note: 'The gateway is where a client stops needing to know how many services there are.',
  },
  {
    id: 'user',
    label: 'User service',
    role: 'Profiles, connections, the graph itself.',
    state: 'built',
    tier: 1,
    edges: ['auth', 'neo4j'],
  },
  {
    id: 'post',
    label: 'Post service',
    role: 'Writes content, publishes the event, returns.',
    state: 'built',
    tier: 1,
    edges: ['kafka'],
  },
  {
    id: 'feed',
    label: 'Feed service',
    role: 'Reads. Cached, and allowed to be a little behind.',
    state: 'built',
    tier: 1,
    edges: ['redis', 'kafka'],
  },
  {
    id: 'auth',
    label: 'Auth',
    role: 'Identity and tokens, kept off everything else’s request path.',
    state: 'built',
    tier: 2,
  },
  {
    id: 'kafka',
    label: 'Kafka',
    role: 'The bus. Producers do not know who is listening.',
    state: 'built',
    tier: 2,
    edges: ['notification'],
  },
  {
    id: 'redis',
    label: 'Redis',
    role: 'The fast path for the reads that dominate.',
    state: 'built',
    tier: 2,
  },
  {
    id: 'neo4j',
    label: 'Neo4j',
    role: 'Connections as a property graph — traversed, not joined.',
    state: 'built',
    tier: 2,
  },
  {
    id: 'notification',
    label: 'Notification service',
    role: 'A consumer, never a caller.',
    state: 'built',
    tier: 3,
  },
]

/* ============================================================
   The two of them, side by side
   ============================================================ */

export const comparison = {
  heading: ['Two systems.', 'Two kinds of complexity.'],
  left: {
    key: 'Payments',
    challenge: ['consistency', 'reliability', 'failure recovery'],
    line: 'One event that must happen exactly once, in a world where nothing happens exactly once.',
  },
  right: {
    key: 'Social graph',
    challenge: ['relationships', 'events', 'high-volume reads', 'distributed communication'],
    line: 'Millions of events that may each be slightly late — as long as the read is fast and the graph is right.',
  },
  merge: 'Distributed systems',
  closing:
    'The techniques overlap almost completely: a broker, a cache, a bounded retry, an event nobody waits on. What differs is what you are allowed to get wrong. In payments the answer is nothing; in a feed it is a few seconds of staleness. Knowing which of those you are in is most of the design.',
} as const
