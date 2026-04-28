# UI/UX Specification

> **Sprint:** 01
> **Status:** Draft
> **Summary:** Pixel-level UI/UX spec for the v1 memory game — pre-game theme input, 4x4 board, HUD, win panel, error/fallback states. Desktop Chrome only. Hackathon-MVP scope.

---

## 1. Design Principles

- **Calm, not loud.** Generous whitespace, one focal point per screen. The board is the hero.
- **Demoable in 5 seconds.** Anyone glancing at the screen knows what to do without instructions.
- **Low friction.** No modals, no settings, no confirmations. One primary action per state.
- **Playful but restrained.** Rounded geometry, soft shadows, one accent color. No gradients, no decorative motion.
- **Boring where it counts.** Standard buttons, standard inputs, standard focus rings. Save the surprise for the cards.

---

## 2. Information Architecture — UI States

The app is a single page with one of five mutually-exclusive states:

| State | Trigger | What's visible |
|---|---|---|
| **Idle / Pre-game** | Initial load | App title, theme input, Generate Deck button, "or play with default deck" link, HUD hidden, board hidden |
| **Generating** | Generate clicked, request in flight | Theme input + button disabled, inline LoadingIndicator with copy, board hidden |
| **Playing** | Deck ready (generated or default), or after New Game | HUD (timer, moves, New Game), 4x4 board, no theme input visible |
| **Won** | All 8 pairs matched | HUD frozen, board still visible (all face-up matched), WinPanel overlay with stats + New Game |
| **Error / Fallback** | API error or >10s timeout | ErrorBanner above board, board renders with default deck in Playing layout, theme input remains accessible to retry |

Empty/whitespace input is **not** a separate state — it inline-validates on the Idle screen (red helper text under input, button stays disabled).

---

## 3. Layout & Wireframes

All wireframes assume 1280px viewport. Content max-width 960px, centered.

### 3.1 Idle / Pre-game

```
+--------------------------------------------------------------+
|                                                              |
|                                                              |
|                    Memory                                    |
|                    A card-matching game with AI decks.       |
|                                                              |
|     +----------------------------------------------+         |
|     |  Theme                                        |         |
|     |  [ Renaissance painters___________________ ]  |         |
|     |  Try: "1990s sitcoms", "deep sea creatures"   |         |
|     +----------------------------------------------+         |
|                                                              |
|                  [  Generate Deck  ]                         |
|                                                              |
|                  Play with default deck                      |
|                                                              |
+--------------------------------------------------------------+
```

### 3.2 Generating

```
+--------------------------------------------------------------+
|                                                              |
|                    Memory                                    |
|                                                              |
|     [ Renaissance painters____________ ]  (disabled)         |
|                                                              |
|                  [  Generating...  ] (disabled, spinner)     |
|                                                              |
|                  Asking Claude for 8 pairs...                |
|                                                              |
+--------------------------------------------------------------+
```

### 3.3 Playing (in-game board)

```
+--------------------------------------------------------------+
|  Memory                                       [ New Game ]   |
|                                                              |
|  Theme: Renaissance painters                                 |
|  Moves: 04        Time: 00:23                                |
|  ----------------------------------------------------------  |
|                                                              |
|     +------+  +------+  +------+  +------+                   |
|     |      |  |      |  |      |  |      |                   |
|     |  ?   |  |  ?   |  |  🎨  |  |  ?   |                   |
|     |      |  |      |  | Da V |  |      |                   |
|     +------+  +------+  +------+  +------+                   |
|                                                              |
|     +------+  +------+  +------+  +------+                   |
|     |      |  |      |  |      |  |      |                   |
|     |  ?   |  |  ?   |  |  ?   |  |  ?   |                   |
|     |      |  |      |  |      |  |      |                   |
|     +------+  +------+  +------+  +------+                   |
|                                                              |
|     +------+  +------+  +------+  +------+                   |
|     |  ?   |  |  ?   |  |  ?   |  |  ?   |                   |
|     +------+  +------+  +------+  +------+                   |
|                                                              |
|     +------+  +------+  +------+  +------+                   |
|     |  ?   |  |  ?   |  |  ?   |  |  ?   |                   |
|     +------+  +------+  +------+  +------+                   |
|                                                              |
+--------------------------------------------------------------+
```

