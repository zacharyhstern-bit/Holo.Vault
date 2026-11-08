import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

// Placeholder inventory with original names and art — replace with your catalogue.
const PRODUCTS = [
  { id: 'ember', name: 'Emberwing', grade: 'PSA 10', price: 1240, set: 'HV-007', hue: ['#FF5A1F', '#FFC36B'], stock: 1 },
  { id: 'tide', name: 'Tidecaller', grade: 'CGC 9.5', price: 680, set: 'HV-031', hue: ['#1FB6FF', '#9BF0FF'], stock: 3 },
  { id: 'moss', name: 'Moss Warden', grade: 'Raw · NM', price: 142, set: 'HV-064', hue: ['#5DD39E', '#E4FF7A'], stock: 9 },
]

function TiltCard({ p, onAdd }) {
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
    onAdd()
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="drop-card group" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        data-cursor="Tilt"
        onPointerMove={move}
        onPointerLeave={leave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="relative aspect-[5/7] overflow-hidden rounded-[18px] border border-paper/10 bg-[#14110D]"
      >
        {/* art */}
        <div
          className="absolute inset-[7%] bottom-[38%] overflow-hidden rounded-xl"
          style={{ background: `radial-gradient(circle at 50% 60%, ${p.hue[1]}, ${p.hue[0]} 35%, #0B0A08 80%)` }}
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-[60%] rounded-full border border-ink/40"
              style={{ width: `${30 + i * 26}%`, aspectRatio: 1, transform: 'translate(-50%,-50%)' }}
            />
          ))}
        </div>
        {/* text */}
        <div className="absolute inset-x-[7%] bottom-[7%] font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
          <p className="font-display text-2xl font-extrabold normal-case tracking-[-0.02em] text-paper">{p.name}</p>
          <p className="mt-2 flex justify-between">
            <span>{p.set}</span>
            <span className="text-paper">{p.grade}</span>
          </p>
        </div>
        {/* foil + glare */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-color-dodge transition-opacity duration-500 ease-out-expo group-hover:opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(115deg, #ff5a1f, #ffd36b, #6bffb8, #6bc8ff, #c86bff, #ff5a1f)',
            backgroundSize: '300% 100%',
            backgroundPosition: foilShift,
          }}
        />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: glare }} />
      </motion.div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-[-0.03em]">${p.price.toLocaleString()}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
            {p.stock === 1 ? 'Last one' : `${p.stock} in vault`}
          </p>
        </div>
        <motion.button
          data-cursor=""
          onClick={add}
          whileTap={{ scale: 0.9 }}
          animate={{ backgroundColor: added ? '#F2ECDF' : 'rgba(242,236,223,0)', color: added ? '#0B0A08' : '#F2ECDF' }}
          whileHover={added ? {} : { backgroundColor: '#FF5A1F', color: '#0B0A08', borderColor: '#FF5A1F' }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="relative h-12 w-36 overflow-hidden rounded-full border border-paper/25 font-mono text-[12px] uppercase tracking-[0.14em]"
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

export default function Drops({ onAdd }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.drops-title-line', {
          yPercent: 100,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.drops-title', start: 'top 85%' },
        })
        gsap.from('.drop-card', {
          y: 120,
          opacity: 0,
          rotate: (i) => [-4, 0, 4][i] ?? 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.drops-grid', start: 'top 80%' },
        })
        // headline drifts slower than the page for depth
        gsap.to('.drops-title', {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="drops" ref={root} className="relative px-5 pb-32 pt-40 md:px-10">
      <div className="drops-title mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-[clamp(3rem,9vw,9rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em]">
          <span className="block overflow-hidden">
            <span className="drops-title-line block">This week</span>
          </span>
          <span className="block overflow-hidden">
            <span className="drops-title-line block text-outline">in the vault</span>
          </span>
        </h2>
        <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-ash">
          Every card is photographed, graded or condition-checked, and sealed in a tamper-evident sleeve before it ships.
        </p>
      </div>

      <div className="drops-grid grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <TiltCard key={p.id} p={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}
