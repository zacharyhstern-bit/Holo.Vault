import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { PageHeader, RevealGrid, revealItem } from '../components/PageShell'
import { useCountdown } from '../lib/useCountdown'
import { DROP, DROP_ITEMS, UPCOMING } from '../data/products'
import { EASE_OUT_EXPO } from '../lib/motion'

function UpcomingRow({ d }) {
  const [notify, setNotify] = useState(false)
  return (
    <motion.li
      variants={revealItem}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group relative border-b border-paper/10"
    >
      <motion.div initial="rest" whileHover="hover" animate="rest" className="relative flex flex-col gap-4 py-8 md:flex-row md:items-center">
        {/* hover wash */}
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 origin-left bg-paper/[0.04]"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        />
        <span className="w-24 font-mono text-xs uppercase tracking-[0.16em] text-ash">No. {d.no}</span>
        <motion.span
          className="flex-1 font-display text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase leading-none tracking-[-0.03em]"
          variants={{ rest: { x: 0 }, hover: { x: 16 } }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          {d.name}
        </motion.span>
        <span className="w-40 font-mono text-xs uppercase tracking-[0.16em] text-ash">
          {d.date} · {d.items} items
        </span>
        <motion.button
          data-cursor=""
          onClick={() => setNotify((n) => !n)}
          whileTap={{ scale: 0.92 }}
          animate={{
            backgroundColor: notify ? '#FF5A1F' : 'rgba(255,90,31,0)',
            color: notify ? '#0B0A08' : '#F2ECDF',
            borderColor: notify ? '#FF5A1F' : 'rgba(242,236,223,0.25)',
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="h-11 w-44 overflow-hidden rounded-full border font-mono text-[11px] uppercase tracking-[0.14em]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(notify)}
              className="block"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {notify ? "We'll ping you ✓" : 'Notify me'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.li>
  )
}

export default function DropsPage({ onAdd }) {
  const countdown = useCountdown(DROP.opensInSeconds)

  return (
    <>
      <PageHeader eyebrow={`Drop ${DROP.number} — ${DROP.name}`} title="The" outline="drop">
        A fresh batch every Sunday. Small runs, first come, first served — when a card's gone, it's gone.
      </PageHeader>

      {/* countdown band */}
      <section className="mx-5 mb-24 flex flex-col items-start justify-between gap-6 rounded-3xl border border-paper/10 bg-paper/[0.03] p-8 md:mx-10 md:flex-row md:items-center md:p-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">Next restock opens in</p>
          <p className="mt-3 font-display text-[clamp(3rem,9vw,8rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ember">
            {countdown}
          </p>
        </div>
        <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-ash">
          Items below are reserved for early access. Add them to your bag now — checkout unlocks when the timer hits zero.
        </p>
      </section>

      <section className="px-5 md:px-10">
        <RevealGrid className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {DROP_ITEMS.map((p) => (
            <motion.div key={p.id} variants={revealItem}>
              <ProductCard p={p} onAdd={onAdd} showCategory />
            </motion.div>
          ))}
        </RevealGrid>
      </section>

      <section className="px-5 pb-32 pt-40 md:px-10">
        <h2 className="mb-10 font-mono text-xs uppercase tracking-[0.24em] text-ember">Coming up</h2>
        <ul className="border-t border-paper/10">
          {UPCOMING.map((d) => (
            <UpcomingRow key={d.no} d={d} />
          ))}
        </ul>
      </section>
    </>
  )
}
