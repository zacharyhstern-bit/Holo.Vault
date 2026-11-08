import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { holoVertex, holoFragment } from '../lib/holoShader'
import { makeFront, makeBack } from '../lib/cardTextures'

export const HOLD = 4.2 // seconds each card holds centre stage
const TRAVEL = 1.7 // seconds for a card swap
const CARD_W = 2.5
const CARD_H = 3.5
const RADIUS = 0.14
const damp = THREE.MathUtils.damp
const smooth = THREE.MathUtils.smoothstep
const mod = (n, m) => ((n % m) + m) % m
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const now = () => performance.now() / 1000

function roundedCardGeometry() {
  const s = new THREE.Shape()
  const x = -CARD_W / 2
  const y = -CARD_H / 2
  const r = RADIUS
  s.moveTo(x + r, y)
  s.lineTo(x + CARD_W - r, y)
  s.quadraticCurveTo(x + CARD_W, y, x + CARD_W, y + r)
  s.lineTo(x + CARD_W, y + CARD_H - r)
  s.quadraticCurveTo(x + CARD_W, y + CARD_H, x + CARD_W - r, y + CARD_H)
  s.lineTo(x + r, y + CARD_H)
  s.quadraticCurveTo(x, y + CARD_H, x, y + CARD_H - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return new THREE.ShapeGeometry(s, 16)
}

function holoMaterial(map, mask) {
  return new THREE.ShaderMaterial({
    vertexShader: holoVertex,
    fragmentShader: holoFragment,
    toneMapped: false,
    transparent: true,
    uniforms: {
      uMap: { value: map },
      uMask: { value: mask },
      uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uHover: { value: 0 },
      uIntensity: { value: 1 },
      uOpacity: { value: 1 },
    },
  })
}

/* ── One card in the carousel ─────────────────────────────────────
   Its place on the stage comes from `rel`: 0 = centre, +1 = waiting
   off to the right, -1 = leaving to the left. Pointer parallax, scroll
   spin and click-flips only apply while it is the focused card.      */
function Card({ data, index, count, deck, pointer, scroll, geometry, backTex, onHoverChange }) {
  const group = useRef()
  const hover = useRef(0)
  const hovered = useRef(false)
  const flips = useRef(0)
  const punch = useRef(0)
  const par = useRef({ x: 0, y: 0 })

  const [front, back] = useMemo(() => {
    const [map, mask] = makeFront(data)
    return [holoMaterial(map, mask), holoMaterial(backTex[0], backTex[1])]
  }, [data, backTex])

  useEffect(
    () => () => {
      front.uniforms.uMap.value.dispose()
      front.uniforms.uMask.value.dispose()
      front.dispose()
      back.dispose()
    },
    [front, back]
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const p = pointer.current
    const s = scroll.current

    let rel = mod(index - deck.current.pos, count)
    if (rel > count / 2) rel -= count
    const a = Math.abs(rel)
    const focus = 1 - smooth(a, 0, 0.7)
    const vis = 1 - smooth(a, 0.75, 1.3)

    g.visible = vis > 0.002
    if (!g.visible) {
      hovered.current = false
      return
    }

    // smoothed "personal" motion: pointer tilt + scroll spin + flips
    par.current.y = damp(par.current.y, p.x * 0.55 + s * Math.PI * 2 + flips.current * Math.PI, 5, dt)
    par.current.x = damp(par.current.x, -p.y * 0.4, 5, dt)

    // stage path: arrive from the right/back, exit to the left/back
    g.rotation.y = -rel * 1.25 + par.current.y * focus
    g.rotation.x = par.current.x * focus + Math.sin(t * 0.7 + index) * 0.05
    g.rotation.z = rel * 0.22 - p.x * 0.06 * focus
    g.position.x = rel * 3.4 + p.x * 0.25 * focus
    g.position.y = Math.sin(t * 0.9 + index * 1.3) * 0.09 + p.y * 0.12 * focus - a * 0.35
    g.position.z = -a * 2.6

    hover.current = damp(hover.current, hovered.current ? 1 : 0, 6, dt)
    punch.current = damp(punch.current, 0, 7, dt)
    g.scale.setScalar((0.8 + 0.2 * focus) * (1 + hover.current * 0.04 + punch.current * 0.08))

    for (const m of [front, back]) {
      m.uniforms.uTime.value = t
      m.uniforms.uHover.value = hover.current
      m.uniforms.uOpacity.value = vis
      m.uniforms.uPointer.value.set(p.x, p.y)
    }
  })

  const isActive = () => deck.current.active === index

  const handlers = {
    onPointerOver: (e) => {
      e.stopPropagation()
      hovered.current = true
      if (isActive()) deck.current.hovering = true
      onHoverChange?.(isActive() ? 'Flip' : 'View')
    },
    onPointerOut: () => {
      hovered.current = false
      deck.current.hovering = false
      onHoverChange?.(null)
    },
    onClick: (e) => {
      e.stopPropagation()
      if (isActive()) {
        flips.current += 1
        punch.current = 1
      } else {
        deck.current.goTo(index)
      }
    },
  }

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={front} position-z={0.004} {...handlers} />
      <mesh geometry={geometry} material={back} rotation-y={Math.PI} position-z={-0.004} {...handlers} />
    </group>
  )
}

