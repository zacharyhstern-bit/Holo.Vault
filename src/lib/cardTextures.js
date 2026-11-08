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

export function makeFront({ name, hp, set, type, colors, attacks }) {
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