HUD sits in a single row above the board: title left, **New Game** top-right, stats (theme, moves, time) on the second line.

### 3.4 Win Panel

Overlay (centered card, dimmed backdrop at 40% black). Board remains rendered behind.

```
            +------------------------------------+
            |                                    |
            |              You won               |
            |                                    |
            |        14 moves · 00:47            |
            |                                    |
            |          [  New Game  ]            |
            |                                    |
            +------------------------------------+
```

### 3.5 Error / Fallback

```
+--------------------------------------------------------------+
|  Memory                                       [ New Game ]   |
|                                                              |
|  ! Couldn't reach Claude. Playing with the default deck.     |
|    [ Try again ]                                             |
|                                                              |
|  Moves: 00        Time: 00:00                                |
|  ----------------------------------------------------------  |
|     [4x4 default board, same as Playing layout]              |
+--------------------------------------------------------------+
```

ErrorBanner is a single-row strip above the HUD, dismissible via "Try again" (re-opens theme input) or auto-dismissed after first card flip.

---

## 4. Component Inventory

| Component | Purpose | States | Key props / behavior |
|---|---|---|---|
| **ThemeInput** | Free-text theme entry | default, focus, disabled, error (empty/whitespace) | `value`, `onChange`, `disabled`, `error?: string`. Max 80 chars. Trims on submit. |
| **GenerateButton** | Submit theme to backend | default, hover, focus, disabled, loading | Disabled when input is empty/whitespace or `loading`. Shows spinner + "Generating..." in loading. |
| **Card** | Single board cell | face-down, face-up, matched, disabled (board locked or already matched) | `pair: {emoji, label}`, `state`, `onFlip`. `disabled` blocks click + removes hover. |
| **Board** | 4x4 grid of Cards | idle, locked (during flip-back) | `deck: Card[]`, `locked: boolean`. Owns the lock state during the 1.0s flip-back. |
| **HUD** | Top bar wrapper | always visible during Playing/Won | Hosts Timer, MoveCounter, NewGameButton. |
| **Timer** | Elapsed mm:ss | stopped, running, frozen (won) | Starts on first flip. Updates 1Hz. Freezes on win. |
| **MoveCounter** | Pair-evaluation count | running, frozen | Increments when 2nd card resolves (match or mismatch). |
| **NewGameButton** | Reset board + stats | default, hover, focus | Always visible during Playing/Won/Error. Reshuffles current deck; doesn't refetch from Claude. |
| **WinPanel** | Win overlay | shown / hidden | Props: `moves`, `elapsedSeconds`. Has its own NewGameButton. Backdrop click does nothing (deliberate — avoid accidental dismiss). |
| **ErrorBanner** | API failure / timeout notice | shown / hidden | Props: `message`, `onRetry`. Auto-hides after first card flip on the fallback deck. |
| **LoadingIndicator** | Generating-state feedback | shown / hidden | Inline spinner + copy. Uses CSS-only spinner. |

---

## 5. Visual Design Tokens

### 5.1 Color

Neutral-first palette, single warm accent. All values pass WCAG AA against their stated background.

| Token | Hex | Usage |
|---|---|---|
| `--bg-app` | `#FAF9F6` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--bg-card-down` | `#2D3142` | Face-down card background |
| `--bg-card-up` | `#FFFFFF` | Face-up card background |
| `--bg-card-matched` | `#E8F5E9` | Matched card background |
| `--border-subtle` | `#E5E5E5` | Input/panel borders |
| `--border-strong` | `#1F2024` | Focus ring (3:1 vs app bg) |
| `--text-primary` | `#1F2024` | Body, labels |
| `--text-secondary` | `#5C5F66` | Helper text, theme line |
| `--text-on-dark` | `#FAF9F6` | "?" on face-down card |
| `--accent` | `#E07A5F` | Primary buttons, accents |
| `--accent-hover` | `#C9614A` | Primary button hover |
| `--success` | `#2E7D32` | Matched border / win headline |
| `--danger` | `#B3261E` | Error banner, validation |
| `--overlay` | `rgba(31,32,36,0.40)` | Win panel backdrop |

> **Dark mode:** out of scope for v1. If added later, re-derive a parallel ramp around `#15161A` / `#E6E6E6`; do not invert these tokens.

