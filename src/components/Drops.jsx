import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductCard from './ProductCard'
import { DROP_ITEMS } from '../data/products'
import { EASE_OUT_EXPO } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

/* Home-page teaser: three items from the current drop + a link to the full page. */
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
    <section ref={root} className="relative px-5 pb-32 pt-40 md:px-10">
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
        {DROP_ITEMS.slice(0, 3).map((p) => (
          <ProductCard key={p.id} p={p} onAdd={onAdd} className="drop-card" />
        ))}
      </div>

      <motion.div className="mt-20 flex justify-center" initial="rest" whileHover="hover" animate="rest">
        <Link
          to="/drops"
          data-cursor=""
          className="group flex items-center gap-4 font-display text-[clamp(1.8rem,4vw,3.2rem)] font-extrabold uppercase tracking-[-0.03em]"
        >
          See the full drop
          <motion.span
            className="grid h-[1.2em] w-[1.2em] place-items-center rounded-full bg-ember text-ink"
            variants={{ rest: { rotate: 0, x: 0 }, hover: { rotate: -45, x: 8 } }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            <svg width="40%" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </motion.span>
        </Link>
      </motion.div>
    </section>
  )
}
