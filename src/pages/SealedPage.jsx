import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { PageHeader, RevealGrid, revealItem } from '../components/PageShell'
import { SEALED } from '../data/products'

const PROMISES = [
  ['01', 'Straight from distributors', 'No resealed or weighed boxes — ever. Every case traces back to an authorised distributor.'],
  ['02', 'Shrink-wrap inspected', 'We check the wrap pattern and seams under raking light before anything is listed.'],
  ['03', 'Packed like it matters', 'Boxes ship in double-walled cartons with corner protectors and full insurance.'],
]

export default function SealedPage({ onAdd }) {
  return (
    <>
      <PageHeader eyebrow="Factory fresh" title="Sealed" outline="product">
        Booster boxes, bundles and tins for the rip-it-yourself crowd — or for the shelf, untouched.
      </PageHeader>

      <section className="px-5 md:px-10">
        <RevealGrid className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {SEALED.map((p) => (
            <motion.div key={p.id} variants={revealItem}>
              <ProductCard p={p} onAdd={onAdd} />
            </motion.div>
          ))}
        </RevealGrid>
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
