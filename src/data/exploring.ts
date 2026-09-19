/**
 * The two things that are not engineering.
 *
 * Each one is drawn rather than set in a glyph: a knight's move on a board
 * fragment, and a line that draws itself. An emoji would have been one
 * character of work and would have been the only piece of colour on the site.
 * `motif` picks the drawing in Exploring.tsx.
 */
export const offHours = {
  heading: 'When I’m not building',
  lede: 'Two things that are not engineering, and have both turned out to be about it anyway.',
  items: [
    {
      motif: 'chess' as const,
      label: 'Chess',
      note: ['A few moves ahead,', 'usually.'],
      aside: 'The only game where the mistake was made four moves before you noticed it.',
    },
    {
      motif: 'pencil' as const,
      label: 'Pencil art',
      note: ['Slowing down', 'to notice the details.'],
      aside: 'Drawing something is the fastest way to find out you were not really looking at it.',
    },
  ],
  closing: ['Different pace.', 'Same curiosity.'],
} as const

export type Exploration = {
  label: string
  note: string
  /** Relative visual weight in the field, 1–3. */
  w: 1 | 2 | 3
}

export const exploring: readonly Exploration[] = [
  {
    label: 'AI agents',
    note: 'Multi-agent pipelines where each agent has one job and a deterministic fallback.',
    w: 3,
  },
  {
    label: 'Distributed systems',
    note: 'Consistency, partial failure, and what "exactly once" actually costs.',
    w: 3,
  },
  {
    label: 'System design',
    note: 'Reading production architectures and arguing with them on paper.',
    w: 2,
  },
  {
    label: 'Kafka',
    note: 'Partitioning strategy, consumer-group rebalancing, dead-letter topology.',
    w: 3,
  },
  {
    label: 'Spring Boot',
    note: 'Reactive stacks, and the operational surface a service needs before anyone will run it.',
    w: 2,
  },
  {
    label: 'LLM applications',
    note: 'Constrained decoding, structured output, and keeping arithmetic out of the model.',
    w: 3,
  },
  {
    label: 'Cloud',
    note: 'Cloud Run, Firestore and BigQuery — and cost as a first-class design constraint.',
    w: 2,
  },
  {
    label: 'Edge inference',
    note: 'Quantised models on low-spec devices, where the RAM ceiling decides the architecture.',
    w: 1,
  },
  {
    label: 'Event sourcing',
    note: 'Append-only logs and CRDT merges instead of last-write-wins.',
    w: 1,
  },
]
