# Holo/Vault — hero

```bash
npm install
npm run dev
```

src/
  App.jsx                  shell: cursor provider, nav, hero, marquee, drops
  components/HoloCard.jsx  R3F canvas: foil-shaded card + ember dust, pointer parallax, click to flip
  components/Hero.jsx      GSAP intro + pinned ScrollTrigger timeline (scale / spin / fade / reveal)
  components/Cursor.jsx    spring cursor; data-cursor="Label" on any element
  components/MagneticButton.jsx
  components/Drops.jsx     tilt cards with CSS foil, add-to-bag feedback
  lib/holoShader.js        holographic foil GLSL
  lib/cardTextures.js      procedural card faces (swap for real scans)
  lib/motion.js            shared easing curves + springs
