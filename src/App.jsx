import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CursorProvider } from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Drops from './components/Drops'

export default function App() {
  const [bag, setBag] = useState(0)

  // Web fonts change line heights; re-measure scroll positions once they land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const enterVault = () =>
    document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <CursorProvider>
      <Nav bag={bag} />
      <main>
        <Hero onEnter={enterVault} />
        <Marquee />
        <Drops onAdd={() => setBag((b) => b + 1)} />
      </main>
      <footer className="flex flex-col justify-between gap-4 border-t border-paper/10 px-5 py-10 font-mono text-[11px] uppercase tracking-[0.16em] text-ash md:flex-row md:px-10">
        <p>© 2026 Holo/Vault — independent reseller</p>
        <p>Not affiliated with Nintendo, Creatures Inc. or The Pokémon Company.</p>
      </footer>
    </CursorProvider>
  )
}