### 5.2 Typography

System font stack — zero asset cost, instant load.

```
font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
             Roboto, "Helvetica Neue", Arial, sans-serif;
```

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `text-display` | 32px / 2rem | 1.2 | 600 | "Memory" title, "You won" |
| `text-h2` | 20px / 1.25rem | 1.3 | 600 | Win stats line, panel headers |
| `text-body` | 16px / 1rem | 1.5 | 400 | Default body, inputs |
| `text-label` | 14px / 0.875rem | 1.4 | 500 | HUD labels (Moves, Time, Theme) |
| `text-caption` | 13px / 0.8125rem | 1.4 | 400 | Helper text, hints |
| `text-card-label` | 14px / 0.875rem | 1.2 | 500 | Card label under emoji |

Use **tabular-nums** (`font-variant-numeric: tabular-nums`) on Timer and MoveCounter so digits don't jitter.

### 5.3 Spacing

8pt base. All paddings, margins, gaps must be multiples.

| Token | px |
|---|---|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 24 |
| `space-6` | 32 |
| `space-8` | 48 |
| `space-10` | 64 |

### 5.4 Radii

| Token | px | Use |
|---|---|---|
| `radius-sm` | 6 | Inputs, banners |
| `radius-md` | 10 | Buttons, cards |
| `radius-lg` | 16 | Win panel |

### 5.5 Shadow

| Token | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(31,32,36,0.06)` | Resting card, input |
| `shadow-md` | `0 4px 12px rgba(31,32,36,0.08)` | Card hover |
| `shadow-lg` | `0 20px 40px rgba(31,32,36,0.18)` | Win panel |

---

## 6. Card Design Spec

### Dimensions

- Card size: **128px × 160px** (4:5 aspect ratio).
- Grid gap: `space-4` (16px). Total board: `4 * 128 + 3 * 16 = 560px` wide × `4 * 160 + 3 * 16 = 688px` tall.
- Board centered horizontally. Margin top from HUD: `space-6` (32px).
- At 1920px viewport: board is the same size, simply more whitespace on the sides. Do **not** scale the card up.

### Face-down

- Background: `--bg-card-down` (#2D3142).
- Centered "?" — 40px, weight 600, color `--text-on-dark`, opacity 0.6.
- Border: none. Shadow: `shadow-sm`.
- Radius: `radius-md`.

### Face-up (revealed, not yet matched)

- Background: `--bg-card-up`.
- Border: `1px solid var(--border-subtle)`.
- Layout: emoji centered in upper 60%, label centered below.
- Emoji: **48px**, line-height 1.
- Label: `text-card-label`, color `--text-primary`, single line, ellipsis if overflow, max width 100%.
- Padding: `space-3` (12px) all sides.

### Matched

- Background: `--bg-card-matched` (#E8F5E9).
- Border: `1px solid var(--success)` at 40% alpha.
- Emoji opacity: 0.85. Label color: `--text-secondary`.
- No hover, no focus, no pointer.

### States summary

| State | Background | Border | Cursor | Shadow |
|---|---|---|---|---|
| face-down | `--bg-card-down` | none | pointer | `shadow-sm` |
| face-down hover | `--bg-card-down` | none | pointer | `shadow-md` + translateY(-2px) |
| face-down focus-visible | `--bg-card-down` | `2px solid --border-strong` (outline-offset 2px) | pointer | `shadow-sm` |
| face-up | `--bg-card-up` | `1px subtle` | default | `shadow-sm` |
| matched | `--bg-card-matched` | `1px success/40` | default | none |
| disabled (board locked, still face-down) | `--bg-card-down` | none | not-allowed | `shadow-sm` |

---

## 7. Interaction & Motion

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Card flip (face-down → face-up) | **350ms** | `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out) | CSS 3D transform on inner wrapper, `transform-style: preserve-3d`, `backface-visibility: hidden` on each face. |
| Card flip-back on mismatch | 350ms | ease-out | Triggered after a **1000ms** hold so the player can read both cards. |
| Board lock window | 1000ms + 350ms flip | — | Lock starts on second flip resolution; releases when both cards finish flipping back, OR immediately if matched. |
| Card hover lift | 120ms | ease-out | `translateY(-2px)` + shadow upgrade. Only on `face-down` and not when board is locked. |
| Button hover | 120ms | ease-out | Background shift + 1px shadow. |
| Button active/pressed | 80ms | ease-in | `translateY(1px)`, shadow removed. |
| Win panel appear | 200ms | ease-out | Fade backdrop 0→1, panel scale 0.96→1 + fade. |
| Error banner appear | 150ms | ease-out | Slide down 8px + fade. |

