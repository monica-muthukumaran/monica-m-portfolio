/**
 * Fundamentals, as a short list of names.
 *
 * This used to be twelve cards, each naming a decision, the trade-off it
 * bought and the system it was made in. All of it was true and none of it
 * belonged on a homepage that already has four projects behind it — it was the
 * longest block on the site and the least load-bearing. The evidence lives in
 * the project pages now, where the system is in front of you.
 *
 * Nothing goes in these lists that a project page cannot demonstrate.
 */

export const fundamentals = {
  groups: [
    {
      label: 'System design',
      items: [
        'Service decomposition',
        'Asynchronous boundaries',
        'Idempotency & delivery semantics',
        'Event-driven architecture',
        'Caching strategy',
        'Observability & cost',
      ],
    },
    {
      label: 'Data structures & algorithms',
      items: [
        'Trees & traversal',
        'Graphs & provenance',
        'Hashing & content identity',
        'Sliding windows',
        'Aggregation & ranking',
        'Partitioning & ordering',
      ],
    },
  ],
} as const

/**
 * Optional. If there is a profile worth linking — LeetCode, HackerRank,
 * Codeforces — fill this in and it renders as a single line under the strip.
 * Left undefined it renders nothing; a portfolio should not link to an empty
 * practice profile.
 */
export const practice: { label: string; handle: string; href: string } | undefined = undefined
