import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT_EXPO, EASE_IN_OUT } from '../lib/motion'
import { useBag } from '../lib/bag'
import { CATEGORIES, countIn } from '../data/products'

const LINKS = [
  { to: '/drops', label: 'Drops' },
  { to: '/graded', label: 'Graded' },
  { to: '/sealed', label: 'Sealed' },
  { to: '/sell', label: 'Sell' },
]

function Underline({ active }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-x-0 -bottom-0.5 h-px bg-ember"
      initial={false}
      animate={active ? 'hover' : undefined}
      variants={{ rest: { scaleX: 0, originX: 1 }, hover: { scaleX: 1, originX: 0 } }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
    />
  )
}

function DesktopLink({ to, label }) {
  return (
    <NavLink to={to} data-cursor="" className="relative py-1">
      {({ isActive }) => (
        <motion.span className="block" initial="rest" whileHover="hover" animate={isActive ? 'hover' : 'rest'}>
          <span className={isActive ? 'text-paper' : ''}>{label}</span>
          <Underline />
        </motion.span>
      )}
    </NavLink>
  )
}

/* "Shop" with a dropdown of every category. Opens on hover or click. */
function ShopMenu() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const timer = useRef(null)
  const active = pathname.startsWith('/shop')

  useEffect(() => setOpen(false), [pathname])
  const show = () => {
    clearTimeout(timer.current)
    setOpen(true)
  }
  const hide = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 160)
  }

  return (
    <div className="relative" onPointerEnter={show} onPointerLeave={hide}>
      <motion.button
        data-cursor=""
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex items-center gap-1.5 py-1 uppercase"
        initial="rest"
        whileHover="hover"
        animate={active || open ? 'hover' : 'rest'}
      >
        <span className={active ? 'text-paper' : ''}>Shop</span>
        <motion.svg width="9" height="9" viewBox="0 0 10 10" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </motion.svg>
        <Underline />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-1/2 top-full z-10 w-[min(560px,90vw)] -translate-x-1/2 pt-5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              className="overflow-hidden rounded-3xl border border-paper/10 bg-[#100E0B]/95 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              initial={{ clipPath: 'inset(0 0 100% 0 round 24px)' }}
              animate={{ clipPath: 'inset(0 0 0% 0 round 24px)' }}
              transition={{ duration: 0.55, ease: EASE_IN_OUT }}
            >
              {CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.08 + i * 0.04 }}
                >
                  <Link
                    to={`/shop/${c.slug}`}
                    data-cursor=""
                    className="group flex items-center gap-4 rounded-2xl px-4 py-3 normal-case tracking-normal transition-colors duration-300 hover:bg-paper/[0.06]"
                  >
                    <span
                      className="h-3 w-3 rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-150"
                      style={{ background: c.accent }}
                    />
                    <span className="flex-1">
                      <span className="block font-display text-2xl font-extrabold tracking-[-0.03em] text-paper">{c.name}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ash">{c.blurb}</span>
                    </span>
                    <span className="font-mono text-[11px] text-ash">{countIn(c.slug)}</span>
                    <span className="translate-x-[-6px] text-ember opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/shop"
                data-cursor=""
                className="mt-1 flex justify-between rounded-2xl border-t border-paper/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ash transition-colors duration-300 hover:text-paper"
              >
                Browse everything <span>{countIn()} items →</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Nav() {
  const { count: bag, setOpen: openBag, pulse } = useBag()
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

        <nav className="hidden items-center gap-9 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/70 md:flex">
          <ShopMenu />
          {LINKS.map((l) => (
            <DesktopLink key={l.to} {...l} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            key={pulse}
            data-cursor="Open"
            onClick={() => {
              setOpen(false)
              openBag(true)
            }}
            initial={pulse ? { scale: 1.15 } : false}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-3 rounded-full border border-paper/20 py-2 pl-4 pr-2 font-mono text-[12px] uppercase tracking-[0.16em]"
            aria-label={`Open bag, ${bag} items`}
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

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col justify-end overflow-y-auto bg-ink px-5 pb-10 pt-28 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Shop</p>
            <div className="mb-8 flex flex-wrap gap-2">
              {CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 + i * 0.04 }}
                >
                  <NavLink
                    to={`/shop/${c.slug}`}
                    className="flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em]"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: c.accent }} />
                    {c.name}
                  </NavLink>
                </motion.div>
              ))}
            </div>
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
                      `block font-display text-[13vw] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] ${
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
