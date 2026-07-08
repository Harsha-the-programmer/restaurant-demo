# AGENTS.md - Restaurant Demo Repository Instructions

## Git & GitHub Workflow

**Every session must:**
1. Commit locally after each meaningful change
2. Push to GitHub using PAT token in `.gh_token`
3. Update AGENTS.md after significant changes

### GitHub Token
- Token in `.gh_token` (export as `GH_TOKEN`)
- Never commit `.gh_token` - it's in `.gitignore`
- Load: `export GH_TOKEN=$(cat .gh_token | cut -d'=' -f2)`

### Commit Format
```
type: brief description
```
Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `init`

---

## Repository State

- **Complete restaurant demo** - "Ember & Spice" fine dining website
- **Location**: `/run/media/harsha/Shared/restaurant-demo`
- **GitHub**: https://github.com/Harsha-the-programmer/restaurant-demo
- **Branch**: `main` (origin/master)

### Tech Stack
- React 19 + Vite 8
- Three.js / @react-three/fiber / @react-three/drei (3D)
- Framer Motion + GSAP (animations)
- Plain CSS (single `src/index.css`)
- react-scroll (smooth scrolling)

### Project Structure
```
restaurant-demo/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Cursor.jsx
        ├── Navbar.jsx
        ├── Hero.jsx          # Three.js wine glass + particles
        ├── About.jsx
        ├── Menu.jsx
        ├── Experience.jsx    # Three.js floating orbit
        ├── Gallery.jsx
        ├── Reservation.jsx
        └── Footer.jsx
```

### Sections Built
1. **Navbar** - Fixed, transparent → frosted glass on scroll, mobile menu
2. **Hero** - Full viewport, 3D wine glass + particles, animated text, CTAs
3. **About** - Quote, philosophy, 3 stat cards
4. **Menu** - 4 tabs (Starters/Mains/Desserts/Drinks), 3×2 card grid
5. **Experience** - 5 pillars + 3D floating orbit
6. **Gallery** - 8 CSS gradient cards, masonry grid
7. **Reservation** - Form with validation, success animation
8. **Footer** - Brand, nav, contact, hours, social, copyright

---

## Commands

```bash
# Install deps
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Preview build
npm run preview
```

---

## Known Issues & Fixes

### Missing Import Fix (Experience.jsx:1)
```jsx
import { useRef } from 'react';  // Required for useRef in FloatingOrbit
```

### Font Loading
`index.html` loads Google Fonts: Playfair Display, Cormorant Garamond, DM Sans. CSS uses `--font-display: 'Playfair Display'` - ensure font is loaded.

### Navbar/Foofer Links Fix
- React Scroll `Link` components require element IDs **without** `#` prefix
- Fixed in Navbar.jsx and Footer.jsx: `to="about"` not `to="#about"`

### Navbar Layout
- Use `justifyContent: 'space-between'` with `marginLeft: 'auto'; marginRight: 'auto'` on nav-links for centered navigation
- Added `cursor: 'pointer'` to all Link components for proper hover cursor

### Gallery Images
- Added Unsplash images to all 8 gallery items
- Added hover scale effect on images (1.08x)

### Session Workflow
1. `export GH_TOKEN=$(cat .gh_token | cut -d'=' -f2)`
2. Make changes
3. `git add -A && git commit -m "type: description"`
4. `git push`
5. Update AGENTS.md