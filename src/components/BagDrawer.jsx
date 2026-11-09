import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBag } from '../lib/bag'
import CardFace from './CardFace'
import { categoryBySlug } from '../data/products'
import { EASE_OUT_EXPO, EASE_IN_OUT } from '../lib/motion'

const money = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

function Thumb({ item }) {
  const [a, b] = item.hue ?? ['#FF5A1F', '#FFC36B']
  const box = item.kind === 'box'
  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-paper/15 bg-[#14110D] ${
        box ? 'h-20 w-16 rounded-lg' : 'h-20 w-[57px] rounded-md'
      }`}
    >
      {box || !item.style ? (
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${a}, #0B0A08 80%)` }} />
      ) : (
        <CardFace p={item} />
      )}
    </div>
  )
}

function Qty({ item }) {
  const { setQty } = useBag()
  const atMax = item.stock != null && item.qty >= item.stock
  const btn = 'grid h-8 w-8 place-items-center rounded-full transition-colors duration-300 hover:bg-paper/10 disabled:opacity-30 disabled:hover:bg-transparent'
  return (
    <div className="flex items-center rounded-full border border-paper/15">
      <button className={btn} aria-label={`One less ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
        −
      </button>
      <span className="w-6 text-center tabular-nums">{item.qty}</span>
      <button className={btn} aria-label={`One more ${item.name}`} disabled={atMax} onClick={() => setQty(item.id, item.qty + 1)}>
        +
      </button>
    </div>
  )
}

export default function BagDrawer() {
  const { items, count, subtotal, remove, open, setOpen } = useBag()
  const [note, setNote] = useState(false)

  // close on Escape, lock page scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, setOpen])

  useEffect(() => {
    if (!open) setNote(false)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Your bag">
          {/* backdrop */}
          <motion.button
            aria-label="Close bag"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-paper/10 bg-[#100E0B]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
          >
            <header className="flex items-center justify-between px-6 py-6">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em]">
                Bag <span className="text-ember tabular-nums">({count})</span>
              </h2>
              <motion.button
                data-cursor=""
                onClick={() => setOpen(false)}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="grid h-11 w-11 place-items-center rounded-full border border-paper/20"
                aria-label="Close bag"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </motion.button>
            </header>

            {items.length === 0 ? (
              <motion.div
                className="flex flex-1 flex-col items-start justify-center px-6 pb-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.25 }}
              >
                <p className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
                  Nothing <span className="text-outline">pulled</span> yet.
                </p>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-ash">Your grail is in the vault somewhere.</p>
                <Link
                  to="/drops"
                  onClick={() => setOpen(false)}
                  className="mt-8 rounded-full bg-ember px-6 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-paper"
                >
                  Browse this week's drop →
                </Link>
              </motion.div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 + i * 0.05 } }}
                        exit={{ opacity: 0, x: 40, height: 0, transition: { duration: 0.35 } }}
                        className="border-t border-paper/10"
                      >
                        <div className="flex gap-4 py-5">
                          <Thumb item={item} />
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div className="flex justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-display text-xl font-extrabold tracking-[-0.02em]">{item.name}</p>
                                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                                  {[categoryBySlug(item.category)?.name, item.label].filter(Boolean).join(' · ')}
                                </p>
                              </div>
                              <p className="font-display text-xl font-extrabold tabular-nums">{money(item.price * item.qty)}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between font-mono text-xs">
                              <Qty item={item} />
                              <button
                                onClick={() => remove(item.id)}
                                className="uppercase tracking-[0.14em] text-ash underline-offset-4 transition-colors duration-300 hover:text-ember hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-paper/10 px-6 pb-8 pt-6">
                  <div className="flex items-end justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-ash">Subtotal</span>
                    <span className="font-display text-4xl font-extrabold tracking-[-0.03em] tabular-nums">{money(subtotal)}</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                    Shipping and tax calculated at checkout.
                  </p>
                  <motion.button
                    data-cursor=""
                    onClick={() => setNote(true)}
                    whileHover={{ backgroundColor: '#F2ECDF' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="mt-6 h-16 w-full rounded-full bg-ember font-mono text-[13px] uppercase tracking-[0.16em] text-ink"
                  >
                    Checkout · {money(subtotal)}
                  </motion.button>
                  <AnimatePresence>
                    {note && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ember"
                      >
                        Online checkout opens soon — your bag is saved on this device.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
