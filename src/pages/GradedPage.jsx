import { useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { PageHeader } from '../components/PageShell'
import { GRADED } from '../data/products'
import { EASE_OUT_EXPO } from '../lib/motion'

const FILTERS = ['All', 'PSA', 'CGC', 'BGS']
const SORTS = [
  { id: 'high', label: 'Price ↓' },
  { id: 'low', label: 'Price ↑' },
  { id: 'grade', label: 'Grade' },
]

function Pills({ items, value, onChange, id }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-paper/10 p-1">
      {items.map((it) => {
        const key = it.id ?? it
        const label = it.label ?? it
        const on = value === key
        return (
          <button
            key={key}
            data-cursor=""
            onClick={() => onChange(key)}
            className={`relative rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
              on ? 'text-ink' : 'text-paper/70 hover:text-paper'
            }`}
          >
            {on && (
              <motion.span
                layoutId={`pill-${id}`}
                className="absolute inset-0 -z-0 rounded-full bg-ember"
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function GradedPage({ onAdd }) {
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('high')

  const items = useMemo(() => {
    const list = GRADED.filter((g) => filter === 'All' || g.grader === filter)
    return [...list].sort((a, b) =>
      sort === 'high' ? b.price - a.price : sort === 'low' ? a.price - b.price : parseFloat(b.grade) - parseFloat(a.grade)
    )
  }, [filter, sort])

  return (
    <>
      <PageHeader eyebrow="Slabbed & certified" title="Graded" outline="slabs">
        Every slab is cert-verified against the grader's database before listing. Population reports on request.
      </PageHeader>

      <section className="px-5 pb-32 md:px-10">
        <LayoutGroup>
          <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <Pills id="filter" items={FILTERS} value={filter} onChange={setFilter} />
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
                {items.length} {items.length === 1 ? 'slab' : 'slabs'}
              </span>
              <Pills id="sort" items={SORTS} value={sort} onChange={setSort} />
            </div>
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
    </>
  )
}
