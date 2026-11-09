import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CardFace from './CardFace'
import { CATEGORIES, itemsIn } from '../data/products'
import { EASE_OUT_EXPO, EASE_IN_OUT } from '../lib/motion'

/* Three mini cards that fan up out of the row on hover. */
function Fan({ cards }) {
  return (
    <div className="pointer-events-none absolute left-[64%] top-1/2 hidden h-0 w-0 md:block" aria-hidden>
      {cards.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute left-[-40px] top-[-55px] h-[110px] w-[79px] overflow-hidden rounded-[8px] border border-ink/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] lg:left-[-54px] lg:top-[-75px] lg:h-[150px] lg:w-[107px]"
          style={{ transformOrigin: '50% 140%' }}
          variants={{
            rest: { opacity: 0, y: 60, rotate: 0, scale: 0.7 },
            hover: { opacity: 1, y: 0, rotate: (i - 1) * 12, scale: 1, x: (i - 1) * 42 },
          }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: i * 0.04 }}
        >
          <CardFace p={p} />
        </motion.div>
      ))}
    </div>
  )
}

function Row({ c, i }) {
  const items = itemsIn(c.slug)
  const fan = items.filter((x) => x.kind !== 'box').slice(0, 3)
  return (
    <motion.li
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: i * 0.06 }}
      className="border-b border-paper/10"
    >
      <Link to={`/shop/${c.slug}`} data-cursor="Shop" className="block">
        <motion.div initial="rest" whileHover="hover" animate="rest" className="relative overflow-hidden">
          {/* colour flood */}
          <motion.span
            aria-hidden
            className="absolute inset-0 origin-bottom"
            style={{ background: c.accent }}
            variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
            transition={{ duration: 0.55, ease: EASE_IN_OUT }}
          />
          <div className="relative flex items-center gap-6 px-5 py-7 md:px-10 md:py-9">
            <motion.span
              className="w-10 font-mono text-xs"
              variants={{ rest: { color: '#8A8478' }, hover: { color: '#0B0A08' } }}
              transition={{ duration: 0.5 }}
            >
              0{i + 1}
            </motion.span>
            <motion.span
              className="flex-1 font-display text-[clamp(2.6rem,8.5vw,8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]"
              variants={{ rest: { x: 0, color: '#F2ECDF' }, hover: { x: 24, color: '#0B0A08' } }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              {c.name}
            </motion.span>
            <motion.span
              className="hidden max-w-[16rem] text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] sm:block"
              variants={{ rest: { color: '#8A8478' }, hover: { color: '#0B0A08' } }}
              transition={{ duration: 0.5 }}
            >
              {items.length} items
              <br />
              {c.blurb}
            </motion.span>
            <motion.span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border"
              variants={{
                rest: { rotate: 0, borderColor: 'rgba(242,236,223,0.25)', color: '#F2ECDF', backgroundColor: 'rgba(11,10,8,0)' },
                hover: { rotate: -45, borderColor: '#0B0A08', color: c.accent, backgroundColor: '#0B0A08' },
              }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </motion.span>
          </div>
          <Fan cards={fan} />
        </motion.div>
      </Link>
    </motion.li>
  )
}

export default function Categories() {
  return (
    <section className="pt-32">
      <div className="mb-12 flex flex-col justify-between gap-4 px-5 md:flex-row md:items-end md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-ember">Shop by category</p>
        <Link
          to="/shop"
          data-cursor=""
          className="font-mono text-xs uppercase tracking-[0.16em] text-ash underline-offset-4 transition-colors duration-300 hover:text-paper hover:underline"
        >
          Browse everything →
        </Link>
      </div>
      <ul className="border-t border-paper/10">
        {CATEGORIES.map((c, i) => (
          <Row key={c.slug} c={c} i={i} />
        ))}
      </ul>
    </section>
  )
}
