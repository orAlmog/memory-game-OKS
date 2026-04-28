# Product Requirements Document (PRD)

> Hackathon scope. One weekend. MVP first. Anything not listed here is not in v1.

---

> **Assumption (correct me in one read):** "Memory game" is interpreted as **classic card-matching (concentration/pairs)** — a grid of face-down cards; flip two per turn; matched pairs stay revealed; clear the board to win. This is the dominant meaning, the most demoable, and the easiest to scope. If you actually meant Simon-Says sequence memory or Kim's game, stop here and say so before sprint planning.

---

## 1. Overview

**Project Name:** memory-game-OKS

**One-line description:** A browser-based card-matching memory game with Claude-generated themed card decks.

**Problem:** Classic memory games are stale — the same animals, fruits, and emoji every time. We make each playthrough feel fresh by letting the player pick a theme ("Renaissance painters," "1990s sitcoms," "Cyberpunk villains") and having Claude generate the deck on demand. The core loop is a familiar, low-friction game everyone already knows how to play; the AI-generated content is the wow moment for the demo.

**Target Users:** Hackathon judges and casual web users on a desktop browser. No login, no install, no learning curve — open the page, pick a theme, play, win.

---

## 2. Core Features

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | 4x4 card board | A 16-card grid (8 pairs) rendered face-down on game start. | Must Have |
| 2 | Flip & match mechanic | Click to flip; second flip either keeps the match revealed or flips both back after a 1s delay. Board is locked during the flip-back. | Must Have |
| 3 | Win state + run stats | Detect when all 8 pairs are matched; show a win panel with move count and elapsed time. | Must Have |
| 4 | New game / restart | One-click restart that reshuffles the current deck and resets stats. | Must Have |
| 5 | Claude-generated themed deck | Player enters a free-text theme; backend calls Claude (Anthropic SDK) and returns 8 emoji+label pairs as JSON; deck renders. Fallback to a built-in default deck on API failure or timeout. | Must Have |

**Why exactly one Claude feature, and why this one:** The Anthropic SDK is already scaffolded in the repo. A themed deck generator is the highest-leverage use of the API for this game — it's a single structured-output call at game start, it visibly changes every demo run, and it doesn't require Claude to participate in gameplay logic (which would be slow and unreliable). Hint systems, AI commentary, and adaptive difficulty are all worse uses of judge attention.

**Nice to have (deferred unless time permits):** localStorage best-time, difficulty selector (4x4 / 6x6), card-flip sound, theme history dropdown.

---

## 3. User Stories

### Story 1: Play a game
> As a player, I want to flip cards and find matching pairs, so that I can clear the board.

**Acceptance Criteria:**
- [ ] On load, 16 cards render face-down in a 4x4 grid.
- [ ] Clicking a face-down card flips it face-up.
- [ ] After two cards are face-up, the board is non-interactive until the flip-resolution completes.
- [ ] If the two face-up cards match, they remain face-up.
- [ ] If they do not match, both flip back face-down after ~1.0s.
- [ ] A move counter increments by 1 each time a pair is evaluated (matched or not).
- [ ] An elapsed-time counter starts on the first card flip and updates at least once per second.

### Story 2: Win and restart
> As a player, I want to see when I've won and start a new game, so that I can play again immediately.

**Acceptance Criteria:**
- [ ] When all 8 pairs are matched, a win panel appears showing final move count and final elapsed time.
- [ ] The timer stops on win.
- [ ] A "New Game" button is visible from the win panel and from the main game UI.
- [ ] Clicking "New Game" reshuffles the current deck, resets the move counter and timer to 0, and returns all cards to face-down.

### Story 3: Generate a themed deck (Claude)
> As a player, I want to enter a theme and get a custom deck, so that the game feels different each session.

**Acceptance Criteria:**
- [ ] A theme input field and "Generate Deck" button are visible before the game starts.
- [ ] Submitting a theme calls the backend, which calls Claude and returns 8 unique pairs (emoji + short label).
- [ ] A loading state is shown while the request is in flight.
- [ ] On success, the new deck replaces the current deck and the board resets.
- [ ] On API error or timeout (>10s), an inline message appears and the game falls back to a built-in default deck so the player can still play.
- [ ] Empty/whitespace themes are rejected client-side with an inline message.

---

## 4. Out of Scope

Explicit cuts. These are not v1 — do not let scope creep pull them in.

- Multiplayer or real-time play.
- User accounts, auth, or profiles.
- Server-backed leaderboards or global high scores.
- AI-generated card *images* (text/emoji labels only — image generation is a different problem and a different demo).
- Mobile-optimized layouts (must not break on desktop; phone polish is post-hackathon).
- Sound effects, music, or animations beyond a basic CSS flip.
- Difficulty selector or variable grid sizes.
- Cross-session persistence (no localStorage in v1).
- Internationalization.
- Accessibility beyond keyboard-tabbable buttons (full a11y audit is post-hackathon — note this as known debt).

---

## 5. Success Criteria

Observable, demoable, testable. If we can't check the box on demo day, we didn't ship.

- [ ] A player can complete a full game (16 cards, 8 pairs) on the latest Chrome desktop in under 90 seconds with zero console errors.
- [ ] All 8 pairs match correctly across 10 consecutive games (no false matches, no missed matches).
- [ ] Mismatched cards flip back within 1.0s ± 0.2s.
- [ ] Move counter and elapsed timer are visible during play and freeze on win.
- [ ] A Claude-generated themed deck for a 1–4 word theme returns and renders within 10 seconds on a typical residential connection.
- [ ] On simulated Claude API failure, the game falls back to the default deck and remains playable end-to-end.
- [ ] One Playwright E2E test covers the happy path: load → start game → match all pairs → see win panel.
- [ ] Layout does not break at 1280x800 or 1920x1080 in Chrome.

---

## 6. Technical Constraints

- **Must run on:** Latest Chrome desktop (primary). Edge and Firefox best-effort, no guarantees.
- **Available (not mandatory):** Anthropic SDK (`@anthropic-ai/sdk`) for the themed deck feature, called from the backend so the API key is never shipped to the browser.
- **Testing:** Playwright is the chosen E2E framework; at least one happy-path test must be green before demo.
- **No paid services** other than the Anthropic API.
- **Architecture decisions** (framework choices, state management, build tooling) are deliberately out of scope for this PRD and belong in a separate architecture doc.
