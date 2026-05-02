# Carbon Plate

> Snap your dinner. We'll tell you what it cost the ocean.

A pocket-calculator climate app, made by two people who eat too much steak. You take a photo of your meal; Claude squints at it; we look up each ingredient in a hand-curated table of carbon coefficients; you get back a number — plus a friendlier translation: how many square metres of phytoplankton would have to work all year to undo this lunch.

No backend database. No accounts. Streaks live in your browser. We're a side project, not a startup.

---

## Run it

```bash
npm install
cp .env.example .env   # optional: set ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:4321.

If you skip the API key, **Demo Mode** turns on automatically — the photo you upload is mapped (deterministically, by file size) to one of five canned meals. The streak tracker, the swap suggestions, the math — all of it still works.

## Stack

- **Astro 5** — server endpoints + zero-JS pages
- **Alpine.js** — every client interaction (no React in sight)
- **Tailwind v3** — for the warm, sticker-y look
- **Anthropic SDK** — Claude vision for ingredient detection, Claude text for swap suggestions
- **localStorage** — the entire database

## What's in here

```
src/
  pages/
    index.astro          ← landing + capture + results, all on one page
    about.astro          ← honest disclaimers
    api/analyze.ts       ← Claude vision proxy
    api/swap.ts          ← swap suggestions proxy
  components/
    PlateIllustration.astro
    ItemChip.astro
    StreakRow.astro
  lib/
    coefficients.ts      ← the table + lookup
    food_coefficients.json  ← human-readable mirror
    anthropic.ts         ← Claude calls
    mock.ts              ← demo-mode meals
  styles/global.css
public/illustrations/    ← 4 hand-drawn SVGs (no stock images!)
```

## Honest disclaimers

The carbon coefficients are **estimates**, averaged from:

- Poore & Nemecek (2018), *Reducing food's environmental impacts through producers and consumers*
- Our World in Data — Food Choice & The Environment
- ADEME Agribalyse (French environmental food database)

These are cradle-to-fork-ish averages. They cannot tell the difference between your neighbour's pastured chicken and a CAFO chicken. Treat the result as a vibe check, not a courtroom exhibit.

The "ocean equivalents" — m² of phytoplankton, km of car driving — are simple, transparent multipliers (see `src/lib/coefficients.ts`). They're meant to make a kilogram of CO₂ feel like an actual thing instead of an abstract noun.

## Privacy

Your photos go to Anthropic's API for analysis. Or, if you skipped the key, they go nowhere — Demo Mode is fully local. Either way, your streaks live in `localStorage` on your device. We do not store anything server-side. We do not have analytics. We do not have your email. We barely have our own emails.

## License

MIT. Eat well, eat thoughtfully.

---

made with love (and a worrying amount of red meat) by Team Carbon Plate.
