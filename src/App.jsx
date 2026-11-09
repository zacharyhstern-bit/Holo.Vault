import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CursorProvider } from './components/Cursor'
import Nav from './components/Nav'
import BagDrawer from './components/BagDrawer'
import { BagProvider, useBag } from './lib/bag'
import Footer from './components/Footer'
import { PageTransition } from './components/PageShell'
import Home from './pages/Home'
import DropsPage from './pages/DropsPage'
import GradedPage from './pages/GradedPage'
import SealedPage from './pages/SealedPage'
import SellPage from './pages/SellPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BagProvider>
      <Site />
    </BagProvider>
  )
}

function Site() {
  const location = useLocation()
  const { add } = useBag()

  // Web fonts change line heights; re-measure scroll positions once they land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const page = (el) => (
    <PageTransition>
      <main>{el}</main>
      <Footer />
    </PageTransition>
  )

  return (
    <CursorProvider>
      <Nav />
      <BagDrawer />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          window.scrollTo(0, 0)
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={page(<Home onAdd={add} />)} />
          <Route path="/drops" element={page(<DropsPage onAdd={add} />)} />
          <Route path="/graded" element={page(<GradedPage onAdd={add} />)} />
          <Route path="/sealed" element={page(<SealedPage onAdd={add} />)} />
          <Route path="/sell" element={page(<SellPage />)} />
          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </AnimatePresence>
    </CursorProvider>
  )
}
