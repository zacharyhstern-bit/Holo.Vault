// Placeholder catalogue with original names and art.
// Replace with your real inventory (or fetch it from Shopify/Stripe later).

// Cards that rotate through the 3D hero. colors = [accent, highlight, deep]
export const HERO_CARDS = [
  {
    id: 'emberwing', name: 'Emberwing', hp: 210, set: 'HV-007/120',
    type: 'EMBER · VAULT EXCLUSIVE · 1ST PRINT',
    colors: ['#FF5A1F', '#FFC36B', '#3A120A'],
    attacks: [['Kiln Burst', '120'], ['Afterglow', '60']],
    grade: 'PSA 10', price: 1240, change: '▲ 4.2% 7d',
  },
  {
    id: 'tidecaller', name: 'Tidecaller', hp: 180, set: 'HV-031/120',
    type: 'TIDE · ALTERNATE ART',
    colors: ['#1FB6FF', '#9BF0FF', '#06243A'],
    attacks: [['Undertow', '90'], ['Rip Current', '140']],
    grade: 'CGC 9.5', price: 680, change: '▲ 1.8% 7d',
  },
  {
    id: 'mosswarden', name: 'Moss Warden', hp: 230, set: 'HV-064/120',
    type: 'GROVE · FULL ART',
    colors: ['#3FD08A', '#E4FF7A', '#0D2A18'],
    attacks: [['Root Bind', '70'], ['Canopy Crush', '130']],
    grade: 'BGS 9.5', price: 412, change: '▼ 0.6% 7d',
  },
  {
    id: 'voltmoth', name: 'Voltmoth', hp: 150, set: 'HV-088/120',
    type: 'STORM · REVERSE HOLO',
    colors: ['#B57BFF', '#FFE66B', '#1E0F3A'],
    attacks: [['Static Dust', '40'], ['Arc Flare', '110']],
    grade: 'PSA 9', price: 295, change: '▲ 6.1% 7d',
  },
  {
    id: 'duskfang', name: 'Duskfang', hp: 240, set: 'HV-112/120',
    type: 'SHADE · SECRET RARE',
    colors: ['#FF3D6E', '#FFB1C8', '#2A0812'],
    attacks: [['Night Snap', '80'], ['Eclipse Howl', '160']],
    grade: 'PSA 10', price: 1890, change: '▲ 2.4% 7d',
  },
]

export const DROP = { number: '014', name: 'Vault Series', opensInSeconds: 2 * 3600 + 14 * 60 + 33 }

export const DROP_ITEMS = [
  { id: 'd1', kind: 'card', name: 'Emberwing', set: 'HV-007', grade: 'PSA 10', price: 1240, stock: 1, hue: ['#FF5A1F', '#FFC36B'] },
  { id: 'd2', kind: 'card', name: 'Tidecaller', set: 'HV-031', grade: 'CGC 9.5', price: 680, stock: 3, hue: ['#1FB6FF', '#9BF0FF'] },
  { id: 'd3', kind: 'card', name: 'Moss Warden', set: 'HV-064', grade: 'Raw · NM', price: 142, stock: 9, hue: ['#3FD08A', '#E4FF7A'] },
  { id: 'd4', kind: 'card', name: 'Voltmoth', set: 'HV-088', grade: 'Raw · NM', price: 64, stock: 14, hue: ['#B57BFF', '#FFE66B'] },
  { id: 'd5', kind: 'card', name: 'Duskfang', set: 'HV-112', grade: 'PSA 10', price: 1890, stock: 1, hue: ['#FF3D6E', '#FFB1C8'] },
  { id: 'd6', kind: 'card', name: 'Cinder Kit', set: 'HV-009', grade: 'Raw · LP', price: 18, stock: 22, hue: ['#FF8A3D', '#FFE0B0'] },
]

export const UPCOMING = [
  { no: '015', name: 'Tide & Thunder', date: 'Sun 15 Nov', items: 42 },
  { no: '016', name: 'Vintage Vault Pull', date: 'Sun 22 Nov', items: 18 },
  { no: '017', name: 'Black Friday Grails', date: 'Fri 27 Nov', items: 64 },
  { no: '018', name: 'Sealed Holiday Stack', date: 'Sun 6 Dec', items: 30 },
]

export const GRADED = [
  { id: 'g1', kind: 'slab', name: 'Emberwing', set: 'HV-007', grader: 'PSA', grade: '10', price: 1240, hue: ['#FF5A1F', '#FFC36B'] },
  { id: 'g2', kind: 'slab', name: 'Duskfang', set: 'HV-112', grader: 'PSA', grade: '10', price: 1890, hue: ['#FF3D6E', '#FFB1C8'] },
  { id: 'g3', kind: 'slab', name: 'Tidecaller', set: 'HV-031', grader: 'CGC', grade: '9.5', price: 680, hue: ['#1FB6FF', '#9BF0FF'] },
  { id: 'g4', kind: 'slab', name: 'Moss Warden', set: 'HV-064', grader: 'BGS', grade: '9.5', price: 412, hue: ['#3FD08A', '#E4FF7A'] },
  { id: 'g5', kind: 'slab', name: 'Voltmoth', set: 'HV-088', grader: 'PSA', grade: '9', price: 295, hue: ['#B57BFF', '#FFE66B'] },
  { id: 'g6', kind: 'slab', name: 'Frostling', set: 'HV-045', grader: 'CGC', grade: '10', price: 520, hue: ['#7FD8FF', '#F0FBFF'] },
  { id: 'g7', kind: 'slab', name: 'Cinder Kit', set: 'HV-009', grader: 'BGS', grade: '10', price: 960, hue: ['#FF8A3D', '#FFE0B0'] },
  { id: 'g8', kind: 'slab', name: 'Gloomcap', set: 'HV-077', grader: 'PSA', grade: '8', price: 88, hue: ['#9A7BFF', '#D9CCFF'] },
  { id: 'g9', kind: 'slab', name: 'Ironhorn', set: 'HV-101', grader: 'CGC', grade: '9', price: 174, hue: ['#A8B4C0', '#F2F4F7'] },
]

export const SEALED = [
  { id: 's1', kind: 'box', name: 'Vault Series Booster Box', label: '36 packs', price: 189, stock: 12, hue: ['#FF5A1F', '#FFC36B'] },
  { id: 's2', kind: 'box', name: 'Collector Chest', label: '9 packs + promo', price: 64, stock: 20, hue: ['#1FB6FF', '#9BF0FF'] },
  { id: 's3', kind: 'box', name: 'Booster Bundle', label: '6 packs', price: 32, stock: 40, hue: ['#3FD08A', '#E4FF7A'] },
  { id: 's4', kind: 'box', name: 'Premium Tin', label: '4 packs + coin', price: 28, stock: 35, hue: ['#B57BFF', '#FFE66B'] },
  { id: 's5', kind: 'box', name: 'Vintage Sealed Box', label: '1st print · 36 packs', price: 2400, stock: 1, hue: ['#FF3D6E', '#FFB1C8'] },
  { id: 's6', kind: 'box', name: 'Mystery Vault Pack', label: '1 hit guaranteed', price: 49, stock: 60, hue: ['#FF8A3D', '#FFE0B0'] },
]
