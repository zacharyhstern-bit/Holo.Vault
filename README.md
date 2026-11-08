# Holo/Vault

```bash
npm install
npm run dev
```

Pages (react-router): / · /drops · /graded · /sealed · /sell
vercel.json rewrites every path to index.html so direct links and refreshes work on Vercel.

src/
  App.jsx                    routes + page transitions
  data/products.js           ALL products, hero cards, upcoming drops — edit this to change inventory
  pages/                     Home, DropsPage, GradedPage, SealedPage, SellPage, NotFound
  components/HoloCard.jsx    3D auto-playing card carousel (WebGL)
  components/Hero.jsx        home hero: GSAP intro + pinned scroll timeline
  components/ProductCard.jsx tilt tile for cards, graded slabs and sealed boxes
  components/PageShell.jsx   page transition curtain, page header, reveal grid
  components/Nav.jsx, Footer.jsx, Cursor.jsx, MagneticButton.jsx, Marquee.jsx, Drops.jsx
  lib/                       shader, card textures, easing, countdown

Note: the Sell page quote form validates but doesn't send anywhere yet — connect it in SellPage.jsx (onSubmit).
