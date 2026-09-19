import { EnvironmentProvider, useEnvironment } from './hooks/useEnvironment'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useGroundTracker } from './hooks/useGroundTracker'
import { useRoute } from './lib/router'
import { Nav } from './components/chrome/Nav'
import { Cursor } from './components/chrome/Cursor'
import { Grain } from './components/chrome/Grain'
import { Hero } from './components/sections/Hero'
import { Statement } from './components/sections/Statement'
import { WorkIndex } from './components/sections/WorkIndex'
import { Engineering } from './components/sections/Engineering'
import { Thinking } from './components/sections/Thinking'
import { Experience } from './components/sections/Experience'
import { Exploring } from './components/sections/Exploring'
import { Contact } from './components/sections/Contact'
import { ProjectPage } from './components/pages/ProjectPage'

/**
 * The homepage. Everything here is short enough to scroll past — the four
 * projects are an index rather than four pinned scenes, and each one opens on
 * its own route.
 */
function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <WorkIndex />
      <Engineering />
      <Thinking />
      <Experience />
      <Exploring />
      <Contact />
    </>
  )
}

function Page() {
  const { cinematic, fine } = useEnvironment()
  const route = useRoute()

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
      {/* A project page carries its own slim bar with one way back. The site
          nav would offer six destinations that all live somewhere else. */}
      {route.name === 'home' && <Nav />}

      <main id="main">{route.name === 'project' ? <ProjectPage id={route.id} /> : <Home />}</main>
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
