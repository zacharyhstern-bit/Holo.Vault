const ITEMS = ['Pokémon', 'Baseball', 'Basketball', 'Hockey', 'Magic: The Gathering', 'PSA · BGS · CGC · SGC', 'Sealed hobby boxes']

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="relative z-10 -rotate-[1.5deg] overflow-hidden border-y border-ink bg-ember py-5 text-ink">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0">
            {row.map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-8 px-8 font-display text-3xl font-extrabold uppercase tracking-[-0.02em] md:text-5xl"
              >
                {t}
                <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
                  <path d="M11 0l2.6 8.4L22 11l-8.4 2.6L11 22l-2.6-8.4L0 11l8.4-2.6z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
