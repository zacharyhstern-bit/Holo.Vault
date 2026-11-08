import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { PageHeader, RevealGrid, revealItem } from '../components/PageShell'
import MagneticButton from '../components/MagneticButton'
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion'

const STEPS = [
  ['01', 'Tell us what you have', 'A rough list or a few photos of your binder is enough to start.'],
  ['02', 'Get a quote in 48h', 'We price against recent sold data, not guesses. No obligation.'],
  ['03', 'Ship it free', 'We send a prepaid, insured label. Drop it off and track it to the vault.'],
  ['04', 'Get paid', 'Bank transfer or store credit (+15%) within 2 days of arrival.'],
]

const CONDITIONS = [
  { id: 'played', label: 'Played', k: 0.45 },
  { id: 'lp', label: 'Lightly played', k: 0.75 },
  { id: 'nm', label: 'Near mint', k: 1 },
]

const money = (v) => `$${Math.round(v).toLocaleString()}`

/* Rough payout estimator — numbers glide instead of jumping. */
function Estimator() {
  const [count, setCount] = useState(250)
  const [holo, setHolo] = useState(20)
  const [cond, setCond] = useState('lp')

  const k = CONDITIONS.find((c) => c.id === cond).k
  const value = count * (0.15 + (holo / 100) * 1.6) * k

  const spring = useSpring(value, SPRING_SOFT)
  useEffect(() => spring.set(value), [spring, value])
  const low = useTransform(spring, (v) => money(v * 0.8))
  const high = useTransform(spring, (v) => money(v * 1.15))

  const slider =
    'h-1 w-full cursor-pointer appearance-none rounded-full bg-paper/15 accent-ember [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ember [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-300 [&::-webkit-slider-thumb]:hover:scale-125'

  return (
    <div className="grid gap-10 rounded-3xl border border-paper/10 bg-paper/[0.03] p-8 md:grid-cols-2 md:p-12">
      <div className="space-y-10">
        <label className="block">
          <span className="flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
            Number of cards <span className="tabular-nums text-paper">{count.toLocaleString()}</span>
          </span>
          <input type="range" min="10" max="2000" step="10" value={count} onChange={(e) => setCount(+e.target.value)} className={`mt-4 ${slider}`} />
        </label>
        <label className="block">
          <span className="flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
            Share that are holos / rares <span className="tabular-nums text-paper">{holo}%</span>
          </span>
          <input type="range" min="0" max="100" value={holo} onChange={(e) => setHolo(+e.target.value)} className={`mt-4 ${slider}`} />
        </label>
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash">Overall condition</span>
          <div className="mt-4 flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <motion.button
                key={c.id}
                data-cursor=""
                onClick={() => setCond(c.id)}
                whileTap={{ scale: 0.94 }}
                animate={{
                  backgroundColor: cond === c.id ? '#FF5A1F' : 'rgba(255,90,31,0)',
                  color: cond === c.id ? '#0B0A08' : '#F2ECDF',
                }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="rounded-full border border-paper/20 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em]"
              >
                {c.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl bg-ember p-8 text-ink">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]">Estimated payout</p>
        <p className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] tabular-nums">
          <motion.span>{low}</motion.span>
          <span className="opacity-50"> – </span>
          <motion.span>{high}</motion.span>
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] opacity-70">
          Ballpark only. Single grails are priced individually and can be worth far more than the bulk rate.
        </p>
      </div>
    </div>
  )
}

function QuoteForm() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  // NOTE: this form doesn't send anywhere yet. Connect it to a form service
  // (e.g. Formspree, Basin) or your own API inside onSubmit.
  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const next = {}
    if (!f.get('name')?.trim()) next.name = 'Tell us your name'
    if (!/^\S+@\S+\.\S+$/.test(f.get('email') || '')) next.email = 'We need a valid email to send your quote'
    if (!f.get('details')?.trim()) next.details = 'A rough list helps us price it'
    setErrors(next)
    if (Object.keys(next).length === 0) setSent(true)
  }

  const field =
    'mt-3 w-full rounded-2xl border bg-transparent px-5 py-4 font-display text-lg text-paper outline-none transition-colors duration-300 placeholder:text-paper/25 focus:border-ember'

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="rounded-3xl border border-ember/50 p-12 text-center"
        >
          <motion.div
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember text-ink"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <motion.path
                d="M4 12.5l5 5L20 6.5"
                stroke="currentColor"
                strokeWidth="2.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </svg>
          </motion.div>
          <p className="mt-8 font-display text-4xl font-extrabold tracking-[-0.03em]">Request received.</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-ash">Expect a quote in your inbox within 48 hours.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid gap-8 md:grid-cols-2"
        >
          {[
            ['name', 'Your name', 'Ash K.', 'text'],
            ['email', 'Email', 'you@example.com', 'email'],
          ].map(([name, label, ph, type]) => (
            <label key={name} className="block font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
              {label}
              <input name={name} type={type} placeholder={ph} className={`${field} ${errors[name] ? 'border-ember' : 'border-paper/15'}`} />
              {errors[name] && <span className="mt-2 block normal-case tracking-normal text-ember">{errors[name]}</span>}
            </label>
          ))}
          <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-ash md:col-span-2">
            What are you selling?
            <textarea
              name="details"
              rows={5}
              placeholder="e.g. ~300 cards from 1999–2003, a few holos, one graded slab…"
              className={`${field} resize-none ${errors.details ? 'border-ember' : 'border-paper/15'}`}
            />
            {errors.details && <span className="mt-2 block normal-case tracking-normal text-ember">{errors.details}</span>}
          </label>
          <div className="md:col-span-2">
            <MagneticButton type="submit">Request my quote</MagneticButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default function SellPage() {
  return (
    <>
      <PageHeader eyebrow="We buy collections" title="Sell" outline="your binder">
        From a shoebox of commons to a single grail — fair offers based on real sold prices, paid fast.
      </PageHeader>

      <section className="px-5 md:px-10">
        <RevealGrid className="grid gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, title, body]) => (
            <motion.div key={n} variants={revealItem} whileHover={{ backgroundColor: 'rgba(255,90,31,0.08)' }} className="bg-ink p-8">
              <p className="font-display text-6xl font-extrabold tracking-[-0.05em] text-outline">{n}</p>
              <h3 className="mt-8 font-display text-2xl font-extrabold leading-tight tracking-[-0.02em]">{title}</h3>
              <p className="mt-3 font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-ash">{body}</p>
            </motion.div>
          ))}
        </RevealGrid>
      </section>

      <section className="px-5 pt-32 md:px-10">
        <h2 className="mb-10 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-[-0.04em]">
          What's it worth?
        </h2>
        <Estimator />
      </section>

      <section className="px-5 pb-32 pt-32 md:px-10">
        <h2 className="mb-10 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-[-0.04em]">
          Get a real quote
        </h2>
        <QuoteForm />
      </section>
    </>
  )
}
