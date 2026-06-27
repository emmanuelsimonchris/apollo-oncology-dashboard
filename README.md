# Apollo Oncology — Patient Flow & Experience Dashboard

A static, no-build-step website that combines findings from three internal Apollo Hospitals Oncology decks into one scrollable dashboard:

1. **Chemotherapy Scheduling — Phase I** (n = 132) — first pass at timing the chemo day end-to-end.
2. **Chemotherapy Scheduling — Phase II** (n = 332) — re-measurement after operational changes.
3. **Apollo Oncology Patient Experience Survey** (n = 150) — demographics, decision drivers, satisfaction, and NPS/loyalty.

Every number on the page is taken directly from those three source decks — nothing is interpolated or invented. Where a slide gave a qualitative finding with no percentage, the site presents it as text rather than a fabricated chart.

## What's inside

```
apollo-dashboard/
├── index.html        # all page markup & section copy
├── css/
│   └── styles.css     # design tokens + layout (no framework, no build step)
└── js/
    ├── data.js        # every figure used on the page, in one place
    ├── charts.js       # Chart.js setup + the hand-built NPS gauge (SVG)
    └── main.js         # nav, scroll progress bar, count-up stats, reveal animations
```

Charts are rendered with [Chart.js](https://www.chartjs.org/) (loaded from a CDN — no install needed). Fonts (Fraunces / Inter / IBM Plex Mono) load from Google Fonts.

## Updating the numbers

Everything quantitative lives in `js/data.js`. To correct or refresh a figure, edit it there — `charts.js` and `index.html` read from that single object, so a number only needs to change in one place.

## Running it locally

No build step, no dependencies to install. Either:

- Double-click `index.html`, or
- From this folder, run a tiny local server so relative paths behave the same as they will on GitHub Pages:
  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it (the `index.html` should sit at the repo root, or in `/docs` if you prefer):
   ```bash
   git init
   git add .
   git commit -m "Apollo Oncology dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch," pick `main` and the `/ (root)` folder (or `/docs` if that's where you put the files).
4. Save. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

No further configuration is needed — there's no server-side code and nothing to build.

## Browser support notes

The page uses `IntersectionObserver` for scroll-triggered animations and reveal effects, with graceful fallbacks for browsers that lack it. It also respects `prefers-reduced-motion`.
