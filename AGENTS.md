# AGENTS.md - Restaurant Demo Repository Instructions

## Git & GitHub Workflow (MANDATORY)

**Every session must:**
1. **Initialize Git repo** if not already done (`git init`)
2. **Create clean commit messages** for all changes
3. **Commit locally** after each meaningful change
4. **Push to GitHub** after commits using the PAT token in `.gh_token`
5. **Update AGENTS.md** after every significant change to preserve context

### GitHub Token
- Token stored in `.gh_token` (exported as `GH_TOKEN`)
- **Never commit `.gh_token`** - it's in `.gitignore`
- Use `export GH_TOKEN=$(cat .gh_token | cut -d'=' -f2)` to load token

### Git Commands to Use
```bash
# Initialize (first time only)
git init

# Stage and commit
git add -A
git commit -m "type: descriptive message"

# Push to GitHub (after creating repo)
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main

# Subsequent pushes
git push
```

### Commit Message Format
```
type: brief description

[optional body]

[optional footer]
```
Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `init`

---

## Repository State
- **Complete restaurant demo website** - "Ember & Spice" fine dining demo
- **Location**: `/run/media/harsha/Shared/restaurant-demo`
- **GitHub**: https://github.com/Harsha-the-programmer/restaurant-demo
- **GitHub token**: Available in `.gh_token` (export as `GH_TOKEN`)
- **AGENTS.md**: This file - update after every session

### Tech Stack
- React + Vite
- Three.js / @react-three/fiber / @react-three/drei (3D elements)
- GSAP + Framer Motion (animations)
- Plain CSS (single index.css file)
- react-scroll (smooth scrolling)

### Project Structure
```
restaurant-demo/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── Cursor.jsx
│       ├── Navbar.jsx
│       ├── Hero.jsx          ← Three.js canvas with wine glass + particles
│       ├── About.jsx
│       ├── Menu.jsx
│       ├── Experience.jsx    ← Three.js floating orbit
│       ├── Gallery.jsx
│       ├── Reservation.jsx
│       └── Footer.jsx
```

### Sections Built
1. **Navbar** - Fixed, transparent → frosted glass on scroll, mobile menu
2. **Hero** - Full viewport, 3D wine glass + particles, animated text, CTAs
3. **About** - Quote, philosophy text, 3 stat cards
4. **Menu** - 4 tabs (Starters/Mains/Desserts/Drinks), 3×2 card grid, hover animations
5. **Experience** - 5 pillars + 3D floating orbit on right
6. **Gallery** - 8 CSS gradient art cards, masonry grid, hover reveals
7. **Reservation** - Form with validation, success state with checkmark animation
8. **Footer** - Brand, nav, contact, hours, social links, copyright

---

## Session Workflow
1. Load GH_TOKEN: `export GH_TOKEN=$(cat .gh_token | cut -d'=' -f2)`
2. Make changes
3. `git add -A && git commit -m "type: description"`
4. `git push`
5. Update AGENTS.md with new context/decisions