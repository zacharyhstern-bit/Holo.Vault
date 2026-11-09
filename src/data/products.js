// ─────────────────────────────────────────────────────────────────
// THE CATALOGUE — edit this file to change what the store sells.
//
// Everything below is PLACEHOLDER inventory with made-up names,
// players and teams so the site can be designed before real stock
// is loaded. Replace each entry with your real cards, prices and
// photos before you start selling.
//
// Every item has:
//   id        unique string
//   category  'pokemon' | 'baseball' | 'basketball' | 'hockey' | 'magic'
//   kind      'card' (raw single) | 'slab' (graded) | 'box' (sealed)
//   style     how the card face is drawn: 'monster' | 'sport' | 'magic'
//   price     USD, stock = how many you have
//   hue       [main colour, highlight colour] for the artwork
// ─────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    slug: 'pokemon',
    name: 'Pokémon',
    full: 'Pokémon TCG',
    outline: 'cards',
    accent: '#FFCB3D',
    style: 'monster',
    blurb: 'Vintage holos, modern alt-arts and sealed booster boxes.',
  },
  {
    slug: 'baseball',
    name: 'Baseball',
    full: 'Baseball cards',
    outline: 'cards',
    accent: '#E8473C',
    style: 'sport',
    blurb: 'Rookies, on-card autos and vintage cardboard.',
  },
  {
    slug: 'basketball',
    name: 'Basketball',
    full: 'Basketball cards',
    outline: 'cards',
    accent: '#FF7A1A',
    style: 'sport',
    blurb: 'Rookie patches, numbered parallels and hobby boxes.',
  },
  {
    slug: 'hockey',
    name: 'Hockey',
    full: 'Hockey cards',
    outline: 'cards',
    accent: '#5FC8FF',
    style: 'sport',
    blurb: 'Rookie cards, goalie autos and patch cards.',
  },
  {
    slug: 'magic',
    name: 'Magic',
    full: 'Magic: The Gathering',
    outline: 'the gathering',
    accent: '#B57BFF',
    style: 'magic',
    blurb: 'Foils, mythics, Commander staples and sealed boxes.',
  },
]

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug)

// Mana colours for Magic cards
const W = '#F4EED2'
const U = '#3E8BD8'
const B = '#5A4A55'
const R = '#E2553A'
const G = '#3F9E5A'

