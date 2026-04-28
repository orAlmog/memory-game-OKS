# Sprint 01 — Ship the MVP memory game

| Field | Value |
|-------|-------|
| **Sprint** | 01 |
| **Goal** | Demoable card-matching memory game with Claude-generated themed decks, end-to-end on localhost. |
| **Status** | In Progress |
| **Start** | 2026-04-28 |
| **End** | 2026-04-28 |

---

## Stack (locked)

- **Frontend:** Vite + React + TypeScript, single module at `frontend/modules/memory-game/`. Dev server on `:3000`.
- **Backend:** Node + Express + `@anthropic-ai/sdk`, single module at `backend/modules/deck-generator/`. Server on `:3001`.
- **Wiring:** Vite dev proxy `/api` → `http://localhost:3001`. Playwright `baseURL` stays `http://localhost:3000`.
- **Tests:** Playwright happy-path E2E in `tests/e2e/`.

Rationale: boring, fast to ship over a hackathon weekend; matches `playwright.config.ts` default port; satisfies the AGENTS.md module convention without over-engineering.

---

## Scope

In scope (must-haves from PRD §2):

1. **F1 — 4x4 board** rendered face-down on game start.
2. **F2 — Flip & match mechanic** with 1.0s mismatch flip-back and board-lock during resolution.
3. **F3 — Win state + run stats** (move counter + elapsed time).
4. **F4 — New game / restart** that reshuffles current deck and resets stats.
5. **F5 — Claude-generated themed deck** via backend, with default-deck fallback on error/timeout/empty input.

Out of scope: everything in PRD §4 (no mobile, no sound, no persistence, no leaderboards, no a11y beyond keyboard tab).

---

## Exit Criteria

- [ ] `npm run dev` (frontend) and `npm run dev` (backend) both start cleanly.
- [ ] Player can complete a full game with no console errors on Chrome desktop.
- [ ] Mismatch flip-back is 1.0s ± 0.2s; board is non-interactive during flip-back.
- [ ] Move counter and timer behave per PRD §3 acceptance criteria.
- [ ] Themed deck request returns and renders within 10s on a normal connection.
- [ ] On simulated Claude failure, default deck loads and game is playable end-to-end.
- [ ] One Playwright happy-path test is green.
- [ ] Layout intact at 1280x800 and 1920x1080.

---

## Phased Plan

| Phase | Work | Verify |
|-------|------|--------|
| P1 | Backend module: Express server, `POST /api/generate-deck`, default deck, Anthropic call with 10s timeout, structured-output validation. | `curl` returns 8 unique pairs; failure path returns default deck with 200 + flag. |
| P2 | Frontend scaffold: Vite + React + TS, design tokens from `UI_UX_Spec.md`, app shell with state machine (Idle / Generating / Playing / Won / Error). | App renders Idle screen at `:3000`; tokens applied. |
| P3 | Game logic: deck shuffle, Card component with CSS 3D flip, Board, HUD (Timer + MoveCounter + NewGameButton), WinPanel. | Manual play with default deck completes a full game. |
| P4 | Wiring: ThemeInput → fetch `/api/generate-deck` → render new deck; loading + error states; fallback link. | Real Claude call works; toggling backend off triggers fallback. |
| P5 | Playwright happy-path E2E test (uses default deck so it's deterministic). | `npx playwright test` is green. |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Claude call slow / flaky on demo wifi | M | H | 10s timeout + default deck fallback; "Play with default deck" link on Idle. |
| Flip animation glitches on mismatch race conditions | M | M | Single `boardLocked` flag; ignore clicks while locked or on already-faceup cards. |
| Anthropic JSON output drifts from schema | M | M | Strict client-side validation; on parse failure, return default deck. |
| Time blown on a11y / polish | L | M | Defer per PRD §4; focus ring + tab order only. |

---

## Artifacts

- PRD: `PRD.md`
- UI/UX spec: `UI_UX_Spec.md`
- CTO review: `CTO_Sasha.md`
- Tasks: `todo/sprint_01_todo.md`
- Report: `reports/sprint_01_report.md` (written at sprint close)
- Review: `reviews/sprint_01_review.md` (written at sprint close)
