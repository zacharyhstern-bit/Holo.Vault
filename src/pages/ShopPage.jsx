import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import Pills from '../components/Pills'
import { PageHeader } from '../components/PageShell'
import { CATEGORIES, categoryBySlug, itemsIn } from '../data/products'
import { EASE_OUT_EXPO } from '../lib/motion'
import NotFound from './NotFound'

const KINDS = [
  { id: 'all', label: 'Everything' },
  { id: 'card', label: 'Singles' },
  { id: 'slab', label: 'Graded' },
  { id: 'box', label: 'Sealed' },
]
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'high', label: 'Price ↓' },
  { id: 'low', label: 'Price ↑' },
]

/* Row of links to every category; the current one is highlighted. */
function CategoryStrip({ current }) {
  return (
    <nav className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" aria-label="Categories">
      {[{ slug: '', name: 'All cards', accent: '#F2ECDF' }, ...CATEGORIES].map((c) => {
        const on = (current ?? '') === c.slug
        return (
          <Link
            key={c.slug || 'all'}
            to={c.slug ? `/shop/${c.slug}` : '/shop'}
            data-cursor=""
            className={`group relative flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-500 ease-out-expo ${
              on ? 'border-transparent text-ink' : 'border-paper/15 text-paper/75 hover:text-paper'
            }`}
            style={on ? { background: c.accent } : undefined}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: on ? '#0B0A08' : c.accent }} />
            {c.name}
            <span className={on ? 'opacity-60' : 'text-ash'}>{itemsIn(c.slug || undefined).length}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function ShopPage({ onAdd }) {
  const { category } = useParams()
  const cat = category ? categoryBySlug(category) : null
  const [kind, setKind] = useState('all')
  const [sort, setSort] = useState('featured')

  const items = useMemo(() => {
    const list = itemsIn(cat?.slug).filter((i) => kind === 'all' || i.kind === kind)
    if (sort === 'high') return [...list].sort((a, b) => b.price - a.price)
    if (sort === 'low') return [...list].sort((a, b) => a.price - b.price)
    return list
  }, [cat, kind, sort])

  if (category && !cat) return <NotFound />

  const accent = cat?.accent ?? '#FF5A1F'

  return (
    <>
      {/* category-coloured glow behind the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[70vh] opacity-40"
        style={{ background: `radial-gradient(60% 60% at 20% 20%, ${accent}55, transparent 70%)` }}
      />

      <div className="relative">
        <PageHeader
          key={cat?.slug ?? 'all'}
          eyebrow={cat ? `Shop · ${cat.full}` : 'Shop · Every category'}
          title={cat ? cat.name : 'All'}
          outline={cat ? cat.outline : 'cards'}
          accent={accent}
        >
          {cat ? cat.blurb : 'Pokémon, baseball, basketball, hockey and Magic — singles, graded slabs and sealed boxes.'}
        </PageHeader>
      </div>

      <section className="relative px-5 pb-32 md:px-10">
        <CategoryStrip current={cat?.slug} />

        <LayoutGroup>
          <div className="mb-14 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <Pills id="kind" items={KINDS} value={kind} onChange={setKind} accent={accent} />
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
              <Pills id="sort" items={SORTS} value={sort} onChange={setSort} accent={accent} />
            </div>
          </div>

          {items.length === 0 ? (
            <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.16em] text-ash">
              Nothing here right now — check back after the next drop.
            </p>
          ) : (
            <motion.div layout className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {items.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: Math.min(i, 8) * 0.04 } }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                  >
                    <ProductCard p={p} onAdd={onAdd} showCategory={!cat} />
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
