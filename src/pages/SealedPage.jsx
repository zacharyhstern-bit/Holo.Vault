import { useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import Pills from '../components/Pills'
import { PageHeader, RevealGrid, revealItem } from '../components/PageShell'
import { CATEGORIES, SEALED } from '../data/products'
import { EASE_OUT_EXPO } from '../lib/motion'

const CATS = [{ id: 'all', label: 'All' }, ...CATEGORIES.filter((c) => SEALED.some((s) => s.category === c.slug)).map((c) => ({ id: c.slug, label: c.name, dot: c.accent }))]

const PROMISES = [
  ['01', 'Straight from distributors', 'No resealed or weighed boxes — ever. Every case traces back to an authorised distributor.'],
  ['02', 'Shrink-wrap inspected', 'We check the wrap pattern and seams under raking light before anything is listed.'],
  ['03', 'Packed like it matters', 'Boxes ship in double-walled cartons with corner protectors and full insurance.'],
]

export default function SealedPage({ onAdd }) {
  const [cat, setCat] = useState('all')
  const items = useMemo(() => SEALED.filter((s) => cat === 'all' || s.category === cat), [cat])

  return (
    <>
      <PageHeader eyebrow="Factory fresh" title="Sealed" outline="product">
        Hobby boxes, blasters, booster boxes and Commander decks — for the rip-it-yourself crowd, or for the shelf, untouched.
      </PageHeader>

      <section className="px-5 md:px-10">
        <LayoutGroup>
          <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <Pills id="sealed-cat" items={CATS} value={cat} onChange={setCat} />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
              {items.length} {items.length === 1 ? 'product' : 'products'}
            </span>
          </div>
          <motion.div layout className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {items.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                >
                  <ProductCard p={p} onAdd={onAdd} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </section>

      <section className="px-5 pb-32 pt-40 md:px-10">
        <RevealGrid className="grid gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 md:grid-cols-3">
          {PROMISES.map(([n, title, body]) => (
            <motion.div
              key={n}
              variants={revealItem}
              whileHover={{ backgroundColor: 'rgba(255,90,31,0.08)' }}
              className="bg-ink p-10"
            >
              <p className="font-mono text-xs text-ember">{n}</p>
              <h3 className="mt-10 font-display text-3xl font-extrabold leading-none tracking-[-0.03em]">{title}</h3>
              <p className="mt-4 font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-ash">{body}</p>
            </motion.div>
          ))}
        </RevealGrid>
      </section>
    </>
  )
}
