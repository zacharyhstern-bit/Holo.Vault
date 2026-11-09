import { useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import Pills from '../components/Pills'
import { PageHeader } from '../components/PageShell'
import { CATEGORIES, GRADED } from '../data/products'
import { EASE_OUT_EXPO } from '../lib/motion'

const CATS = [{ id: 'all', label: 'All' }, ...CATEGORIES.filter((c) => GRADED.some((g) => g.category === c.slug)).map((c) => ({ id: c.slug, label: c.name, dot: c.accent }))]
const GRADERS = ['All', ...Array.from(new Set(GRADED.map((g) => g.grader))).sort()]
const SORTS = [
  { id: 'high', label: 'Price ↓' },
  { id: 'low', label: 'Price ↑' },
  { id: 'grade', label: 'Grade' },
]

export default function GradedPage({ onAdd }) {
  const [cat, setCat] = useState('all')
  const [grader, setGrader] = useState('All')
  const [sort, setSort] = useState('high')

  const items = useMemo(() => {
    const list = GRADED.filter((g) => (cat === 'all' || g.category === cat) && (grader === 'All' || g.grader === grader))
    return [...list].sort((a, b) =>
      sort === 'high' ? b.price - a.price : sort === 'low' ? a.price - b.price : parseFloat(b.grade) - parseFloat(a.grade)
    )
  }, [cat, grader, sort])

  return (
    <>
      <PageHeader eyebrow="Slabbed & certified" title="Graded" outline="slabs">
        PSA, BGS, CGC and SGC slabs across every category. Each cert is checked against the grader's database before listing.
      </PageHeader>

      <section className="px-5 pb-32 md:px-10">
        <LayoutGroup>
          <div className="mb-14 flex flex-col gap-4">
            <Pills id="cat" items={CATS} value={cat} onChange={setCat} />
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <Pills id="grader" items={GRADERS} value={grader} onChange={setGrader} />
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
                  {items.length} {items.length === 1 ? 'slab' : 'slabs'}
                </span>
                <Pills id="sort" items={SORTS} value={sort} onChange={setSort} />
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.16em] text-ash">
              No slabs match — try another grader.
            </p>
          ) : (
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
                    <ProductCard p={p} onAdd={onAdd} showCategory />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </LayoutGroup>
      </section>
    </>
  )
}
