import { useEffect, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'
import { useCursor } from './Cursor'
import { EASE_OUT_EXPO, GSAP_EASE } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)
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

function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const end = Date.now() + seconds * 1000
    const id = setInterval(() => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000))), 1000)
    return () => clearInterval(id)
  }, [seconds])
  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function Hero({ onEnter }) {
  const root = useRef(null)
  const scroll = useRef(0) // 0 → 1 across the pinned section, read inside the WebGL loop
  const { setOverride } = useCursor()
  const countdown = useCountdown(2 * 3600 + 14 * 60 + 33)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // ── Intro: runs once on load ────────────────────────────
      const intro = gsap.timeline({ defaults: { ease: GSAP_EASE, duration: 1.4 } })
      intro
        .from('.hero-letter', { yPercent: 110, rotate: 6, stagger: 0.035 })
        .from('.hero-card-inner', { scale: 0.6, opacity: 0, filter: 'blur(20px)', duration: 1.8 }, 0.15)
        .from('.hero-meta-inner', { y: 24, opacity: 0, stagger: 0.08, duration: 1 }, 0.6)

      // ── Scroll: pinned, scrubbed choreography ───────────────
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const spin = { v: 0 }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=160%',
            scrub: 1.1,
            pin: true,
            anticipatePin: 1,
          },
        })

        tl.to(spin, { v: 1, duration: 1, onUpdate: () => (scroll.current = spin.v) }, 0)
          .to('.hero-row-a', { xPercent: -22, opacity: 0.1, duration: 0.6 }, 0)
          .to('.hero-row-b', { xPercent: 22, opacity: 0.1, duration: 0.6 }, 0)
          .to('.hero-meta', { y: -60, opacity: 0, duration: 0.3, stagger: 0.04 }, 0)
          .to('.hero-card', { scale: 1.35, duration: 0.55, ease: 'power2.inOut' }, 0)
          .to('.hero-glow', { scale: 1.8, opacity: 1, duration: 0.6 }, 0)
          .to('.hero-card', { scale: 0.55, opacity: 0, yPercent: -12, duration: 0.4, ease: 'power2.in' }, 0.6)
          .fromTo(
            '.hero-reveal',
            { opacity: 0, scale: 0.92, filter: 'blur(12px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' },
            0.65
          )
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        intro.progress(1)
        gsap.set('.hero-reveal', { opacity: 1 })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* ember glow */}
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[90px]"
        style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.45), rgba(255,90,31,0) 65%)' }}
      />

      {/* giant type — behind the card */}
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

      {/* 3D card — in front of the type */}
      <div className="hero-card absolute inset-0 z-20 will-change-transform">
        <div className="hero-card-inner h-full w-full" onPointerLeave={() => setOverride(null)}>
          <Suspense fallback={null}>
            <HoloCard scroll={scroll} onHoverChange={(on) => setOverride(on ? 'Flip' : null)} />
          </Suspense>
        </div>
      </div>

      {/* scroll reveal copy */}
      <div className="hero-reveal pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center opacity-0">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-ember">Pull rate 1 : 4,096</p>
        <p className="mt-5 max-w-[18ch] font-display text-[clamp(2.2rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
          We rip the packs. You keep the grails.
        </p>
      </div>

      {/* top meta row */}
      <div className="absolute inset-x-0 top-24 z-30 flex justify-between px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ash md:top-28 md:px-10">
        <div className="hero-meta">
          <div className="hero-meta-inner">
            <p>Drop 014 — Vault Series</p>
            <p className="mt-1 text-paper">
              Live in <span className="tabular-nums text-ember">{countdown}</span>
            </p>
          </div>
        </div>
        <div className="hero-meta hidden text-right sm:block">
          <div className="hero-meta-inner">
            <p>Graded · Sealed · Singles</p>
            <p className="mt-1 text-paper">Ships insured in 24h</p>
          </div>
        </div>
      </div>

      {/* bottom row: CTAs + live price chip */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex flex-col gap-6 px-5 md:bottom-10 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="hero-meta flex flex-wrap items-center gap-3">
          <div className="hero-meta-inner flex flex-wrap items-center gap-3">
            <MagneticButton onClick={onEnter} cursor="">
              Enter the vault
            </MagneticButton>
            <MagneticButton variant="ghost" cursor="">
              Sell your binder
            </MagneticButton>
          </div>
        </div>

        <div className="hero-meta">
          <motion.div
            className="hero-meta-inner flex items-center gap-5 rounded-2xl border border-paper/10 bg-paper/[0.03] px-5 py-4 backdrop-blur-md"
            whileHover={{ y: -4, borderColor: 'rgba(255,90,31,0.5)' }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            data-cursor="View"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
            </span>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em]">
              <p className="text-ash">Emberwing · PSA 10</p>
              <p className="mt-1 text-paper">
                $1,240 <span className="text-ember">▲ 4.2% 7d</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <div className="hero-meta"><div className="hero-meta-inner flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
          Scroll to rip
          <motion.span
            className="block h-10 w-px origin-top bg-paper/50"
            animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          />
        </div></div>
      </div>
    </section>
  )
}
