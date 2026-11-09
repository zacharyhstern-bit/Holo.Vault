import { useEffect, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import MagneticButton from './MagneticButton'
import { useCursor } from './Cursor'
import { EASE_OUT_EXPO, GSAP_EASE } from '../lib/motion'
import { useCountdown } from '../lib/useCountdown'
import { HERO_CARDS, DROP, CATEGORIES } from '../data/products'

const HoloCard = lazy(() => import('./HoloCard'))

/* Split a word into masked letters for the intro stagger. */
function Letters({ text, className = '' }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <span className="hero-letter inline-block will-change-transform">{ch}</span>
        </span>
      ))}
    </span>
  )
}

const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

const swap = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: '0%', opacity: 1 },
  exit: { y: '-100%', opacity: 0 },
  transition: { duration: 0.6, ease: EASE_OUT_EXPO },
}

export default function Hero() {
  const root = useRef(null)
  const scroll = useRef(0) // scroll-driven spin is off; kept at 0
  const progressRef = useRef(null)
  const controlRef = useRef(null)
  const [active, setActive] = useState(0)
  const { setOverride } = useCursor()
  const navigate = useNavigate()
  const countdown = useCountdown(DROP.opensInSeconds)
  const card = HERO_CARDS[active]

  // never leave the cursor stuck on "Flip" after navigating away
  useEffect(() => () => setOverride(null), [setOverride])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // ── Intro: runs once on load ────────────────────────────
      const intro = gsap.timeline({ defaults: { ease: GSAP_EASE, duration: 1.4 } })
      intro
        .from('.hero-letter', { yPercent: 110, rotate: 6, stagger: 0.035 })
        .from('.hero-card-inner', { scale: 0.6, opacity: 0, filter: 'blur(20px)', duration: 1.8 }, 0.15)
        .from('.hero-meta-inner', { y: 24, opacity: 0, stagger: 0.08, duration: 1 }, 0.6)

      // Reduced motion: skip straight to the end of the intro.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        intro.progress(1)
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* glow takes on the active card's colour */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          aria-hidden
          className="hero-glow h-[70vmin] w-[70vmin] rounded-full opacity-60 blur-[90px]"
          initial={false}
          animate={{ background: `radial-gradient(circle, ${rgba(card.colors[0], 0.45)} 0%, ${rgba(card.colors[0], 0)} 65%)` }}
          transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
        />
      </div>

      {/* giant type — behind the cards */}
      <h1 className="pointer-events-none absolute inset-0 z-10 flex select-none flex-col justify-center px-5 font-display font-extrabold uppercase leading-[0.82] tracking-[-0.045em] md:px-10">
        <span className="hero-row-a block text-[clamp(4.2rem,17vw,17rem)]">
          <Letters text="Pull" /> <Letters text="your" className="text-outline" />
        </span>
        <span className="hero-row-b block self-end text-[clamp(4.2rem,17vw,17rem)]">
          <Letters text="grail" />
          <span className="text-ember">
            <Letters text="." />
          </span>
        </span>
      </h1>

      {/* 3D carousel — in front of the type */}
      <div className="hero-card absolute inset-0 z-20 will-change-transform">
        <div className="hero-card-inner h-full w-full" onPointerLeave={() => setOverride(null)}>
          <Suspense fallback={null}>
            <HoloCard
              cards={HERO_CARDS}
              scroll={scroll}
              progressRef={progressRef}
              controlRef={controlRef}
              onActiveChange={setActive}
              onHoverChange={setOverride}
            />
          </Suspense>
        </div>
      </div>

      {/* top meta row */}
      <div className="absolute inset-x-0 top-24 z-30 flex justify-between px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ash md:top-28 md:px-10">
        <div className="hero-meta">
          <div className="hero-meta-inner">
            <p>
              Drop {DROP.number} — {DROP.name}
            </p>
            <p className="mt-1 text-paper">
              Live in <span className="tabular-nums text-ember">{countdown}</span>
            </p>
          </div>
        </div>

        {/* carousel index + autoplay progress */}
        <div className="hero-meta hidden sm:block">
          <div className="hero-meta-inner flex flex-col items-end gap-3">
            <p className="tabular-nums text-paper">
              <span className="relative inline-block h-[1.2em] w-[2ch] overflow-hidden align-bottom">
                <AnimatePresence initial={false}>
                  <motion.span key={active} className="absolute inset-0" {...swap}>
                    {String(active + 1).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </span>{' '}
              / {String(HERO_CARDS.length).padStart(2, '0')}
            </p>
            <div className="flex gap-1.5">
              {HERO_CARDS.map((c, i) => (
                <button
                  key={c.id}
                  data-cursor=""
                  aria-label={`Show ${c.name}`}
                  onClick={() => controlRef.current?.goTo(i)}
                  className="group relative h-6 w-9"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden bg-paper/15 transition-colors duration-300 group-hover:bg-paper/40">
                    {i === active ? (
                      <span ref={progressRef} className="block h-full origin-left bg-ember" style={{ transform: 'scaleX(0)' }} />
                    ) : (
                      <span className={`block h-full ${i < active ? 'bg-paper/50' : ''}`} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom row: CTAs + live price chip for the active card */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex flex-col gap-6 px-5 md:bottom-10 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="hero-meta flex flex-wrap items-center gap-3">
          <div className="hero-meta-inner flex flex-wrap items-center gap-3">
            <MagneticButton onClick={() => navigate('/drops')}>Enter the vault</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => navigate('/sell')}>
              Sell your binder
            </MagneticButton>
          </div>
        </div>

        <div className="hero-meta">
          <motion.button
            onClick={() => navigate(`/shop/${CATEGORIES.find((c) => c.name === card.category)?.slug ?? ''}`)}
            className="hero-meta-inner flex min-w-[300px] items-center gap-5 rounded-2xl border border-paper/10 bg-paper/[0.03] px-5 py-4 text-left backdrop-blur-md"
            whileHover={{ y: -4, borderColor: 'rgba(255,90,31,0.5)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            data-cursor="View"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: card.colors[0] }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-700"
                style={{ background: card.colors[0] }}
              />
            </span>
            <div className="relative h-[2.6em] flex-1 overflow-hidden font-mono text-[11px] uppercase leading-[1.3em] tracking-[0.16em]">
              <AnimatePresence initial={false}>
                <motion.div key={card.id} className="absolute inset-0 whitespace-nowrap" {...swap}>
                  <p className="text-ash">
                    {card.category} · {card.grade}
                  </p>
                  <p className="text-paper">
                    {card.name} ${card.price.toLocaleString()}{' '}
                    <span style={{ color: card.change.startsWith('▼') ? '#8A8478' : card.colors[0] }}>{card.change}</span>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 lg:block">
        <div className="hero-meta">
          <div className="hero-meta-inner flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
            Scroll
            <motion.span
              className="block h-10 w-px origin-top bg-paper/50"
              animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