**Reduced motion:** when `(prefers-reduced-motion: reduce)`, replace flip with instant face swap (opacity 0→1 over 80ms), drop hover lifts, drop win-panel scale.

**Board lock signal:** while locked, set `pointer-events: none` on all unmatched face-down cards and `cursor: not-allowed`. No additional banner — the visible flipped pair is sufficient feedback.

---

## 8. Microcopy

Exact strings. Do not paraphrase in implementation.

| Surface | String |
|---|---|
| App title | `Memory` |
| Subtitle (Idle) | `A card-matching game with AI-generated decks.` |
| Theme input label | `Theme` |
| Theme input placeholder | `e.g. Renaissance painters` |
| Theme hint | `Try: "1990s sitcoms", "deep sea creatures", "Cyberpunk villains"` |
| Generate button (default) | `Generate Deck` |
| Generate button (loading) | `Generating...` |
| Loading helper | `Asking Claude for 8 pairs...` |
| Default deck link | `Play with default deck` |
| Empty input error | `Enter a theme to generate a deck.` |
| API error message | `Couldn't reach Claude. Playing with the default deck.` |
| Timeout message | `That took too long. Playing with the default deck.` |
| Error banner action | `Try again` |
| HUD theme line | `Theme: {theme}` (omit row entirely if default deck) |
| HUD moves label | `Moves` |
| HUD time label | `Time` |
| New game button | `New Game` |
| Win panel headline | `You won` |
| Win panel stats | `{moves} moves · {mm:ss}` |
| Win panel button | `New Game` |

---

## 9. Accessibility (MVP-Level)

Full WCAG AA audit is **deferred** (see PRD §4). MVP commitments:

- **Tab order** (Idle): Theme input → Generate Deck → Play with default deck.
- **Tab order** (Playing): New Game → Card 1 → Card 2 → ... → Card 16 (row-major).
- **Tab order** (Won): New Game (panel) is autofocused on win.
- **Focus ring:** `outline: 2px solid var(--border-strong); outline-offset: 2px;` on all focusable elements. Never `outline: none` without a replacement.
- **ARIA:**
  - Cards: `<button type="button" aria-label="Card {n}, face down">` → on flip, update to `aria-label="Card {n}, {label}"` and `aria-pressed="true"`. Matched cards get `aria-disabled="true"`.
  - Board container: `role="grid"` with `aria-label="Memory board"`. Rows `role="row"`, cells `role="gridcell"`.
  - Timer: `aria-live="off"` (avoid screen-reader spam every second).
  - Move counter: `aria-live="polite"`.
  - Error banner: `role="alert"`.
  - Win panel: `role="dialog" aria-modal="true" aria-labelledby="win-heading"`, focus trapped to its New Game button.
- **Reduced motion:** honored as specified in §7.
- **Known debt:** screen-reader narration of game flow, color-contrast audit on all states, full keyboard play with Enter/Space on cards (Enter/Space *will* work because cards are `<button>`).

---

## 10. Responsive Behavior

- **Target:** desktop Chrome at **1280×800** and **1920×1080**.
- **Min supported width:** 1280px. Below 1280, layout is allowed to break — ship a `<noscript>`-style note only if trivially cheap, otherwise ignore.
- **At 1920px:** content max-width stays at 960px; board does **not** grow. The extra width becomes whitespace. This is intentional — scaling the board makes 1920 feel sparse and 1280 feel cramped.
- **No mobile, no tablet, no portrait.** Explicit non-goal per PRD §4.

---

## 11. Implementation Notes for Engineers

### 11.1 Recommended HTML structure (Board)