/* ── Dust that takes on the colour of the active card ─────────────── */
function EmberDust({ count = 700, pointer, deck, cards }) {
  const ref = useRef()
  const target = useMemo(() => new THREE.Color(), [])

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 2.4 + Math.pow(Math.random(), 1.6) * 3.2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5
      pos[i * 3 + 2] = Math.sin(a) * r * 0.6
      scale[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    return g
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPx: { value: Math.min(window.devicePixelRatio, 2) },
          uColor: { value: new THREE.Color(cards[0].colors[0]) },
        },
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPx;
          attribute float aScale;
          varying float vA;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * 0.4 + aScale * 20.0) * 0.15;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (2.0 + aScale * 5.0) * uPx * (6.0 / -mv.z);
            vA = 0.25 + 0.75 * aScale;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vA;
            gl_FragColor = vec4(uColor, a * 0.8);
          }`,
      }),
    [cards]
  )

  useEffect(() => () => (geometry.dispose(), material.dispose()), [geometry, material])

  useFrame((state, dt) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    target.set(cards[deck.current.active].colors[0])
    material.uniforms.uColor.value.lerp(target, 1 - Math.exp(-2.5 * dt))
    if (ref.current) {
      ref.current.rotation.y += dt * 0.05
      ref.current.rotation.x = damp(ref.current.rotation.x, pointer.current.y * 0.15, 2, dt)
    }
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

/* ── Conductor: autoplay timer, eased swaps, idle "autopilot" ──────── */
function Deck({ cards, rawPointer, scroll, onActiveChange, onHoverChange, progressRef, controlRef }) {
  const pointer = useRef({ x: 0, y: 0 })
  const geometry = useMemo(roundedCardGeometry, [])
  const backTex = useMemo(() => makeBack(), [])
  const N = cards.length

  const deck = useRef({ pos: 0, from: 0, to: 0, start: -1, timer: 0, active: 0, hovering: false, goTo: () => {} })

  useEffect(() => {
    const d = deck.current
    const startSwap = (to) => {
      d.from = d.pos
      d.to = to
      d.start = now()
      d.timer = 0
    }
    d.goTo = (i) => {
      let delta = mod(i - mod(d.to, N), N)
      if (delta > N / 2) delta -= N
      if (delta !== 0) startSwap(d.to + delta)
    }
    d.next = () => startSwap(d.to + 1)
    d.prev = () => startSwap(d.to - 1)
    if (controlRef) controlRef.current = d
  }, [N, controlRef])

  useEffect(
    () => () => {
      geometry.dispose()
      backTex.forEach((t) => t.dispose())
    },
    [geometry, backTex]
  )

  useFrame((state, dt) => {
    const d = deck.current
    const t = state.clock.elapsedTime

    // Autopilot: when nobody touches the mouse for 2s, the card sways by itself.
    const raw = rawPointer.current
    const idle = THREE.MathUtils.clamp((now() - raw.last - 2) / 1.5, 0, 1)
    pointer.current.x = raw.x * (1 - idle) + Math.sin(t * 0.45) * 0.45 * idle
    pointer.current.y = raw.y * (1 - idle) + Math.sin(t * 0.31 + 1) * 0.3 * idle

    const swapping = d.start >= 0
    if (!swapping && !d.hovering && scroll.current < 0.02) d.timer += dt
    if (!swapping && d.timer >= HOLD) d.next()

    if (d.start >= 0) {
      const k = Math.min(1, (now() - d.start) / TRAVEL)
      d.pos = d.from + (d.to - d.from) * easeInOutCubic(k)
      if (k >= 1) {
        d.pos = d.to
        d.start = -1
      }
    }

    const idx = mod(Math.round(d.pos), N)
    if (idx !== d.active) {
      d.active = idx
      onActiveChange?.(idx)
    }

    if (progressRef?.current) {
      progressRef.current.style.transform = `scaleX(${d.start >= 0 ? 0 : Math.min(1, d.timer / HOLD)})`
    }
  })

  return (
    <>
      {cards.map((c, i) => (
        <Card
          key={c.id}
          data={c}
          index={i}
          count={N}
          deck={deck}
          pointer={pointer}
          scroll={scroll}
          geometry={geometry}
          backTex={backTex}
          onHoverChange={onHoverChange}
        />
      ))}
      <EmberDust pointer={pointer} deck={deck} cards={cards} />
    </>
  )
}

/* ── Public component ─────────────────────────────────────────────── */
export default function HoloCard({ cards, scroll, onActiveChange, onHoverChange, progressRef, controlRef }) {
  const rawPointer = useRef({ x: 0, y: 0, last: -Infinity })
  const [fontsReady, setFontsReady] = useState(false)

  // Card faces are drawn with web fonts, so wait for them before painting.
  useEffect(() => {
    let alive = true
    Promise.all([
      document.fonts.load('800 76px "Bricolage Grotesque"'),
      document.fonts.load('500 26px "IBM Plex Mono"'),
    ])
      .catch(() => {})
      .finally(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return // touch screens keep the autopilot
      const r = rawPointer.current
      r.x = (e.clientX / window.innerWidth) * 2 - 1
      r.y = -((e.clientY / window.innerHeight) * 2 - 1)
      r.last = now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      {fontsReady && (
        <Deck
          cards={cards}
          rawPointer={rawPointer}
          scroll={scroll}
          onActiveChange={onActiveChange}
          onHoverChange={onHoverChange}
          progressRef={progressRef}
          controlRef={controlRef}
        />
      )}
    </Canvas>
  )
}
