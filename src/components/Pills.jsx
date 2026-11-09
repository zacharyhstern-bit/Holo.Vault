import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from '../lib/motion'

/**
 * Segmented filter control. The orange highlight slides between options.
 * items: strings, or { id, label, dot? } objects. `id` must be unique per page.
 */
export default function Pills({ items, value, onChange, id, accent = '#FF5A1F' }) {
  return (
    <div className="flex max-w-full flex-wrap gap-1 rounded-[28px] border border-paper/10 p-1">
      {items.map((it) => {
        const key = it.id ?? it
        const label = it.label ?? it
        const on = value === key
        return (
          <button
            key={key}
            data-cursor=""
            onClick={() => onChange(key)}
            aria-pressed={on}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
              on ? 'text-ink' : 'text-paper/70 hover:text-paper'
            }`}
          >
            {on && (
              <motion.span
                layoutId={`pill-${id}`}
                className="absolute inset-0 rounded-full"
                style={{ background: accent }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
            )}
            {it.dot && (
              <span className="relative h-2 w-2 rounded-full" style={{ background: on ? '#0B0A08' : it.dot }} />
            )}
            <span className="relative">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
