export type Fundamental = {
  title: string
  body: string
  /** The system it actually showed up in. Never a course, never a checkbox. */
  where: string
}

/**
 * Fundamentals are claimed on every engineer's portfolio, so the claim is worth
 * nothing. These are written as evidence instead: the decision, the trade-off it
 * bought, and the system it was made in. Anything that cannot name a system does
 * not belong in this file.
 */

export const systemDesign: readonly Fundamental[] = [
  {
    title: 'Decomposition along reasons to change',
    body: 'Classification and enrichment were one service until it was clear they had different scaling curves and different release cadences. Splitting them cost a network hop and bought independent failure, independent deploys and a contract that can be tested on its own.',
    where: 'Taxonomy Engine · Citi',
  },
  {
    title: 'Choosing an asynchronous boundary',
    body: 'A synchronous call couples availability: if enrichment is slow, classification fails, and a user who did nothing wrong sees the error. A topic between them converts back-pressure into consumer lag — a number you can watch instead of an incident.',
    where: 'Taxonomy Engine · Citi',
  },
  {
    title: 'Drawing the determinism boundary',
    body: 'Deciding which layer is allowed to produce a number a human acts on, then enforcing it in code rather than in a convention. Matching, tolerance and financial impact are plain Python; the model gets language and judgement, and its output is compared against the deterministic result on every call.',
    where: 'ProofAegis',
  },
  {
    title: 'Delivery semantics and idempotency',
    body: 'At-least-once delivery is a promise about the broker, not about your consumer — so the consumer has to be safe to run twice. Consumer groups for horizontal scale, a dead-letter topic so a poison message parks instead of stalling the partition behind it.',
    where: 'Kafka pipelines · Citi',
  },
  {
    title: 'Rollback as part of the release',
    body: 'An upgrade strategy is only as good as its rollback, and the only way to know is to force the downgrade on purpose. Automated upgrade and downgrade for desktop clients, with crash reports and file logs written where the failure happened rather than where the developer is.',
    where: 'Electron platform · Infosys',
  },
  {
    title: 'Observability and cost as inputs, not afterthoughts',
    body: 'Instrumentation decided before the first deploy — AppDynamics on the services, Datadog and the Performance API on the clients. The same applies to money: a public endpoint that fans out into paid model calls is a design decision, so budget alerts go in before the deploy, not after the bill.',
    where: 'Citi · Google Cloud',
  },
]

export const algorithms: readonly Fundamental[] = [
  {
    title: 'Trees and traversal',
    body: 'Resolving a financial product to its node in a hierarchical taxonomy. The traversal is O(depth) rather than O(catalogue), and it lives in application code specifically so it can be unit-tested against a fixture tree instead of a live database.',
    where: 'Wealth Product Taxonomy',
  },
  {
    title: 'Graphs and provenance',
    body: 'An evidence graph assembled deterministically, then walked backwards so every figure on screen can be traced to the document and the page it came from. It is the thing used to verify everything else, so it has to be exactly reproducible.',
    where: 'ProofAegis',
  },
  {
    title: 'Hashing, sets and content identity',
    body: 'Finding a duplicate invoice when the duplicate arrives under a new number and a new date. Identity has to come from content — vendor, line items, amount — rather than from the key the document supplies, or the check finds nothing.',
    where: 'ProofAegis cross-case checks',
  },
  {
    title: 'Sliding windows over a history',
    body: 'A rate rising three percent a month is inside tolerance every single month. It is only a finding across the last six invoices from that vendor, which makes it a windowed comparison rather than a threshold.',
    where: 'Vendor price drift',
  },
  {
    title: 'Aggregation, grouping and ranking',
    body: 'Portfolio analytics: exception rates by vendor, value at risk, ageing against SLA and month-over-month trend. All of it computed in code and reproducible from the same inputs, because these are the numbers someone schedules a meeting about.',
    where: 'ProofAegis analytics',
  },
  {
    title: 'Partitioning and ordering',
    body: 'Ordering in a log is per-partition, never global — so the partition key is the real design decision, because it determines what "in order" is even allowed to mean for your data.',
    where: 'Kafka consumer groups',
  },
]

/**
 * Optional. If there is a profile worth linking — LeetCode, HackerRank,
 * Codeforces — fill this in and it renders as a single line under the lists.
 * Left undefined it renders nothing; a portfolio should not link to an empty
 * practice profile.
 */
export const practice: { label: string; handle: string; href: string } | undefined = undefined
