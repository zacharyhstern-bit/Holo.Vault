import * as THREE from 'three'

// Card faces are drawn procedurally on 2D canvases so the project ships with
// zero image assets. Each face has a colour map plus a greyscale foil mask:
// white = full holographic foil, black = matte ink.
// Swap these for your own scanned product photography when you go live.

const W = 1000
const H = 1400

function canvas() {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  return [c, c.getContext('2d')]
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

const ART = { x: 72, y: 190, w: 856, h: 620 }

function drawSigil(ctx, cx, cy, scale, stroke) {
  // An original abstract "ember wing" mark: mirrored crescents + core.
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.strokeStyle = stroke
  ctx.lineWidth = 6
  for (let side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      const o = i * 34
      ctx.moveTo(0, 40 - o * 0.4)
      ctx.bezierCurveTo(side * (120 + o), -60 - o, side * (260 + o * 0.6), 40 - o, side * (300 - o * 0.8), 180 - o * 0.3)
      ctx.stroke()
    }
  }
  ctx.beginPath()
  ctx.arc(0, 30, 46, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, -120)
  ctx.lineTo(0, 210)
  ctx.stroke()
  ctx.restore()
}

export function makeFront(card) {
  if (card.style === 'sport') return makeSport(card)
  if (card.style === 'magic') return makeMagic(card)
  return makeMonster(card)
}

function makeMonster({ name, hp, set, type, colors, attacks }) {
  const [accent, light, deep] = colors
  const [c, ctx] = canvas()
  const [m, mx] = canvas()

  // ── colour map ───────────────────────────────────────────────
  ctx.fillStyle = '#16130F'
  ctx.fillRect(0, 0, W, H)

  // gilded frame
  const frame = ctx.createLinearGradient(0, 0, W, H)
  frame.addColorStop(0, accent)
  frame.addColorStop(0.5, light)
  frame.addColorStop(1, accent)
  ctx.lineWidth = 34
  ctx.strokeStyle = frame
  roundRect(ctx, 17, 17, W - 34, H - 34, 48)
  ctx.stroke()

  // header
  ctx.fillStyle = '#F2ECDF'
  ctx.font = '800 76px "Bricolage Grotesque", sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, 76, 150)
  ctx.font = '500 34px "IBM Plex Mono", monospace'
  ctx.textAlign = 'right'
  ctx.fillText(`HP ${hp}`, W - 76, 146)
  ctx.textAlign = 'left'

  // art window
  const g = ctx.createRadialGradient(W / 2, ART.y + ART.h * 0.55, 20, W / 2, ART.y + ART.h * 0.5, ART.w * 0.7)
  g.addColorStop(0, light)
  g.addColorStop(0.25, accent)
  g.addColorStop(0.7, deep)
  g.addColorStop(1, '#0B0A08')
  ctx.save()
  roundRect(ctx, ART.x, ART.y, ART.w, ART.h, 18)
  ctx.clip()
  ctx.fillStyle = g
  ctx.fillRect(ART.x, ART.y, ART.w, ART.h)
  ctx.globalAlpha = 0.35
  ctx.strokeStyle = '#FFE2B8'
  ctx.lineWidth = 2
  for (let r = 40; r < 700; r += 38) {
    ctx.beginPath()
    ctx.arc(W / 2, ART.y + ART.h * 0.55, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  drawSigil(ctx, W / 2, ART.y + ART.h * 0.45, 1, '#0B0A08')
  ctx.restore()

  // type strip
  ctx.fillStyle = accent
  ctx.fillRect(ART.x, ART.y + ART.h + 22, ART.w, 6)
  ctx.font = '500 26px "IBM Plex Mono", monospace'
  ctx.fillStyle = '#8A8478'
  ctx.fillText(type, ART.x, ART.y + ART.h + 72)

  // attacks
  attacks.forEach(([a, dmg], i) => {
    const y = ART.y + ART.h + 170 + i * 120
    ctx.fillStyle = '#F2ECDF'
    ctx.font = '600 54px "Bricolage Grotesque", sans-serif'
    ctx.fillText(a, ART.x, y)
    ctx.textAlign = 'right'
    ctx.font = '800 60px "Bricolage Grotesque", sans-serif'
    ctx.fillText(dmg, ART.x + ART.w, y)
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(242,236,223,0.12)'
    ctx.fillRect(ART.x, y + 34, ART.w, 2)
  })

  // footer
  ctx.font = '500 24px "IBM Plex Mono", monospace'
  ctx.fillStyle = '#8A8478'
  ctx.fillText(`${set}  ★  HOLO/VAULT`, ART.x, H - 70)

  // ── foil mask ────────────────────────────────────────────────
  mx.fillStyle = '#000'
  mx.fillRect(0, 0, W, H)
  mx.lineWidth = 34
  mx.strokeStyle = '#999'
  roundRect(mx, 17, 17, W - 34, H - 34, 48)
  mx.stroke()
  mx.save()
  roundRect(mx, ART.x, ART.y, ART.w, ART.h, 18)
  mx.clip()
  mx.fillStyle = '#fff'
  mx.fillRect(ART.x, ART.y, ART.w, ART.h)
  drawSigil(mx, W / 2, ART.y + ART.h * 0.45, 1, '#000') // sigil stays matte
  mx.restore()
  mx.fillStyle = '#fff'
  mx.fillRect(ART.x, ART.y + ART.h + 22, ART.w, 6)

  return [toTex(c, true), toTex(m, false)]
}

function wrapText(ctx, text, x, y, maxW, lineH, maxLines = 6) {
  const words = text.split(' ')
  let line = ''
  let n = 0
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + n * lineH)
      line = w
      if (++n >= maxLines) return
    } else line = test
  }
  if (line) ctx.fillText(line, x, y + n * lineH)
}