export const ITEMS = [
  // ── Pokémon ───────────────────────────────────────────────────
  { id: 'pk-emberwing', category: 'pokemon', kind: 'card', style: 'monster', name: 'Emberwing', set: 'HV-007', grade: 'Raw · NM', price: 320, stock: 1, hue: ['#FF5A1F', '#FFC36B'] },
  { id: 'pk-tidecaller', category: 'pokemon', kind: 'card', style: 'monster', name: 'Tidecaller', set: 'HV-031', grade: 'Raw · NM', price: 180, stock: 3, hue: ['#1FB6FF', '#9BF0FF'] },
  { id: 'pk-mosswarden', category: 'pokemon', kind: 'card', style: 'monster', name: 'Moss Warden', set: 'HV-064', grade: 'Raw · NM', price: 142, stock: 9, hue: ['#3FD08A', '#E4FF7A'] },
  { id: 'pk-voltmoth', category: 'pokemon', kind: 'card', style: 'monster', name: 'Voltmoth', set: 'HV-088', grade: 'Raw · NM', price: 64, stock: 14, hue: ['#B57BFF', '#FFE66B'] },
  { id: 'pk-cinderkit', category: 'pokemon', kind: 'card', style: 'monster', name: 'Cinder Kit', set: 'HV-009', grade: 'Raw · LP', price: 18, stock: 22, hue: ['#FF8A3D', '#FFE0B0'] },
  { id: 'pk-g-emberwing', category: 'pokemon', kind: 'slab', style: 'monster', name: 'Emberwing', set: 'HV-007', grader: 'PSA', grade: '10', price: 1240, stock: 1, hue: ['#FF5A1F', '#FFC36B'] },
  { id: 'pk-g-duskfang', category: 'pokemon', kind: 'slab', style: 'monster', name: 'Duskfang', set: 'HV-112', grader: 'PSA', grade: '10', price: 1890, stock: 1, hue: ['#FF3D6E', '#FFB1C8'] },
  { id: 'pk-g-frostling', category: 'pokemon', kind: 'slab', style: 'monster', name: 'Frostling', set: 'HV-045', grader: 'CGC', grade: '10', price: 520, stock: 1, hue: ['#7FD8FF', '#F0FBFF'] },
  { id: 'pk-s-booster', category: 'pokemon', kind: 'box', name: 'Booster Box', label: '36 packs', price: 189, stock: 12, hue: ['#FFCB3D', '#FFE9A8'] },
  { id: 'pk-s-etb', category: 'pokemon', kind: 'box', name: 'Collector Chest', label: '9 packs + promo', price: 64, stock: 20, hue: ['#1FB6FF', '#9BF0FF'] },
  { id: 'pk-s-vintage', category: 'pokemon', kind: 'box', name: 'Vintage Sealed Box', label: '1st print · 36 packs', price: 2400, stock: 1, hue: ['#FF3D6E', '#FFB1C8'] },

  // ── Baseball ──────────────────────────────────────────────────
  { id: 'bb-marlow', category: 'baseball', kind: 'card', style: 'sport', name: 'Diego Marlow', set: "'26 Rookie #24", position: 'SS', team: 'Harbor City Gulls', number: 24, rookie: true, grade: 'Raw · NM', price: 85, stock: 4, hue: ['#E8473C', '#FFD9C2'] },
  { id: 'bb-kask', category: 'baseball', kind: 'card', style: 'sport', name: 'Tommy Kask', set: "'26 Auto /50", position: 'RHP', team: 'Red Mesa Drillers', number: 41, grade: 'On-card auto', price: 210, stock: 1, hue: ['#C23B22', '#F6C28B'] },
  { id: 'bb-okafor', category: 'baseball', kind: 'card', style: 'sport', name: 'Eli Okafor', set: "'25 Base #112", position: 'CF', team: 'Northgate Foxes', number: 7, grade: 'Raw · NM', price: 12, stock: 30, hue: ['#2F6FDB', '#BFD7FF'] },
  { id: 'bb-g-delgado', category: 'baseball', kind: 'slab', style: 'sport', name: 'Ray Delgado', set: "'89 Rookie", position: '1B', team: 'Harbor City Gulls', number: 33, rookie: true, grader: 'PSA', grade: '9', price: 640, stock: 1, hue: ['#E8473C', '#FFE6C9'] },
  { id: 'bb-g-hale', category: 'baseball', kind: 'slab', style: 'sport', name: 'Gus Hale', set: "'61 Vintage", position: 'C', team: 'Old Port Mariners', number: 8, grader: 'SGC', grade: '7', price: 1150, stock: 1, hue: ['#7C5A3A', '#F2E2C4'] },
  { id: 'bb-s-hobby', category: 'baseball', kind: 'box', name: 'Baseball Hobby Box', label: '20 packs · 1 auto', price: 145, stock: 10, hue: ['#E8473C', '#FFD9C2'] },
  { id: 'bb-s-blaster', category: 'baseball', kind: 'box', name: 'Baseball Blaster', label: '7 packs', price: 30, stock: 35, hue: ['#2F6FDB', '#BFD7FF'] },

  // ── Basketball ────────────────────────────────────────────────
  { id: 'bk-vance', category: 'basketball', kind: 'card', style: 'sport', name: 'Andre Vance', set: "'26 Rookie Patch /99", position: 'G', team: 'Bayview Comets', number: 3, rookie: true, grade: 'Raw · NM', price: 380, stock: 1, hue: ['#FF7A1A', '#FFD08A'] },
  { id: 'bk-mensah', category: 'basketball', kind: 'card', style: 'sport', name: 'Kofi Mensah', set: "'26 Silver /199", position: 'F', team: 'Lakeshore Kings', number: 11, grade: 'Raw · NM', price: 95, stock: 3, hue: ['#7A3CFF', '#D7C2FF'] },
  { id: 'bk-reyes', category: 'basketball', kind: 'card', style: 'sport', name: 'Luis Reyes', set: "'25 Base #48", position: 'C', team: 'Desert Sun', number: 50, grade: 'Raw · NM', price: 8, stock: 40, hue: ['#FFB000', '#FFF0C2'] },
  { id: 'bk-g-cole', category: 'basketball', kind: 'slab', style: 'sport', name: 'Marcus Cole', set: "'03 Rookie", position: 'F', team: 'Bayview Comets', number: 23, rookie: true, grader: 'BGS', grade: '9.5', price: 2200, stock: 1, hue: ['#FF7A1A', '#FFE2C2'] },
  { id: 'bk-g-park', category: 'basketball', kind: 'slab', style: 'sport', name: 'Jin Park', set: "'18 Auto /25", position: 'G', team: 'Lakeshore Kings', number: 1, grader: 'PSA', grade: '10', price: 860, stock: 1, hue: ['#7A3CFF', '#E3D6FF'] },
  { id: 'bk-s-hobby', category: 'basketball', kind: 'box', name: 'Basketball Hobby Box', label: '12 packs · 3 hits', price: 320, stock: 6, hue: ['#FF7A1A', '#FFD08A'] },
  { id: 'bk-s-mega', category: 'basketball', kind: 'box', name: 'Basketball Mega Box', label: '10 packs', price: 60, stock: 18, hue: ['#7A3CFF', '#D7C2FF'] },

  // ── Hockey ────────────────────────────────────────────────────
  { id: 'hk-lahtinen', category: 'hockey', kind: 'card', style: 'sport', name: 'Mikko Lahtinen', set: "'26 Rookie #201", position: 'C', team: 'Glacier City Wolves', number: 91, rookie: true, grade: 'Raw · NM', price: 120, stock: 2, hue: ['#5FC8FF', '#E1F5FF'] },
  { id: 'hk-barre', category: 'hockey', kind: 'card', style: 'sport', name: 'Jean-Luc Barré', set: "'26 Goalie Auto", position: 'G', team: 'Riverbend Voyageurs', number: 31, grade: 'On-card auto', price: 175, stock: 1, hue: ['#C8102E', '#FFD6DC'] },
  { id: 'hk-sorensen', category: 'hockey', kind: 'card', style: 'sport', name: 'Nils Sorensen', set: "'25 Base #77", position: 'D', team: 'Iron Range Miners', number: 4, grade: 'Raw · NM', price: 6, stock: 50, hue: ['#4A5A6A', '#D9E2EA'] },
  { id: 'hk-g-dubois', category: 'hockey', kind: 'slab', style: 'sport', name: 'Remy Dubois', set: "'05 Rookie", position: 'RW', team: 'Riverbend Voyageurs', number: 87, rookie: true, grader: 'PSA', grade: '9', price: 980, stock: 1, hue: ['#C8102E', '#FFE2E6'] },
  { id: 'hk-g-kowal', category: 'hockey', kind: 'slab', style: 'sport', name: 'Pete Kowal', set: "'79 Vintage", position: 'C', team: 'Glacier City Wolves', number: 99, grader: 'SGC', grade: '8', price: 1450, stock: 1, hue: ['#5FC8FF', '#E9F8FF'] },
  { id: 'hk-s-hobby', category: 'hockey', kind: 'box', name: 'Hockey Hobby Box', label: '24 packs · 6 rookies', price: 135, stock: 8, hue: ['#5FC8FF', '#E1F5FF'] },
  { id: 'hk-s-blaster', category: 'hockey', kind: 'box', name: 'Hockey Blaster', label: '6 packs', price: 28, stock: 25, hue: ['#C8102E', '#FFD6DC'] },

  // ── Magic ─────────────────────────────────────────────────────
  { id: 'mg-leviathan', category: 'magic', kind: 'card', style: 'magic', name: 'Ashen Leviathan', set: 'Mythic · Foil', mana: [U, B, B], typeLine: 'Creature — Leviathan', rules: 'When this enters, each opponent sacrifices a creature.', pt: '7/7', grade: 'Raw · NM', price: 64, stock: 3, hue: ['#3E8BD8', '#C9E2FF'] },
  { id: 'mg-hollowmoon', category: 'magic', kind: 'card', style: 'magic', name: 'Sigil of the Hollow Moon', set: 'Rare · Foil', mana: [W, W], typeLine: 'Legendary Artifact', rules: 'Creatures you control get +1/+1 and have vigilance.', grade: 'Raw · NM', price: 38, stock: 5, hue: ['#E8DDB0', '#FFFFFF'] },
  { id: 'mg-tithe', category: 'magic', kind: 'card', style: 'magic', name: 'Verdant Tithe', set: 'Uncommon', mana: [G], typeLine: 'Sorcery', rules: 'Search your library for a basic land and put it onto the battlefield.', grade: 'Raw · NM', price: 4, stock: 60, hue: ['#3F9E5A', '#CFF2B8'] },
  { id: 'mg-oracle', category: 'magic', kind: 'card', style: 'magic', name: 'Glassmind Oracle', set: 'Mythic · Borderless', mana: [U, R], typeLine: 'Creature — Human Wizard', rules: 'Whenever you cast an instant, draw a card.', pt: '2/3', grade: 'Raw · NM', price: 120, stock: 1, hue: ['#7A5CFF', '#FFC2A8'] },
  { id: 'mg-g-bastion', category: 'magic', kind: 'slab', style: 'magic', name: 'Duskwall Bastion', set: 'Alpha-era land', mana: [], typeLine: 'Land', rules: 'Add one mana of any colour.', grader: 'BGS', grade: '9', price: 3100, stock: 1, hue: ['#8A6A3A', '#F2DDB0'] },
  { id: 'mg-g-pyre', category: 'magic', kind: 'slab', style: 'magic', name: 'Pyre Sovereign', set: 'Mythic · Foil', mana: [R, R], typeLine: 'Legendary Creature — Dragon', rules: 'Flying, haste.', pt: '6/6', grader: 'CGC', grade: '9.5', price: 450, stock: 1, hue: ['#E2553A', '#FFD2A8'] },
  { id: 'mg-s-collector', category: 'magic', kind: 'box', name: 'Collector Booster Box', label: '12 packs', price: 260, stock: 5, hue: ['#B57BFF', '#E6D6FF'] },
  { id: 'mg-s-draft', category: 'magic', kind: 'box', name: 'Play Booster Box', label: '36 packs', price: 140, stock: 9, hue: ['#3E8BD8', '#C9E2FF'] },
  { id: 'mg-s-commander', category: 'magic', kind: 'box', name: 'Commander Deck', label: '100 cards · ready to play', price: 45, stock: 16, hue: ['#3F9E5A', '#CFF2B8'] },
]