```html
<main class="app">
  <header class="hud">
    <h1>Memory</h1>
    <button class="btn-secondary" data-action="new-game">New Game</button>
    <div class="hud-stats">
      <span class="theme-line">Theme: Renaissance painters</span>
      <span><strong>Moves</strong> 04</span>
      <span><strong>Time</strong> 00:23</span>
    </div>
  </header>

  <div class="board" role="grid" aria-label="Memory board">
    <div role="row">
      <button class="card" role="gridcell" data-state="down" aria-label="Card 1, face down">
        <span class="card-inner">
          <span class="card-face card-face--back">?</span>
          <span class="card-face card-face--front">
            <span class="card-emoji">🎨</span>
            <span class="card-label">Da Vinci</span>
          </span>
        </span>
      </button>
      <!-- ...cards 2–4 -->
    </div>
    <!-- ...rows 2–4 -->
  </div>
</main>
```

### 11.2 CSS flip approach

```css
.card { perspective: 800px; background: transparent; border: 0; padding: 0; }
.card-inner {
  position: relative;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  transition: transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card[data-state="up"]      .card-inner,
.card[data-state="matched"] .card-inner { transform: rotateY(180deg); }

.card-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  border-radius: var(--radius-md);
}
.card-face--front { transform: rotateY(180deg); }

@media (prefers-reduced-motion: reduce) {
  .card-inner { transition: none; }
  .card-face { transition: opacity 80ms linear; }
}
```

### 11.3 State ownership

| State | Owner | Notes |
|---|---|---|
| `appState` (`idle` / `generating` / `playing` / `won` / `error`) | App root | Single source of truth for which screen renders. |
| `deck` (8 pairs, shuffled to 16 cards) | App root | Survives New Game (reshuffles same deck). |
| `flipped` (indices of currently face-up unmatched cards, length 0–2) | Board | Drives lock + match check. |
| `matched` (Set of matched indices) | Board | Win condition: `matched.size === 16`. |
| `locked` (boolean) | Board | True during the 1.0s flip-back hold. |
| `moves` | HUD (or App root) | Increments on second-flip resolution. |
| `elapsedMs` | Timer (interval lives here) | Starts on first flip event bubbled from Board. Stops on `appState === 'won'`. |
| `theme` (string) | App root | Passed to backend; rendered in HUD. |
| `errorMessage` | App root | Drives ErrorBanner. |

The Board should **not** own `moves` or `elapsed` — it emits `onPairResolved(matched: boolean)` and `onFirstFlip()` upward.

### 11.4 Default deck

Hardcode 8 pairs (emoji + label) somewhere statically importable. Used on initial load if user clicks "Play with default deck", and as the API-failure fallback. Suggested theme: generic objects (🍎 Apple, 🚗 Car, 🎵 Music, 🌙 Moon, 🔥 Fire, 🌳 Tree, ⭐ Star, 🐶 Dog).

---

## 12. Open Questions & Assumptions

| # | Item | Assumption / Question |
|---|---|---|
| 1 | Initial screen | **Assumed** the user sees Idle (theme input) on first load, *not* the default deck immediately. If product wants "instant playable default board on load with theme input as a side panel," confirm — it's a different layout. |
| 2 | New Game from Won state | **Assumed** New Game reshuffles the **current** deck (per PRD §3 Story 2). Does not refetch from Claude. Confirmed by PRD; flagged here for visibility. |
| 3 | Theme persistence between games | **Assumed** the theme string persists in HUD across New Game on the same deck. Cleared only when user generates a new deck. |
| 4 | Card label truncation | **Assumed** labels from Claude can be 1–2 words. Single-line ellipsis at 100% card width. If Claude returns longer phrases, we truncate. |
| 5 | "Play with default deck" link | **Assumed** present on Idle as a fast-path so judges aren't blocked on Claude latency. Not strictly in PRD but consistent with §6 (success criteria require playable end-to-end on API failure). Confirm. |
| 6 | Move counter semantics | **Assumed** "move" = one *pair evaluation* (i.e. increments after the 2nd flip resolves), per PRD Story 1 acceptance criterion. Not per individual flip. |
| 7 | Error banner auto-dismiss | **Assumed** banner auto-hides after the first card flip on the fallback deck so it doesn't linger through the whole game. If product prefers manual dismiss only, drop the auto-hide. |
| 8 | Board interactivity during win-panel display | **Assumed** board is non-interactive once won (no further flips). Win panel is non-dismissible except via New Game. |
