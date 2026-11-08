import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion'

/**
 * A button that leans toward the pointer, floods with colour from the bottom
 * on hover and compresses on press. Label rolls up to a duplicate on hover.
 */
export default function MagneticButton({
  children,
  variant = 'solid',
  strength = 0.35,
  className = '',
  cursor = '',
  ...props
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING_SOFT)
  const sy = useSpring(y, SPRING_SOFT)

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const solid = variant === 'solid'

  return (
    <motion.button
      ref={ref}
      data-cursor={cursor}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      animate="rest"
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className={`group relative isolate inline-flex h-16 items-center gap-4 overflow-hidden rounded-full px-8 font-mono text-[13px] uppercase tracking-[0.16em] outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-ink ${
        solid ? 'bg-ember text-ink' : 'border border-paper/25 text-paper'
      } ${className}`}
      {...props}
    >
      {/* colour flood */}
      <motion.span
        aria-hidden
        className={`absolute inset-0 -z-10 origin-bottom rounded-full ${solid ? 'bg-paper' : 'bg-ember'}`}
        variants={{ rest: { scaleY: 0, borderRadius: '50% 50% 0 0' }, hover: { scaleY: 1, borderRadius: '0% 0% 0 0' } }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
      />
      {/* rolling label */}
      <span className="relative block h-[1.2em] overflow-hidden leading-[1.2em]">
        <motion.span
          className="block"
          variants={{ rest: { y: '0%' }, hover: { y: '-100%' } }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          {children}
        </motion.span>
        <motion.span
          aria-hidden
          className={`absolute left-0 top-full block ${solid ? '' : 'text-ink'}`}
          variants={{ rest: { y: '0%' }, hover: { y: '-100%' } }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          {children}
        </motion.span>
      </span>
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className={solid ? '' : 'group-hover:text-ink'}
        variants={{ rest: { rotate: 0, x: 0 }, hover: { rotate: -45, x: 3 } }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        <path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
      </motion.svg>
    </motion.button>
  )
}
