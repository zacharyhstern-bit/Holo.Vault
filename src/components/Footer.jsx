import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products'

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 px-5 pb-10 pt-20 md:px-10">
      <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
        <Link to="/" className="font-display text-[clamp(3rem,10vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
          HOLO<span className="text-ember">/</span>VAULT
        </Link>
        <nav className="grid grid-cols-2 gap-x-12 gap-y-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ash">
          {[
            ...CATEGORIES.map((c) => [`/shop/${c.slug}`, c.name]),
            ['/drops', 'Drops'],
            ['/graded', 'Graded'],
            ['/sealed', 'Sealed'],
            ['/sell', 'Sell to us'],
          ].map(([to, label]) => (
            <Link key={to} to={to} data-cursor="" className="transition-colors duration-300 hover:text-ember">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-16 flex flex-col justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ash md:flex-row">
        <p>© 2026 Holo/Vault — independent reseller</p>
        <p className="max-w-2xl md:text-right">
          Independent reseller. Not affiliated with or endorsed by Nintendo, The Pokémon Company, Wizards of the Coast, MLB, the
          NBA, the NHL or any card manufacturer.
        </p>
      </div>
    </footer>
  )
}
