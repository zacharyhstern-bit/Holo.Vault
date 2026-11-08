import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT_EXPO, EASE_IN_OUT } from '../lib/motion'

const LINKS = [
  { to: '/drops', label: 'Drops' },
  { to: '/graded', label: 'Graded' },
  { to: '/sealed', label: 'Sealed' },
  { to: '/sell', label: 'Sell' },
]

function DesktopLink({ to, label }) {
  return (
    <NavLink to={to} data-cursor="" className="relative py-1">
      {({ isActive }) => (
        <motion.span className="block" initial="rest" whileHover="hover" animate={isActive ? 'hover' : 'rest'}>
          <span className={isActive ? 'text-paper' : ''}>{label}</span>
          <motion.span
            aria-hidden
            className="absolute inset-x-0 -bottom-0.5 h-px bg-ember"
            variants={{ rest: { scaleX: 0, originX: 1 }, hover: { scaleX: 1, originX: 0 } }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          />
        </motion.span>
      )}
    </NavLink>
  )
}

export default function Nav({ bag }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.3 }}
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between bg-gradient-to-b from-ink/80 to-transparent px-5 py-6 md:px-10"
      >
        <Link to="/" data-cursor="" className="font-display text-xl font-extrabold tracking-[-0.03em]">
          HOLO<span className="text-ember">/</span>VAULT
        </Link>

        <nav className="hidden gap-9 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/70 md:flex">
          {LINKS.map((l) => (
            <DesktopLink key={l.to} {...l} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
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

          {/* mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-paper/20 md:hidden"
          >
            <motion.span
              className="absolute h-px w-4 bg-paper"
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            />
            <motion.span
              className="absolute h-px w-4 bg-paper"
              animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col justify-end bg-ink px-5 pb-12 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
          >
            {[{ to: '/', label: 'Home' }, ...LINKS].map((l, i) => (
              <div key={l.to} className="overflow-hidden">
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.15 + i * 0.05 }}
                >
                  <NavLink
                    to={l.to}
                    end
                    className={({ isActive }) =>
                      `block font-display text-[16vw] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] ${
                        isActive ? 'text-ember' : 'text-paper'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
