import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'
import { SHUFFLE_DECK, categoryBySlug } from '../data/products'
import CardFace from './CardFace'
import { EASE_OUT_EXPO, SPRING_SOFT, prefersReducedMotion } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

// The deck: a mix from every category. Edit SHUFFLE_DECK in products.js to change it.
const DECK = SHUFFLE_DECK.map((p) => ({
  ...p,
  label: p.grader ? `${p.grader} ${p.grade}` : p.grade,
}))

const STACK_GAP = 1.6 // px between cards in the pile

/* ── One physical card: back face by default, flips to the front ─── */
function DeckCard({ p, cardRef, innerRef }) {
  const face = 'absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]'
  const hide = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
  return (
    <div ref={cardRef} className="absolute inset-0 m-auto h-[var(--ch)] w-[var(--cw)] will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
      <div ref={innerRef} className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* back */}
        <div className={`${face} border border-ember/40 bg-[#0F0D0A]`} style={hide}>
          <div
            className="absolute inset-[6%] rounded-[10px]"
            style={{
              background:
                'repeating-radial-gradient(circle at 50% 50%, rgba(255,90,31,0.55) 0 2px, transparent 2px 11px), radial-gradient(circle, rgba(255,90,31,0.35), transparent 70%)',
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-ink px-3 py-1.5 font-display text-sm font-extrabold tracking-[-0.02em] text-paper">
              H<span className="text-ember">/</span>V
            </span>
          </div>
        </div>
        {/* front */}
        <div className={`${face} border border-paper/15`} style={{ ...hide, transform: 'rotateY(180deg)' }}>
          <CardFace p={p} />
        </div>
      </div>
    </div>
  )
}

export default function ShuffleDeck({ onAdd }) {
  const root = useRef(null)
  const cards = useRef([]) // outer card elements, by deck index
  const inners = useRef([]) // flipping inner elements, by deck index
  const order = useRef(DECK.map((_, i) => i)) // bottom → top
  const tl = useRef(null)
  const mode = useRef('loop') // 'loop' | 'draw'
  const visible = useRef(false)
  const alive = useRef(true)
  const api = useRef({})
  const entrance = useRef(null)
  const [drawn, setDrawn] = useState(null)
  const [added, setAdded] = useState(false)

  const jitter = useMemo(() => DECK.map(() => gsap.utils.random(-3, 3)), [])

  // gentle pointer tilt on the whole table
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-1, 1], [-10, 10]), SPRING_SOFT)
  const rotX = useSpring(useTransform(my, [-1, 1], [8, -8]), SPRING_SOFT)

  useLayoutEffect(() => {
    alive.current = true
    const el = (i) => cards.current[i]
    const W = () => cards.current[0]?.offsetWidth || 200
    const H = () => cards.current[0]?.offsetHeight || 280

    // ── building blocks (each returns its own timeline and updates the order) ──
    const toStack = (dur = 0.5) => {
      const t = gsap.timeline()
      order.current.forEach((ci, d) => {
        t.set(el(ci), { zIndex: d }, 0)
        t.to(el(ci), { x: 0, y: -d * STACK_GAP, rotation: jitter[ci], scale: 1, duration: dur, ease: 'power3.inOut' }, 0)
      })
      return t
    }

    const riffle = () => {
      const t = gsap.timeline()
      const o = order.current
      const half = Math.ceil(o.length / 2)
      const L = o.slice(0, half)
      const R = o.slice(half)
      // split into two halves
      L.forEach((ci, k) => t.to(el(ci), { x: () => -W() * 0.62, y: -k * STACK_GAP, rotation: -9, duration: 0.55, ease: 'power3.inOut' }, 0))
      R.forEach((ci, k) => t.to(el(ci), { x: () => W() * 0.62, y: -k * STACK_GAP, rotation: 9, duration: 0.55, ease: 'power3.inOut' }, 0))
      // bend the corners up, like thumbs riffling
      t.to([...L, ...R].map(el), { rotationX: 18, duration: 0.25, ease: 'power2.out' }, 0.5)
      // interleave in clumps of 1–2 cards
      const next = []
      let a = 0
      let b = 0
      while (a < L.length || b < R.length) {
        const fromL = b >= R.length || (a < L.length && Math.random() < 0.5)
        const n = Math.random() < 0.3 ? 2 : 1
        for (let k = 0; k < n; k++) {
          if (fromL && a < L.length) next.push(L[a++])
          else if (!fromL && b < R.length) next.push(R[b++])
        }
      }
      next.forEach((ci, d) => {
        t.set(el(ci), { zIndex: d }, 0.72)
        t.to(el(ci), { x: 0, y: -d * STACK_GAP, rotation: jitter[ci], rotationX: 0, duration: 0.36, ease: 'power2.out' }, 0.75 + d * 0.05)
      })
      order.current = next
      return t
    }

    const cut = () => {
      const t = gsap.timeline()
      const o = order.current
      const k = Math.max(2, Math.round(o.length * gsap.utils.random(0.3, 0.5)))
      const top = o.slice(-k)
      const rest = o.slice(0, -k)
      // lift the top packet up and out
      top.forEach((ci, j) =>
        t.to(el(ci), { x: () => W() * 0.75, y: () => -H() * 0.18 - j * STACK_GAP, rotation: 7, duration: 0.5, ease: 'power3.inOut' }, 0)
      )
      // the rest drops to the table
      rest.forEach((ci, d) => t.to(el(ci), { y: -d * STACK_GAP, duration: 0.5, ease: 'power3.inOut' }, 0.1))
      // slide the packet underneath
      const next = [...top, ...rest]
      next.forEach((ci, d) => t.set(el(ci), { zIndex: d }, 0.55))
      next.forEach((ci, d) =>
        t.to(el(ci), { x: 0, y: -d * STACK_GAP, rotation: jitter[ci], duration: 0.55, ease: 'power3.inOut' }, 0.6)
      )
      order.current = next
      return t
    }

    const fan = () => {
      const t = gsap.timeline()
      const n = order.current.length
      order.current.forEach((ci, d) => {
        const a = gsap.utils.mapRange(0, n - 1, -38, 38, d)
        t.to(el(ci), { rotation: a, x: a * 1.6, y: Math.abs(a) * 0.9, duration: 0.8, ease: 'expo.out' }, d * 0.03)
      })
      t.to({}, { duration: 1.4 }) // hold the fan
      t.add(toStack(0.6))
      return t
    }

    // ── the endless loop ────────────────────────────────────────
    const cycle = () => {
      if (!alive.current || mode.current !== 'loop') return
      const t = gsap.timeline({ onComplete: cycle })
      t.add(riffle()).add(riffle(), '+=0.3').add(cut(), '+=0.3').add(fan(), '+=0.35').to({}, { duration: 0.9 })
      tl.current = t
      if (!visible.current) t.pause()
    }

    // ── draw the top card and flip it face-up ───────────────────
    const draw = () => {
      if (mode.current === 'draw') return
      mode.current = 'draw'
      entrance.current?.progress(1) // finish the drop-in if someone is quick
      tl.current?.kill()
      const top = order.current[order.current.length - 1]
      const t = gsap.timeline()
      t.add(toStack(0.4))
      t.set(el(top), { zIndex: 100 })
      t.to(el(top), { x: () => W() * 0.55, y: () => -H() * 0.08, rotation: 5, scale: 1.12, duration: 0.7, ease: 'expo.out' })
      t.to(inners.current[top], { rotationY: 180, duration: 0.9, ease: 'expo.out' }, '<0.1')
      t.call(() => setDrawn(top), null, '<0.3')
      tl.current = t
    }

    const putBack = (thenShuffle = true) => {
      if (mode.current !== 'draw') return
      const top = order.current[order.current.length - 1]
      setDrawn(null)
      const t = gsap.timeline({
        onComplete: () => {
          mode.current = 'loop'
          if (thenShuffle && !prefersReducedMotion()) cycle()
        },
      })
      t.to(inners.current[top], { rotationY: 0, duration: 0.6, ease: 'power3.inOut' })
      // tuck it at the bottom of the deck
      order.current = [top, ...order.current.slice(0, -1)]
      t.add(toStack(0.6), '<0.2')
      tl.current = t
    }

    const shuffleNow = () => {
      if (mode.current === 'draw') return putBack(true)
      entrance.current?.progress(1)
      tl.current?.kill()
      cycle()
    }

    api.current = { draw, putBack, shuffleNow }

    const ctx = gsap.context(() => {
      gsap.set(cards.current, { transformOrigin: '50% 120%' })
      order.current.forEach((ci, d) => gsap.set(el(ci), { zIndex: d, y: -d * STACK_GAP, rotation: jitter[ci] }))

      // only animate while the section is on screen
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          visible.current = self.isActive
          if (mode.current === 'loop') self.isActive ? tl.current?.play() : tl.current?.pause()
        },
      })

      // section entrance: deck drops onto the table
      entrance.current = gsap.from(cards.current, {
        y: -260,
        opacity: 0,
        rotation: () => gsap.utils.random(-25, 25),
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
        onComplete: () => !prefersReducedMotion() && cycle(),
      })
    }, root)

    return () => {
      alive.current = false
      tl.current?.kill()
      ctx.revert()
    }
  }, [jitter])

  const card = drawn !== null ? DECK[drawn] : null

  const addDrawn = () => {
    if (added) return
    setAdded(true)
    onAdd?.(card)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section ref={root} className="relative overflow-hidden px-5 py-32 md:px-10">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr]">
        {/* copy + controls */}
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-ember">The daily shuffle</p>
          <h2 className="mt-6 font-display text-[clamp(3rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.045em]">
            Shuffle.
            <br />
            <span className="text-outline">Cut.</span>
            <br />
            Pull.
          </h2>
          <p className="mt-8 max-w-sm font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-ash">
            Pokémon, sports and Magic — every card in this deck is real stock from the vault. Draw one; if it's your grail, it's yours.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton onClick={() => (drawn !== null ? api.current.putBack(true) : api.current.draw())}>
              {drawn !== null ? 'Put it back' : 'Draw a card'}
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => api.current.shuffleNow()}>
              Shuffle
            </MagneticButton>
          </div>

          {/* drawn card details */}
          <div className="mt-10 min-h-[120px]">
            <AnimatePresence mode="wait">
              {card && (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="flex items-center justify-between gap-6 rounded-2xl border border-paper/10 bg-paper/[0.03] p-6"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
                      You drew · {categoryBySlug(card.category)?.name}
                    </p>
                    <p className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em]">{card.name}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: card.hue[0] }}>
                      {card.label} · ${card.price.toLocaleString()}
                    </p>
                  </div>
                  <motion.button
                    data-cursor=""
                    onClick={addDrawn}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.04 }}
                    animate={{ backgroundColor: added ? '#F2ECDF' : '#FF5A1F' }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="h-12 shrink-0 rounded-full px-6 font-mono text-[12px] uppercase tracking-[0.14em] text-ink"
                  >
                    {added ? 'Added ✓' : 'Add to bag'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* the table */}
        <div
          className="relative h-[clamp(420px,52vw,600px)]"
          style={{ perspective: 1400 }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
            my.set(((e.clientY - r.top) / r.height) * 2 - 1)
          }}
          onPointerLeave={() => {
            mx.set(0)
            my.set(0)
          }}
          data-cursor={drawn !== null ? '' : 'Draw'}
          onClick={() => drawn === null && api.current.draw?.()}
        >
          {/* felt glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[58%] h-[45%] w-[80%] -translate-x-1/2 rounded-[50%] blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,90,31,0.28), transparent)' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX: rotX,
              rotateY: rotY,
              '--cw': 'clamp(140px, 16vw, 210px)',
              '--ch': 'calc(var(--cw) * 1.4)',
            }}
          >
            {DECK.map((p, i) => (
              <DeckCard
                key={p.id}
                p={p}
                cardRef={(n) => (cards.current[i] = n)}
                innerRef={(n) => (inners.current[i] = n)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
