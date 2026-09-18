export type Principle = {
  n: string
  title: string
  body: string
  /** The concrete case that earned the principle. Never invented. */
  evidence: string
}

export const principles: readonly Principle[] = [
  {
    n: '01',
    title: 'Understand the problem.',
    body:
      'Not the ticket. The problem. Most of the systems I have been handed were solving a question nobody had checked was the right one, and the cost of that compounds quietly for months.',
    evidence:
      'ProofAegis exists because the interesting question in accounts payable is not "what failed the match" but "what passed, and should not have".',
  },
  {
    n: '02',
    title: 'Model the system.',
    body:
      'Decide what the pieces are and what they are allowed to assume about each other before writing the first line. Two services that talk through a topic have a different failure surface than two services that talk directly, and that is a modelling decision, not an implementation detail.',
    evidence:
      'Classification and enrichment at Citi are separate deployables joined by Kafka, so back-pressure shows up as lag instead of errors.',
  },
  {
    n: '03',
    title: 'Build the smallest useful thing.',
    body:
      'Something that runs end to end and is honestly too small, then grow it under pressure from real cases. Prototypes are for answering questions cheaply — the answer is the deliverable, the code usually is not.',
    evidence:
      'The taxonomy engine was a Python and FastAPI prototype first. It answered the modelling questions, then it was thrown away.',
  },
  {
    n: '04',
    title: 'Measure.',
    body:
      'An opinion about performance is worth nothing next to a trace. Instrument first, and make the measurement visible to the people who have the problem rather than to whoever is tailing the logs.',
    evidence:
      'A Datadog and Performance API dashboard is what made a 31% improvement possible; before it, every explanation for the slowness was plausible.',
  },
  {
    n: '05',
    title: 'Distrust confident output.',
    body:
      'Including your own code. A system that answers without checking whether the question makes sense will fabricate with total confidence, and no model needs to be involved for that to happen.',
    evidence:
      'Plain arithmetic once reported a variance of 211,200 from an invoice and a purchase order that described entirely different goods. Every digit was computed correctly and every digit was wrong.',
  },
  {
    n: '06',
    title: 'Iterate.',
    body:
      'Ship, watch it meet reality, and change it. The version that survives contact with real data is never the version that was designed — and the gap between them is the only reliable source of architectural taste.',
    evidence:
      'The trust ledger started as a log line. It became a visible row per case once it was obvious that the most defensible property of the system was invisible.',
  },
]
