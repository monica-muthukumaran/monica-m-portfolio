export const profile = {
  name: 'Monica Muthukumaran',
  first: 'Monica',
  last: 'Muthukumaran',
  role: 'Software Engineer',
  location: 'Chennai, India',
  timezone: 'IST · UTC+5:30',

  // The hero positioning statement. The second half is set in the serif italic.
  positioning: ['Building systems that', 'think, scale and ship.'],

  // The concrete line under the statement — what that actually means in stacks.
  heroSub:
    'Backend and full-stack systems in Java, Spring Boot and Kafka, and AI products with a deterministic core. Five years, mostly in the unglamorous middle.',

  // Section 2 — the editorial statement, split for progressive reveal.
  // `em` marks the one clause set in the serif italic.
  statement: [
    { text: 'I build software at the' },
    { text: 'intersection of systems,', em: true },
    { text: 'products and AI.' },
  ],

  intro: [
    "Five years in, most of my work has been the unglamorous middle of a product — the classification service, the event stream, the desktop shell that has to update itself on ten thousand machines without anyone noticing.",
    "Right now that means Java and Spring Boot microservices in capital markets at Citi, moving wealth-product classifications over Kafka. Before that, five years of Angular and Electron at Infosys, where most of what I learned about performance came from applications that were already slow.",
    "On my own time I build AI products with a rule I do not bend: a number a human acts on never comes from a model. The model gets language and judgement. Arithmetic stays in code that can be read.",
  ],

  contact: {
    email: 'monicamuthukumaran7@gmail.com',
    github: 'https://github.com/monica-muthukumaran',
    githubHandle: 'monica-muthukumaran',
    linkedin: 'https://www.linkedin.com/in/monica-muthukumaran',
    linkedinHandle: 'monica-muthukumaran',
    resume: '/Monica_Muthukumaran_Resume.pdf',
  },

  closing: {
    kicker: 'Open to backend, platform and AI engineering work.',
    headline: ['Have a problem', 'worth building?'],
    sub: "If it involves a system that has to stay correct while something upstream is failing, I am probably interested.",
  },
} as const

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const