export const itemsIn = (category) => ITEMS.filter((i) => !category || i.category === category)
export const countIn = (category) => itemsIn(category).length

export const GRADED = ITEMS.filter((i) => i.kind === 'slab')
export const SEALED = ITEMS.filter((i) => i.kind === 'box')

// This week's drop: a mix from every category.
const DROP_IDS = ['pk-emberwing', 'bk-vance', 'mg-oracle', 'bb-marlow', 'hk-lahtinen', 'pk-tidecaller', 'mg-leviathan', 'bk-mensah', 'hk-barre']
export const DROP_ITEMS = DROP_IDS.map((id) => ITEMS.find((i) => i.id === id))

// Cards in the home-page shuffling deck.
export const SHUFFLE_DECK = ['pk-emberwing', 'bb-marlow', 'mg-oracle', 'bk-vance', 'hk-lahtinen', 'pk-voltmoth', 'mg-leviathan', 'bb-kask', 'bk-mensah', 'hk-barre']
  .map((id) => ITEMS.find((i) => i.id === id))

export const DROP = { number: '014', name: 'Vault Series', opensInSeconds: 2 * 3600 + 14 * 60 + 33 }

export const UPCOMING = [
  { no: '015', name: 'Rookie Season', date: 'Sun 15 Nov', items: 42 },
  { no: '016', name: 'Vintage Vault Pull', date: 'Sun 22 Nov', items: 18 },
  { no: '017', name: 'Black Friday Grails', date: 'Fri 27 Nov', items: 64 },
  { no: '018', name: 'Commander Night', date: 'Sun 6 Dec', items: 30 },
]

