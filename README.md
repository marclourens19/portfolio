# Joshua Lourens — Developer Portfolio

A hand-built, single-page developer portfolio. No frameworks, no templates — just
HTML, CSS and vanilla JavaScript. Dark, modern-dev aesthetic with an animated
constellation hero, scroll-reveal animations, project filtering, scroll-spy
navigation and a fully responsive layout.

## 📂 Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure & content |
| `styles.css` | All styling, theme tokens & responsive rules |
| `script.js`  | Interactions: nav, typewriter, canvas, filters, reveals, form |
| `README.md`  | This file |

## 🚀 Run locally

It's a static site — just open `index.html` in a browser.
Or serve it (recommended, avoids any file:// quirks):

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Deploy to GitHub Pages

1. Create a new public repo, e.g. **`portfolio`**, and push these files to it:

   ```bash
   git init
   git add .
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/marclourens19/portfolio.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)** → Save

3. Your site goes live at:
   **https://marclourens19.github.io/portfolio/**
   (give it 1–2 minutes on the first deploy)

> Tip: to host it at `marclourens19.github.io` (no `/portfolio` path), name the
> repo exactly `marclourens19.github.io` instead.

## ✏️ Things to personalise

- **LinkedIn link** — in `index.html`, find the contact card marked
  `data-linkedin-placeholder` and replace its `href` with your real LinkedIn URL
  (and update the `Add your link →` text to your handle).
- **More projects** — duplicate a `<article class="card …">` block in the Projects
  section. Set `data-tags` (any of `web desktop games csharp`) so filtering works.
- **Contact** — the Get-in-touch section uses direct contact cards + an "Email me"
  button (no form/backend). To add a working form later, drop in a
  [formspree.io](https://formspree.io) form.
- **Résumé** — drop a `resume.pdf` in this folder and add a link/button in the nav.

## ♿ Accessibility & performance

- Semantic HTML, skip link, focus styles, `aria` labels, scroll-spy.
- Respects `prefers-reduced-motion` (disables canvas, typewriter & counters).
- Canvas pauses when the hero is off-screen; scroll handlers are `requestAnimationFrame`-throttled.

---

Built by Joshua Marc Lourens · marclourens1901@gmail.com · [github.com/marclourens19](https://github.com/marclourens19)
