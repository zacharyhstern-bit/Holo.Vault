import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion'
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion'
import CardFace from './CardFace'
import { categoryBySlug } from '../data/products'

/* ── Art for each product kind ───────────────────────────────────── */
function CardArt({ p }) {
  return (
    <div className="relative aspect-[5/7] overflow-hidden rounded-[18px] border border-paper/10">
      <CardFace p={p} />
    </div>
  )
}

function SlabArt({ p }) {
  return (
    <div className="relative aspect-[5/8] overflow-hidden rounded-[14px] border-2 border-paper/20 bg-paper/[0.04] p-[6%] shadow-[inset_0_0_40px_rgba(242,236,223,0.06)]">
      {/* grading label */}
      <div className="mb-[6%] flex items-center justify-between rounded-md bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
        <div className="min-w-0">
          <p className="font-medium">{p.grader}</p>
          <p className="truncate opacity-60">
            {p.name} · {p.set}
          </p>
        </div>
        <p className="font-display text-3xl font-extrabold tracking-[-0.04em]">{p.grade}</p>
      </div>
      {/* card inside the case */}
      <div className="relative mx-auto aspect-[5/7] h-[calc(100%-4.2rem)] overflow-hidden rounded-lg border border-paper/10">
        <CardFace p={p} />
      </div>
    </div>
  )
}

function BoxArt({ p }) {
  const cat = categoryBySlug(p.category)
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-paper/10 bg-[#14110D]">
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${p.hue[0]} 0%, #0B0A08 70%)` }} />
      <div className="absolute -right-[20%] top-[18%] aspect-square w-[85%] opacity-80">
        <Rings tone="rgba(242,236,223,0.35)" />
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-between bg-ink/80 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper backdrop-blur">
        <span>{cat?.name ?? 'Holo/Vault'}</span>
        <span style={{ color: p.hue[1] }}>Factory sealed</span>
      </div>
      <div className="absolute inset-x-5 bottom-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70">{p.label}</p>
        <p className="mt-1 font-display text-3xl font-extrabold leading-[0.95] tracking-[-0.03em]">{p.name}</p>
      </div>
    </div>
  )
}

function Rings({ tone = 'rgba(11,10,8,0.4)' }) {
  return [...Array(6)].map((_, i) => (
    <span
      key={i}
      className="absolute left-1/2 top-[60%] rounded-full border"
      style={{ borderColor: tone, width: `${30 + i * 26}%`, aspectRatio: 1, transform: 'translate(-50%,-50%)' }}
    />
  ))
}

const ART = { card: CardArt, slab: SlabArt, box: BoxArt }

/* ── Tilting product tile with foil, glare and add-to-bag ─────────── */
export default function ProductCard({ p, onAdd, className = '', showCategory = false }) {
  const ref = useRef(null)
  const [added, setAdded] = useState(false)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, SPRING_SOFT)
  const sy = useSpring(my, SPRING_SOFT)
  const rotateY = useTransform(sx, [0, 1], [-14, 14])
  const rotateX = useTransform(sy, [0, 1], [12, -12])
  const gx = useTransform(sx, (v) => `${v * 100}%`)
  const gy = useTransform(sy, (v) => `${v * 100}%`)
  const foilShift = useTransform(sx, (v) => `${v * 200}% 50%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.45), transparent 45%)`
  const Art = ART[p.kind] ?? CardArt

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const leave = () => {
    mx.set(0.5)
    my.set(0.5)
  }
  const add = () => {
    if (added) return
    setAdded(true)
    onAdd?.(p)
    setTimeout(() => setAdded(false), 1800)
  }

  const stockLine =
    p.stock == null ? (p.grader ? `${p.grader} certified` : '') : p.stock === 1 ? 'Last one' : `${p.stock} in vault`

  return (
    <article className={`group ${className}`} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        data-cursor="Tilt"
        onPointerMove={move}
        onPointerLeave={leave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="relative"
      >
        <Art p={p} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] opacity-25 mix-blend-color-dodge transition-opacity duration-500 ease-out-expo group-hover:opacity-70"
          style={{
            backgroundImage: 'linear-gradient(115deg, #ff5a1f, #ffd36b, #6bffb8, #6bc8ff, #c86bff, #ff5a1f)',
            backgroundSize: '300% 100%',
            backgroundPosition: foilShift,
          }}
        />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[18px] mix-blend-overlay" style={{ background: glare }} />
      </motion.div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-[-0.03em]">${p.price.toLocaleString()}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
            {showCategory && categoryBySlug(p.category) ? `${categoryBySlug(p.category).name} · ` : ''}
            {stockLine}
          </p>
        </div>
        <motion.button
          data-cursor=""
          onClick={add}
          whileTap={{ scale: 0.9 }}
          animate={{ backgroundColor: added ? '#F2ECDF' : 'rgba(242,236,223,0)', color: added ? '#0B0A08' : '#F2ECDF' }}
          whileHover={added ? {} : { backgroundColor: '#FF5A1F', color: '#0B0A08', borderColor: '#FF5A1F' }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="relative h-12 w-36 shrink-0 overflow-hidden rounded-full border border-paper/25 font-mono text-[12px] uppercase tracking-[0.14em]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'y' : 'n'}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="block"
            >
              {added ? 'Added ✓' : 'Add to bag'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </article>
  )
}
