import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT_EXPO } from '../lib/motion'

const LINKS = ['Drops', 'Graded', 'Sealed', 'Sell']

function NavLink({ children }) {
  return (
    <motion.a
      href={`#${children.toLowerCase()}`}
      data-cursor=""
      className="relative py-1"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {children}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 -bottom-0.5 h-px bg-ember"
        variants={{ rest: { scaleX: 0, originX: 1 }, hover: { scaleX: 1, originX: 0 } }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      />
    </motion.a>
  )
}

export default function Nav({ bag }) {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.3 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-6 md:px-10"
    >
      <a href="#" data-cursor="" className="font-display text-xl font-extrabold tracking-[-0.03em]">
        HOLO<span className="text-ember">/</span>VAULT
      </a>

      <nav className="hidden gap-9 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/80 md:flex">
        {LINKS.map((l) => (
          <NavLink key={l}>{l}</NavLink>
        ))}
      </nav>

      <motion.button
        data-cursor=""
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        className="flex items-center gap-3 rounded-full border border-paper/20 py-2 pl-4 pr-2 font-mono text-[12px] uppercase tracking-[0.16em]"
        aria-label={`Bag, ${bag} items`}
      >
        Bag
        <span className="relative grid h-7 min-w-7 place-items-center overflow-hidden rounded-full bg-ember px-2 text-ink">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={bag}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="tabular-nums"
            >
              {bag}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
    </motion.header>
  )
}