/* ── Player card: baseball / basketball / hockey ─────────────────── */
function makeSport({ name, number, position, team, set, colors, stats, rookie }) {
  const [accent, light, deep] = colors
  const [c, ctx] = canvas()
  const [m, mx] = canvas()
  const PH = { x: 50, y: 50, w: W - 100, h: 960 }

  ctx.fillStyle = '#14110D'
  ctx.fillRect(0, 0, W, H)
  mx.fillStyle = '#000'
  mx.fillRect(0, 0, W, H)

  // photo area
  ctx.save()
  roundRect(ctx, PH.x, PH.y, PH.w, PH.h, 26)
  ctx.clip()
  const g = ctx.createLinearGradient(0, PH.y, PH.w * 0.6, PH.y + PH.h)
  g.addColorStop(0, light)
  g.addColorStop(0.45, accent)
  g.addColorStop(1, deep)
  ctx.fillStyle = g
  ctx.fillRect(PH.x, PH.y, PH.w, PH.h)
  // speed stripes
  ctx.globalAlpha = 0.22
  ctx.fillStyle = '#0B0A08'
  for (let i = -12; i < 22; i++) {
    ctx.beginPath()
    const x0 = i * 70
    ctx.moveTo(x0, PH.y + PH.h)
    ctx.lineTo(x0 + 26, PH.y + PH.h)
    ctx.lineTo(x0 + 26 + 520, PH.y)
    ctx.lineTo(x0 + 520, PH.y)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  // giant outlined number
  ctx.font = '800 640px "Bricolage Grotesque", sans-serif'
  ctx.textAlign = 'right'
  ctx.lineWidth = 7
  ctx.strokeStyle = 'rgba(242,236,223,0.6)'
  ctx.strokeText(String(number), PH.x + PH.w - 20, PH.y + PH.h + 40)
  ctx.textAlign = 'left'
  // position chip
  ctx.fillStyle = 'rgba(11,10,8,0.82)'
  roundRect(ctx, PH.x + 40, PH.y + 40, 300, 66, 33)
  ctx.fill()
  ctx.fillStyle = '#F2ECDF'
  ctx.font = '500 30px "IBM Plex Mono", monospace'
  ctx.fillText(position, PH.x + 70, PH.y + 85)
  ctx.restore()

  // rookie badge
  if (rookie) {
    ctx.fillStyle = light
    ctx.beginPath()
    ctx.arc(PH.x + PH.w - 110, PH.y + 110, 74, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0B0A08'
    ctx.font = '800 64px "Bricolage Grotesque", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('RC', PH.x + PH.w - 110, PH.y + 132)
    ctx.textAlign = 'left'
  }

  // name plate
  ctx.fillStyle = accent
  ctx.fillRect(0, PH.y + PH.h + 30, W, H - (PH.y + PH.h + 30))
  ctx.fillStyle = '#0B0A08'
  ctx.font = '800 92px "Bricolage Grotesque", sans-serif'
  ctx.fillText(name.toUpperCase(), 60, PH.y + PH.h + 120)
  ctx.font = '500 28px "IBM Plex Mono", monospace'
  ctx.globalAlpha = 0.75
  ctx.fillText(`${team}  ·  ${set}`, 62, PH.y + PH.h + 172)
  ctx.globalAlpha = 1
  // stats row
  stats.forEach(([k, v], i) => {
    const x = 62 + i * 300
    const y = PH.y + PH.h + 300
    ctx.font = '500 26px "IBM Plex Mono", monospace'
    ctx.globalAlpha = 0.65
    ctx.fillText(k, x, y - 62)
    ctx.globalAlpha = 1
    ctx.font = '800 64px "Bricolage Grotesque", sans-serif'
    ctx.fillText(v, x, y + 12)
  })

  // foil: stripes area + badge
  mx.save()
  roundRect(mx, PH.x, PH.y, PH.w, PH.h, 26)
  mx.clip()
  mx.fillStyle = '#666'
  mx.fillRect(PH.x, PH.y, PH.w, PH.h)
  mx.fillStyle = '#fff'
  for (let i = -12; i < 22; i++) {
    mx.beginPath()
    const x0 = i * 70
    mx.moveTo(x0, PH.y + PH.h)
    mx.lineTo(x0 + 26, PH.y + PH.h)
    mx.lineTo(x0 + 26 + 520, PH.y)
    mx.lineTo(x0 + 520, PH.y)
    mx.fill()
  }
  mx.restore()
  if (rookie) {
    mx.fillStyle = '#fff'
    mx.beginPath()
    mx.arc(PH.x + PH.w - 110, PH.y + 110, 74, 0, Math.PI * 2)
    mx.fill()
  }

  return [toTex(c, true), toTex(m, false)]
}

/* ── Magic-style card ─────────────────────────────────────────────── */
function makeMagic({ name, mana, typeLine, rules, flavor, pt, set, colors }) {
  const [accent, light, deep] = colors
  const [c, ctx] = canvas()
  const [m, mx] = canvas()

  // outer frame
  const fg = ctx.createLinearGradient(0, 0, W, H)
  fg.addColorStop(0, light)
  fg.addColorStop(0.5, accent)
  fg.addColorStop(1, deep)
  ctx.fillStyle = fg
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#0F0D0A'
  roundRect(ctx, 40, 40, W - 80, H - 80, 30)
  ctx.fill()

  const bar = (y, h) => {
    ctx.fillStyle = `${accent}55`
    roundRect(ctx, 70, y, W - 140, h, 16)
    ctx.fill()
  }

  // title bar + mana
  bar(70, 110)
  ctx.fillStyle = '#F2ECDF'
  ctx.font = '800 64px "Bricolage Grotesque", sans-serif'
  ctx.fillText(name, 100, 148)
  mana.forEach((col, i) => {
    const x = W - 120 - (mana.length - 1 - i) * 62
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(x, 125, 26, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(11,10,8,0.5)'
    ctx.lineWidth = 3
    ctx.stroke()
  })

  // art
  const ART2 = { x: 70, y: 200, w: W - 140, h: 640 }
  ctx.save()
  roundRect(ctx, ART2.x, ART2.y, ART2.w, ART2.h, 16)
  ctx.clip()
  const ag = ctx.createRadialGradient(W / 2, ART2.y + ART2.h * 0.7, 20, W / 2, ART2.y + ART2.h * 0.6, ART2.w * 0.75)
  ag.addColorStop(0, light)
  ag.addColorStop(0.35, accent)
  ag.addColorStop(1, deep)
  ctx.fillStyle = ag
  ctx.fillRect(ART2.x, ART2.y, ART2.w, ART2.h)
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = '#F2ECDF'
  ctx.lineWidth = 2
  for (let r = 50; r < 800; r += 44) {
    ctx.beginPath()
    ctx.arc(W / 2, ART2.y + ART2.h * 0.75, r, Math.PI, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.restore()

  // type line
  bar(860, 84)
  ctx.fillStyle = '#F2ECDF'
  ctx.font = '600 40px "Bricolage Grotesque", sans-serif'
  ctx.fillText(typeLine, 100, 916)
  ctx.font = '500 24px "IBM Plex Mono", monospace'
  ctx.fillStyle = light
  ctx.textAlign = 'right'
  ctx.fillText(set, W - 100, 914)
  ctx.textAlign = 'left'

  // rules box
  ctx.fillStyle = 'rgba(242,236,223,0.07)'
  roundRect(ctx, 70, 964, W - 140, 340, 16)
  ctx.fill()
  ctx.fillStyle = '#F2ECDF'
  ctx.font = '400 40px "Bricolage Grotesque", sans-serif'
  wrapText(ctx, rules, 104, 1030, W - 220, 50, 3)
  if (flavor) {
    ctx.fillStyle = '#8A8478'
    ctx.font = 'italic 400 32px "Bricolage Grotesque", sans-serif'
    wrapText(ctx, flavor, 104, 1200, W - 360, 40, 2)
  }
  if (pt) {
    ctx.fillStyle = light
    roundRect(ctx, W - 250, 1220, 160, 90, 16)
    ctx.fill()
    ctx.fillStyle = '#0B0A08'
    ctx.font = '800 56px "Bricolage Grotesque", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(pt, W - 170, 1284)
    ctx.textAlign = 'left'
  }

  // foil: frame + art
  mx.fillStyle = '#000'
  mx.fillRect(0, 0, W, H)
  mx.fillStyle = '#bbb'
  mx.fillRect(0, 0, W, H)
  mx.fillStyle = '#000'
  roundRect(mx, 40, 40, W - 80, H - 80, 30)
  mx.fill()
  mx.fillStyle = '#fff'
  roundRect(mx, ART2.x, ART2.y, ART2.w, ART2.h, 16)
  mx.fill()

  return [toTex(c, true), toTex(m, false)]
}

export function makeBack() {
  const [c, ctx] = canvas()
  const [m, mx] = canvas()

  ctx.fillStyle = '#0F0D0A'
  ctx.fillRect(0, 0, W, H)
  mx.fillStyle = '#000'
  mx.fillRect(0, 0, W, H)

  for (let r = 30; r < 900; r += 26) {
    const a = 0.08 + 0.5 * Math.exp(-r / 260)
    ctx.strokeStyle = `rgba(255,90,31,${a})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2)
    ctx.stroke()
    mx.strokeStyle = `rgba(255,255,255,${a + 0.2})`
    mx.lineWidth = 3
    mx.beginPath()
    mx.arc(W / 2, H / 2, r, 0, Math.PI * 2)
    mx.stroke()
  }

  drawSigil(ctx, W / 2, H / 2 - 40, 0.9, '#FF5A1F')

  ctx.fillStyle = '#F2ECDF'
  ctx.font = '800 92px "Bricolage Grotesque", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('HOLO/VAULT', W / 2, H - 220)
  ctx.font = '500 26px "IBM Plex Mono", monospace'
  ctx.fillStyle = '#8A8478'
  ctx.fillText('GRADED · SEALED · AUTHENTICATED', W / 2, H - 160)

  ctx.lineWidth = 34
  ctx.strokeStyle = '#2A241C'
  roundRect(ctx, 17, 17, W - 34, H - 34, 48)
  ctx.stroke()

  return [toTex(c, true), toTex(m, false)]
}

function toTex(c, srgb) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  t.anisotropy = 8
  t.needsUpdate = true
  return t
}