// Cards that rotate through the 3D hero — one from each category.
// colors = [accent, highlight, deep]
export const HERO_CARDS = [
  {
    id: 'emberwing', style: 'monster', category: 'Pokémon',
    name: 'Emberwing', hp: 210, set: 'HV-007/120',
    type: 'EMBER · VAULT EXCLUSIVE · 1ST PRINT',
    colors: ['#FF5A1F', '#FFC36B', '#3A120A'],
    attacks: [['Kiln Burst', '120'], ['Afterglow', '60']],
    grade: 'PSA 10', price: 1240, change: '▲ 4.2% 7d',
  },
  {
    id: 'marlow', style: 'sport', category: 'Baseball',
    name: 'Diego Marlow', number: 24, position: 'SHORTSTOP', team: 'HARBOR CITY GULLS', set: "'26 ROOKIE #24",
    colors: ['#E8473C', '#FFD9C2', '#3A0E0A'],
    stats: [['AVG', '.312'], ['HR', '38'], ['RBI', '104']],
    rookie: true, grade: 'PSA 10', price: 420, change: '▲ 9.4% 7d',
  },
  {
    id: 'vance', style: 'sport', category: 'Basketball',
    name: 'Andre Vance', number: 3, position: 'GUARD', team: 'BAYVIEW COMETS', set: "'26 ROOKIE PATCH /99",
    colors: ['#FF7A1A', '#FFD08A', '#3A1A06'],
    stats: [['PTS', '27.4'], ['AST', '8.1'], ['REB', '5.6']],
    rookie: true, grade: 'BGS 9.5', price: 380, change: '▲ 3.1% 7d',
  },
  {
    id: 'lahtinen', style: 'sport', category: 'Hockey',
    name: 'Mikko Lahtinen', number: 91, position: 'CENTER', team: 'GLACIER CITY WOLVES', set: "'26 ROOKIE #201",
    colors: ['#5FC8FF', '#E1F5FF', '#06233A'],
    stats: [['G', '44'], ['A', '57'], ['PTS', '101']],
    rookie: true, grade: 'PSA 9', price: 120, change: '▼ 0.8% 7d',
  },
  {
    id: 'leviathan', style: 'magic', category: 'Magic',
    name: 'Ashen Leviathan', mana: [U, B, B], typeLine: 'Creature — Leviathan',
    rules: 'When Ashen Leviathan enters, each opponent sacrifices a creature. Ward 3.',
    flavor: 'The tide went out and did not return.', pt: '7/7', set: 'MYTHIC · FOIL',
    colors: ['#3E8BD8', '#C9E2FF', '#0A1730'],
    grade: 'CGC 9.5', price: 64, change: '▲ 2.4% 7d',
  },
]
