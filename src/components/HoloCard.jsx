import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { holoVertex, holoFragment } from '../lib/holoShader'
import { makeFront, makeBack } from '../lib/cardTextures'

const CARD_W = 2.5
const CARD_H = 3.5
const RADIUS = 0.14
const damp = THREE.MathUtils.damp

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
    uniforms: {
      uMap: { value: map },
      uMask: { value: mask },
      uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uHover: { value: 0 },
      uIntensity: { value: 1 },
    },
  })
}

/* ── The card ─────────────────────────────────────────────────── */
function Card({ pointer, scroll, onHoverChange }) {
  const group = useRef()
  const hover = useRef(0)
  const isHovered = useRef(false)
  const flips = useRef(0)
  const punch = useRef(0)

  const geometry = useMemo(roundedCardGeometry, [])
  const [front, back] = useMemo(() => {
    const [fMap, fMask] = makeFront({ name: 'Emberwing', hp: 210, set: 'HV-007/120' })
    const [bMap, bMask] = makeBack()
    return [holoMaterial(fMap, fMask), holoMaterial(bMap, bMask)]
  }, [])

  useEffect(
    () => () => {
      geometry.dispose()
      ;[front, back].forEach((m) => {
        m.uniforms.uMap.value.dispose()
        m.uniforms.uMask.value.dispose()
        m.dispose()
      })
    },
    [geometry, front, back]
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const p = pointer.current
    const s = scroll.current

    // pointer parallax + idle float + scroll-driven spin + click flips
    const targetY = p.x * 0.55 + s * Math.PI * 2 + flips.current * Math.PI
    const targetX = -p.y * 0.4 + Math.sin(t * 0.7) * 0.05
    g.rotation.y = damp(g.rotation.y, targetY, 5, dt)
    g.rotation.x = damp(g.rotation.x, targetX, 5, dt)
    g.rotation.z = damp(g.rotation.z, -p.x * 0.06, 4, dt)
    g.position.x = damp(g.position.x, p.x * 0.25, 3, dt)
    g.position.y = Math.sin(t * 0.9) * 0.09 + p.y * 0.12

    hover.current = damp(hover.current, isHovered.current ? 1 : 0, 6, dt)
    punch.current = damp(punch.current, 0, 7, dt)
    const sc = 1 + hover.current * 0.04 + punch.current * 0.08
    g.scale.setScalar(sc)

    for (const m of [front, back]) {
      m.uniforms.uTime.value = t
      m.uniforms.uHover.value = hover.current
      m.uniforms.uPointer.value.set(p.x, p.y)
    }
  })

  const handlers = {
    onPointerOver: (e) => {
      e.stopPropagation()
      isHovered.current = true
      onHoverChange?.(true)
    },
    onPointerOut: () => {
      isHovered.current = false
      onHoverChange?.(false)
    },
    onClick: (e) => {
      e.stopPropagation()
      flips.current += 1
      punch.current = 1
    },
  }

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={front} position-z={0.004} {...handlers} />
      <mesh geometry={geometry} material={back} rotation-y={Math.PI} position-z={-0.004} {...handlers} />
    </group>
  )
}

/* ── Ember dust orbiting the card ─────────────────────────────── */
function EmberDust({ count = 700, pointer }) {
  const ref = useRef()
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
        uniforms: { uTime: { value: 0 }, uPx: { value: Math.min(window.devicePixelRatio, 2) } },
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
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vA;
            gl_FragColor = vec4(1.0, 0.45, 0.16, a * 0.8);
          }`,
      }),
    []
  )

  useEffect(() => () => (geometry.dispose(), material.dispose()), [geometry, material])

  useFrame((state, dt) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y += dt * 0.05
      ref.current.rotation.x = damp(ref.current.rotation.x, pointer.current.y * 0.15, 2, dt)
    }
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

/* ── Public component ─────────────────────────────────────────── */
export default function HoloCard({ scroll, onHoverChange }) {
  const pointer = useRef({ x: 0, y: 0 })
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

  // Track the pointer across the whole viewport, not just the canvas.
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
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
      {fontsReady && <Card pointer={pointer} scroll={scroll} onHoverChange={onHoverChange} />}
      <EmberDust pointer={pointer} />
    </Canvas>
  )
}
