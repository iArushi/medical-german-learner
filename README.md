# Medical German Learner

A mobile-first **prototype** for nurses learning **medical German** (A1–A2). Work through leveled loops: **Learn → Practise → Progress → Revisit → Improve → Result**, with points, a daily skill streak, mistake review, and optional **Compete** mode (demo data only).

Built for ~390px width; all progress is stored in the browser (no backend).

## Features

- **8 levels** with Easy / Medium / Hard labels and varied question styles (match meaning, pick article, mixed; some styles are placeholders)
- **Learn** step (unmarked flashcards) then **Practise** (marked, first pass only)
- **Progress** screen after Practise: ring shows combined % so far, 75% pass marker, **Fix my mistakes now** or **Save for later**
- **Revisit** then **Improve** on missed words; **Result** with pass / try again, word outcomes, points, streak
- **Pass rule:** combined Practise + Improve score **≥ 75%** (see `src/lib/combinedScore.ts`)
- **Home path:** level cards with progress rings (not started / in progress / passed), Continue / Resume
- **Review level** from accumulated practise mistakes
- **Skill streak** (finish level or Learn→Practise within 30 minutes); restore with points
- **Compete:** fake groups, Connect requests, head-to-head — anonymous aliases only (`src/fake/competeLearners.ts`)

Product requirements: [`prd.md`](./prd.md).

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vite.dev/)
- [React Router 7](https://reactrouter.com/)
- [Tailwind CSS 4](https://tailwindcss.com/) (design tokens in `src/index.css`, **Nunito** font)

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/iArushi/medical-german-learner.git
cd medical-german-learner
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Choose a learning mode, then use **Home** to start a level.

### Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint |

## App flow (short)

1. **Mode** — Learn individually or Compete mode (switch anytime in Profile).
2. **Home** — Streak, points, Continue/Resume, review mistakes, level path.
3. **Level** — `learn` → `practise` → `progress` → optional `revisit` → `improve` → `progress` (ring update) → `result`.

Routes live under `/level/:levelId/*` in `src/pages/LevelPage.tsx`.

## Data & storage

| Key | Purpose |
|-----|---------|
| `mg_learning_mode` | Individual vs compete |
| `mg_user_progress` | Points, completions, scores, mistakes, streak |
| `mg_levels_in_progress` | Saved mid-level state (Save for later) |
| `mg_level_attempt` | Current level attempt (session) |
| `mg_level_streak_session` | Learn→Practise streak timing (session) |
| `mg_compete` | Demo compete state (local) |

Word and level content: `src/data/words.json`, `src/data/levels.json`.

## Project layout

```
src/
  components/   UI, home, level steps, compete, profile
  pages/        Mode, Home, Level routes, Compete, Profile
  lib/          Scoring, streak, questions, level path
  storage/      localStorage / sessionStorage helpers
  config/       Points, streak, compete tuning
  fake/         Demo compete learners (not real people)
```

## Demo / prototype notes

- **Compete** learners, ranks, and head-to-head scores are **generated sample data**, not a live service.
- **FillGap** and **PatientSituation** level types may still use match-style placeholders where not fully implemented.
- German content is for learning practice; verify clinically before production use.

## License

Prototype for learning and portfolio use. Add a license file if you open-source it formally.

## Author

[iArushi](https://github.com/iArushi) — repository: [medical-german-learner](https://github.com/iArushi/medical-german-learner).
