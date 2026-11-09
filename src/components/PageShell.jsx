import { motion } from 'framer-motion'
import { EASE_OUT_EXPO, EASE_IN_OUT } from '../lib/motion'

/**
 * Wraps every route. On leave, an ember panel sweeps up and covers the
 * screen; on arrive, a second panel peels away upward to reveal the page.
 * (Only opacity is animated on the page itself — transforms on an ancestor
 * would break GSAP's pinned hero.)
 */
export function PageTransition({ children }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.25 } }}
        exit={{ opacity: 1, transition: { duration: 0.6 } }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] origin-bottom bg-ember"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: EASE_IN_OUT }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] origin-top bg-ember"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT }}
      />
    </>
  )
}

/** Big masked headline used at the top of every inner page. */
export function PageHeader({ eyebrow, title, outline, children, accent = '#FF5A1F' }) {
  const line = {
    hidden: { y: '105%' },
    show: (i) => ({ y: '0%', transition: { duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.45 + i * 0.08 } }),
  }
  return (
    <header className="px-5 pb-16 pt-40 md:px-10 md:pt-48">
      <motion.p
        className="font-mono text-xs uppercase tracking-[0.24em]"
        style={{ color: accent }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
      >
        {eyebrow}
      </motion.p>
      <h1 className="mt-6 font-display text-[clamp(3.2rem,11vw,11rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.045em]">
        {[title, outline].filter(Boolean).map((t, i) => (
          <span key={t} className="block overflow-hidden pb-[0.04em]">
            <motion.span
              className={`block ${i === 1 ? 'text-outline' : ''}`}
              custom={i}
              variants={line}
              initial="hidden"
              animate="show"
            >
              {t}
            </motion.span>
          </span>
        ))}
      </h1>
      {children && (
        <motion.div
          className="mt-10 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-ash"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.7 }}
        >
          {children}
        </motion.div>
      )}
    </header>
  )
}

/** Grid wrapper whose children rise in one after another as they scroll into view. */
export function RevealGrid({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  )
}

export const revealItem = {
  hidden: { opacity: 0, y: 80 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE_OUT_EXPO } },
}
