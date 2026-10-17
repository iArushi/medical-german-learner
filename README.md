# Medical German Learner (MedDeutsch)

> **Live app:** **[https://medical-german-learner.vercel.app/home](https://medical-german-learner.vercel.app/home)**  
> Open this link to use the deployed prototype in your browser (no install).

A **responsive** web app for nurses learning **medical German** (A1–A2). Work through leveled loops: **Learn → Practise → Progress → Revisit → Improve → Result**, with points, a daily skill streak, mistake review, and optional **Compete** mode (demo data only).

Works on phone and desktop. Progress is stored in your browser (no backend).

## Features

- **MedDeutsch dashboard:** sidebar navigation (Overview, My lessons, Compete, Progress, Review), welcome + weekly goal ring, continue card, lesson path grid, stats
- **8 levels** with Easy / Medium / Hard and varied question styles (match meaning, pick article, mixed; some styles are placeholders)
- **Learn** (unmarked flashcards) then **Practise** (marked, first pass only)
- **Progress** after Practise: combined % ring, 75% pass marker, **Fix my mistakes now** or **Save for later**
- **Revisit** → **Improve** on missed words → **Result** (pass / try again, points, streak)
- **Pass rule:** combined Practise + Improve **≥ 75%** (`src/lib/combinedScore.ts`)
- **Home:** continue / resume, review mistakes, level cards (locked / in progress / passed)
- **Skill streak** (finish level or Learn→Practise within 30 minutes); restore with points
- **Compete:** fake groups, Connect, head-to-head — anonymous aliases only (`src/fake/competeLearners.ts`)

Product requirements: [`prd.md`](./prd.md).

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vite.dev/)
- [React Router 7](https://reactrouter.com/)
- [Tailwind CSS 4](https://tailwindcss.com/) — design tokens in `src/index.css`, dashboard styles in `src/styles/figma-dashboard.css`, **DM Sans** + **Manrope**

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/iArushi/medical-german-learner.git
cd medical-german-learner
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Choose a learning mode, then use **Overview** (Home) to start a level.

### Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint |

## Deploy (Vercel)

The live site is connected to this GitHub repo. Pushes to **`main`** trigger a deploy.

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`
- Client-side routes use SPA rewrites in [`vercel.json`](./vercel.json).

## App flow (short)

1. **Mode** — Learn individually or Compete mode (switch in Progress).
2. **Overview (Home)** — Continue learning, path grid, review, stats.
3. **Level** — `learn` → `practise` → `progress` → optional `revisit` → `improve` → `progress` → `result`.

Routes: `/home`, `/compete`, `/profile`, `/level/:levelId/*` (`src/pages/LevelPage.tsx`).

## Data & storage

| Key | Purpose |
|-----|---------|
| `mg_learning_mode` | Individual vs compete |
| `mg_user_progress` | Points, completions, scores, mistakes, streak |
| `mg_levels_in_progress` | Saved mid-level state (Save for later) |
| `mg_level_attempt` | Current level attempt (session) |
| `mg_level_streak_session` | Learn→Practise streak timing (session) |
| `mg_compete` | Demo compete state (local) |

Content: `src/data/words.json`, `src/data/levels.json`.

## Project layout

```
src/
  components/   UI, dashboard shell, level steps, compete, profile
  pages/        Mode, Home, Level routes, Compete, Profile
  styles/       figma-dashboard.css
  lib/          Scoring, streak, questions, home dashboard helpers
  storage/      localStorage / sessionStorage helpers
  config/       Points, streak, compete tuning
  fake/         Demo compete learners (not real people)
```

## Demo / prototype notes

- **Compete** learners and scores are **generated sample data**, not a live service.
- **FillGap** and **PatientSituation** may use placeholders where not fully implemented.
- Verify German content before clinical or production use.

## License

Prototype for learning and portfolio use. Add a license file if you open-source it formally.

## Author

[iArushi](https://github.com/iArushi) — [medical-german-learner](https://github.com/iArushi/medical-german-learner)
