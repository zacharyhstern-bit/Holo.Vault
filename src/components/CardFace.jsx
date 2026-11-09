// Draws the front of a card in HTML/CSS, in one of three styles:
//   monster — creature card (Pokémon category)
//   sport   — player card (baseball, basketball, hockey)
//   magic   — spell/creature card (Magic)
// Everything is sized in container-query units (cqw), so the same face
// renders correctly at any size: product tiles, slabs, the deck, the bag.

const shell = 'relative h-full w-full overflow-hidden bg-[#14110D]'
const cq = { containerType: 'inline-size' }

function Rings({ tone = 'rgba(11,10,8,0.4)' }) {
  return [0, 1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      className="absolute left-1/2 top-[60%] rounded-full border"
      style={{ borderColor: tone, width: `${30 + i * 26}%`, aspectRatio: 1, transform: 'translate(-50%,-50%)' }}
    />
  ))
}

function Monster({ p }) {
  const [a, b] = p.hue
  return (
    <div className={shell} style={cq}>
      <div
        className="absolute inset-[7%] bottom-[34%] overflow-hidden rounded-[3cqw]"
        style={{ background: `radial-gradient(circle at 50% 60%, ${b}, ${a} 35%, #0B0A08 80%)` }}
      >
        <Rings />
      </div>
      <div className="absolute inset-x-[7%] bottom-[7%]">
        <p className="truncate font-display font-extrabold leading-tight tracking-[-0.02em] text-paper" style={{ fontSize: '10cqw' }}>
          {p.name}
        </p>
        <p className="mt-[1.5cqw] flex justify-between font-mono uppercase text-ash" style={{ fontSize: '4.2cqw', letterSpacing: '0.12em' }}>
          <span>{p.set}</span>
          {p.kind !== 'slab' && <span className="text-paper">{p.grade}</span>}
        </p>
      </div>
    </div>
  )
}

function Sport({ p }) {
  const [a, b] = p.hue
  return (
    <div className={shell} style={cq}>
      {/* photo area: team colours, speed stripes, giant number */}
      <div
        className="absolute inset-[5%] bottom-[24%] overflow-hidden rounded-[2cqw]"
        style={{ background: `linear-gradient(160deg, ${b} 0%, ${a} 45%, #0B0A08 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'repeating-linear-gradient(115deg, rgba(11,10,8,0.6) 0 2cqw, transparent 2cqw 6cqw)' }}
        />
        <span
          className="absolute -bottom-[6cqw] right-[2cqw] font-display font-extrabold leading-none tracking-[-0.06em]"
          style={{ fontSize: '62cqw', color: 'transparent', WebkitTextStroke: '0.6cqw rgba(242,236,223,0.55)' }}
        >
          {p.number}
        </span>
        <span
          className="absolute left-[5cqw] top-[5cqw] rounded-full bg-ink/80 px-[3cqw] py-[1cqw] font-mono uppercase text-paper"
          style={{ fontSize: '4cqw', letterSpacing: '0.12em' }}
        >
          {p.position}
        </span>
        {p.rookie && (
          <span
            className="absolute right-[5cqw] top-[5cqw] grid aspect-square w-[17cqw] place-items-center rounded-full font-display font-extrabold text-ink"
            style={{ fontSize: '5.2cqw', background: b }}
          >
            RC
          </span>
        )}
      </div>
      {/* name plate */}
      <div className="absolute inset-x-0 bottom-0 h-[24%] px-[6cqw] pt-[3.5cqw]" style={{ background: a }}>
        <p className="truncate font-display font-extrabold uppercase leading-none tracking-[-0.03em] text-ink" style={{ fontSize: '9cqw' }}>
          {p.name}
        </p>
        <p className="mt-[2cqw] truncate font-mono uppercase text-ink/70" style={{ fontSize: '3.8cqw', letterSpacing: '0.1em' }}>
          {p.team} · {p.set}
        </p>
      </div>
    </div>
  )
}

function MagicFace({ p }) {
  const [a, b] = p.hue
  const pip = 'grid aspect-square w-[6.5cqw] place-items-center rounded-full border border-ink/40'
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ ...cq, background: `linear-gradient(160deg, ${b}, ${a} 60%, #0B0A08)` }}>
      <div className="absolute inset-[4cqw] flex flex-col gap-[2cqw] rounded-[2.5cqw] bg-[#0F0D0A] p-[2.5cqw]">
        {/* title bar */}
        <div className="flex items-center justify-between gap-[2cqw] rounded-[1.5cqw] px-[3cqw] py-[1.8cqw]" style={{ background: `${a}33` }}>
          <p className="truncate font-display font-extrabold leading-none tracking-[-0.02em] text-paper" style={{ fontSize: '6.4cqw' }}>
            {p.name}
          </p>
          <div className="flex shrink-0 gap-[1cqw]">
            {(p.mana ?? []).map((m, i) => (
              <span key={i} className={pip} style={{ background: m }} />
            ))}
          </div>
        </div>
        {/* art */}
        <div
          className="relative flex-[1.25] overflow-hidden rounded-[1.5cqw]"
          style={{ background: `radial-gradient(circle at 50% 70%, ${b}, ${a} 40%, #0B0A08 90%)` }}
        >
          <Rings tone="rgba(242,236,223,0.18)" />
        </div>
        {/* type line */}
        <div className="flex justify-between rounded-[1.5cqw] px-[3cqw] py-[1.5cqw]" style={{ background: `${a}33` }}>
          <p className="truncate font-mono uppercase text-paper/90" style={{ fontSize: '3.6cqw', letterSpacing: '0.06em' }}>
            {p.typeLine}
          </p>
        </div>
        {/* rules text */}
        <div className="relative flex-1 rounded-[1.5cqw] bg-paper/[0.06] px-[3cqw] py-[2.5cqw]">
          <p className="line-clamp-3 font-display leading-snug text-paper/80" style={{ fontSize: '4.4cqw' }}>
            {p.rules}
          </p>
          {p.pt && (
            <span
              className="absolute bottom-[2cqw] right-[2cqw] rounded-[1.2cqw] px-[2.5cqw] py-[0.6cqw] font-display font-extrabold text-ink"
              style={{ fontSize: '5cqw', background: b }}
            >
              {p.pt}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CardFace({ p }) {
  if (p.style === 'sport') return <Sport p={p} />
  if (p.style === 'magic') return <MagicFace p={p} />
  return <Monster p={p} />
}
