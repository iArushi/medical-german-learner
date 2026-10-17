PRD: Medical German Practice (MedDeutsch)

1. Problem

How might we help an Indian nurse at A1 to A2 German learn, remember and repeatedly practise medical German vocabulary in a simple, engaging way, so she never feels finished after one quiz?

2. User

An Indian nurse, A1 or A2 German, preparing to work in Germany. She uses her phone often, has short bursts of free time, and may enjoy optional anonymous competition. These habits are hypotheses to validate with real users.

3. Product idea

A level-based learning app branded **MedDeutsch**. Each level is one full practice loop and can be replayed. Points, a daily skill streak, mistake review, and optional Compete mode bring her back.

**Live prototype:** https://medical-german-learner.vercel.app/home

4. Choosing a mode

On first visit she picks **Learn individually** or **Compete mode**. She can switch anytime in Progress (Profile). Streak and points stay with her.

5. App shell (Overview)

After mode choice she lands on **Overview** (Home):

- **Sidebar (drawer on phone, fixed on desktop):** Overview, My lessons, Compete, Progress, Review, weekly goal card, learner alias.
- **Top bar:** streak, shortcut to review mistakes (when any exist).
- **Welcome:** date, greeting, weekly goal ring (qualified days this week).
- **Continue learning:** mint card for the next or in-progress level with progress bar and Start / Resume.
- **Your learning path:** levels shown as focus cards (not started, in progress, passed, locked).
- **Stats:** points, words from completed levels, path completion percent.

The layout is **full width and responsive**: sidebar + main on large screens; hamburger menu on small screens.

6. Levels

Every level is labelled Easy, Medium or Hard. One level is the whole loop:

**Learn:** words with article, English meaning, example sentence. Not marked.  
**Practise:** marked questions, one screen at a time, first pass only.  
**Progress:** combined score so far, 75% pass marker, **Fix my mistakes now** or **Save for later**.  
**Revisit:** missed words inside the same level (after Fix).  
**Improve:** marked again on words she missed in Practise.  
**Progress again:** ring updates with new combined score.  
**Result:** pass or try again, word lists, points, streak update.

Wrong answers in Practise are saved. Missed words also feed a **Review** level on Home. Levels can be replayed; points are lower on repeat passes.

Each level has its own question style where implemented (match meaning, pick article, mixed; some styles may still use placeholders).

**Passing:** one combined score from Practise and Improve. She passes at **75 percent**.

7. Points

- Points for every level passed.
- A cleaner pass earns more than a pass with many mistakes.
- Points can restore a broken skill streak (cost configured in app).

8. Skill streak

She earns the day’s streak by doing either of these:

- completing one entire level (passing flow counts), or  
- moving from Learn into Practise within 30 minutes.

If she does neither, the streak breaks. Points can restore it. Home and Progress show streak status and a calendar of qualified days.

9. Compete mode (prototype)

- Groups of about 10, assigned by streak band (demo data).
- Separate band for very new learners.
- Ranked by streak inside the group.
- Up to 3 Connect requests at a time; requests expire after 2 days (demo).
- If accepted, head-to-head on the same level, scores compared locally.
- **All learners in Compete are fake sample data** — not a live backend.

10. Privacy and safety

- Generated anonymous alias and avatar only; no real names in Compete.
- No phone, email, city or workplace shown.
- Before accepting Connect she sees alias, avatar, streak and levels completed.
- Block and report on every alias (stored locally in demo).
- Progress stored in the browser only for this prototype.

11. What makes it different

- Learn always comes first.
- Medical vocabulary aimed at nursing work in Germany.
- Different question styles per level; difficulty shown upfront.
- Mistakes become a visible Review path; Improve shows whether she really learned.
- Two modes: alone, or anonymous Compete (demo).
- Dashboard-style Home so she always sees what to do next.

12. What we built (current prototype scope)

**In the app today:**

- Mode choice, MedDeutsch dashboard UI, 8 levels in `levels.json`, Learn / Practise / Progress / Revisit / Improve / Result.
- Combined scoring, 75% pass, points, mistake tracking, Review level, skill streak with restore.
- Save for later (in-progress levels on Home).
- Compete, Connect, head-to-head with **fake** learners — clearly demo-only.

**Not production-ready:**

- No real server, accounts, or live Compete matchmaking.
- German clinical content should be verified before real patient use.
- FillGap / PatientSituation may be partial or placeholder where not finished.

13. Metrics (what to measure with real users)

- Return on day 2 and day 3.
- Streak length and weekly goal completion.
- Accuracy on words she missed before.
- Levels replayed and path completion.
- Share choosing Compete mode and whether they return more.

14. Risks

- Wrong or outdated German content.
- Too much game chrome, too little learning.
- Streak feeling like pressure.
- Abuse between anonymous learners (mitigate with block/report; needs real moderation if live).
- Streak loophole: Learn → Practise within 30 minutes without engaging Learn. Mitigation idea: require a minimum number of Practise answers before the day qualifies.

15. Technical notes (for maintainers)

- React + TypeScript + Vite, React Router, Tailwind; fonts DM Sans and Manrope.
- Deployed on Vercel from GitHub `main`; SPA rewrites in `vercel.json`.
- Storage: localStorage / sessionStorage keys documented in README.
