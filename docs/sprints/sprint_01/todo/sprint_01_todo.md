# Sprint 01 — Task List

Owner tags per AGENTS.md: `[DEV:backend]`, `[DEV:frontend]`, `[QA]`.

## P1 — Backend `[DEV:backend]`

- [ ] Create `backend/modules/deck-generator/` (package.json, tsconfig, src/).
- [ ] Express server on `:3001` with CORS for `:3000`.
- [ ] `POST /api/generate-deck` — body `{ theme: string }`, validate non-empty, max length.
- [ ] Anthropic SDK call with structured JSON instruction; 10s abort timeout.
- [ ] Validate response: exactly 8 unique pairs of `{ emoji, label }`.
- [ ] On any failure (timeout, parse error, API error, empty theme): return `{ deck: DEFAULT_DECK, fallback: true, reason }` with HTTP 200.
- [ ] `DEFAULT_DECK` constant: 8 pairs of broadly-recognizable emoji + labels.
- [ ] `npm run dev` script via `tsx watch`.
- [ ] README in module describing endpoint contract.

## P2 — Frontend scaffold `[DEV:frontend]`

- [ ] Create `frontend/modules/memory-game/` (Vite + React + TS).
- [ ] Vite dev server on `:3000`, proxy `/api` → `:3001`.
- [ ] Apply design tokens (colors, type scale, spacing, radii) from `UI_UX_Spec.md` as CSS variables.
- [ ] App shell with state union: `Idle | Generating | Playing | Won | Error`.
- [ ] Render Idle screen: ThemeInput + GenerateButton + "Play with default deck" link.

## P3 — Game logic `[DEV:frontend]`

- [ ] `Card` component: face-down / face-up / matched / disabled, CSS 3D flip (350ms).
- [ ] `Board`: 4x4 grid, takes deck of 8 pairs, shuffles to 16 cards.
- [ ] Game reducer/hook: `flip(id)`, derives `boardLocked`, handles 1.0s mismatch flip-back.
- [ ] HUD: `Timer` (starts on first flip, stops on win), `MoveCounter`, `NewGameButton`.
- [ ] `WinPanel` shown when 8 pairs matched; freeze timer; show stats; New Game CTA.
- [ ] Default deck shipped client-side too (used on Error and "play with default" link).

## P4 — Wiring `[DEV:frontend]`

- [ ] `ThemeInput` validation: reject empty/whitespace inline.
- [ ] `GenerateButton` → fetch `/api/generate-deck`, show `LoadingIndicator`.
- [ ] On success: replace deck, transition to Playing.
- [ ] On `fallback:true` or fetch error: show `ErrorBanner` with reason, load default deck, allow play.

## P5 — E2E `[QA]`

- [ ] Update `playwright.config.ts` `webServer` to start frontend.
- [ ] `tests/e2e/happy-path.spec.ts`: load → start with default deck → match all pairs → assert WinPanel visible with non-empty stats.
- [ ] Add `data-testid` attributes on Card, NewGameButton, WinPanel, Timer, MoveCounter.
- [ ] `npx playwright test` is green.

## Definition of Done

- [ ] All boxes above checked.
- [ ] Manual smoke test passes at 1280x800 in Chrome.
- [ ] No console errors during a full game.
- [ ] Sprint exit criteria in `sprint_01_index.md` all checked.
