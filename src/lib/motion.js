// One easing vocabulary shared by GSAP, Framer Motion and CSS.
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]
export const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

// GSAP accepts CustomEase only as a plugin; these named eases are the closest built-ins.
export const GSAP_EASE = 'expo.out'
export const GSAP_EASE_INOUT = 'power3.inOut'

export const SPRING_SOFT = { stiffness: 180, damping: 22, mass: 0.6 }
export const SPRING_SNAPPY = { stiffness: 420, damping: 30, mass: 0.4 }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
