import { EnvironmentProvider, useEnvironment } from './hooks/useEnvironment'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useGroundTracker } from './hooks/useGroundTracker'
import { Nav } from './components/chrome/Nav'
import { Cursor } from './components/chrome/Cursor'
import { Grain } from './components/chrome/Grain'
import { Hero } from './components/sections/Hero'
import { Statement } from './components/sections/Statement'
import { Work } from './components/sections/Work'
import { Engineering } from './components/sections/Engineering'
import { Thinking } from './components/sections/Thinking'
import { Experience } from './components/sections/Experience'
import { Exploring } from './components/sections/Exploring'
import { Contact } from './components/sections/Contact'

function Page() {
  const { cinematic, fine } = useEnvironment()

  // Smooth scroll is a desktop, full-motion affordance only.
  useSmoothScroll(cinematic && fine)

  // Lets the fixed chrome invert over the bone sections.
  useGroundTracker()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Cursor />
      <Grain />
      <Nav />

      <main id="main">
        <Hero />
        <Statement />
        <Work />
        <Engineering />
        <Thinking />
        <Experience />
        <Exploring />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <EnvironmentProvider>
      <Page />
    </EnvironmentProvider>
  )
}
