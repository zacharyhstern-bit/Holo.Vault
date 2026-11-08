import { createContext, useContext, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion'

const CursorCtx = createContext({ setOverride: () => {} })
export const useCursor = () => useContext(CursorCtx)

/**
 * Follows the pointer with a spring. Any element with `data-cursor="Label"`
 * swells the cursor and shows that label; `data-cursor=""` just swells it.
 * 3D objects (not in the DOM) call setOverride(label) via context.
 */
export function CursorProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState(null)
  const [override, setOverride] = useState(null)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, SPRING_SNAPPY)
  const sy = useSpring(y, SPRING_SNAPPY)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine)
    if (!fine) return
    document.documentElement.classList.add('has-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      setLabel(el ? el.getAttribute('data-cursor') : null)
    }
    const press = () => setDown(true)
    const release = () => setDown(false)

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
    }
  }, [x, y])

  const active = override ?? label
  const swollen = active !== null
  const text = active || ''

  return (
    <CursorCtx.Provider value={{ setOverride }}>
      {children}
      {enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
          style={{ x: sx, y: sy }}
        >
          <motion.div
            style={{ x: '-50%', y: '-50%' }}
            className="flex items-center justify-center rounded-full bg-paper text-ink"
            animate={{
              width: swollen ? (text ? 92 : 56) : 12,
              height: swollen ? (text ? 92 : 56) : 12,
              scale: down ? 0.78 : 1,
            }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            <AnimatePresence>
              {text && (
                <motion.span
                  key={text}
                  className="font-mono text-[11px] uppercase tracking-[0.14em]"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                >
                  {text}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </CursorCtx.Provider>
  )
}
