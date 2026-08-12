---
status: sliced
sliced_at: 2026-08-12
---

# Implement Detail: metro-off-peak-prediction (Vue 3 + Vite Build)

## 1. Overview

This document specifies the implementation of Module 1 (Off-Peak Prediction Game) as a **separate Vue 3 + Vite web application** running independently from the existing pure-HTML prototype. The build is a mobile web-first SPA (375px viewport minimum) with no build-time SSR, packaged for rapid hackathon iteration.

## 2. Architecture Summary

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Vue 3 + TypeScript | See ADR-001: Vue 3 + Vite over React |
| Build toolchain | Vite | Zero-config, sub-second HMR, native TS support |
| State management | Pinia | See ADR-002: Pinia over Vuex / AppStore |
| Routing | Vue Router 4 | Tab-based Module 1 UI; multi-view navigation |
| Persistence | localStorage + pinia-plugin-persistedstate | See ADR-004: localStorage persistence |
| Data layer | Mock async API | See ADR-003: Mock async API over real backend |
| Prediction logic | Rule-based model | See ADR-005: Rule-based prediction model |

---

## 3. Project Structure & Module Layout

```
metro-play-vue/          ← new Vite project root (separate repo or subdirectory)
├── index.html           ← Vite entry point
├── vite.config.ts       ← Vite configuration (Vue plugin, TypeScript)
├── tsconfig.json        ← TypeScript strict mode
├── package.json
├── src/
│   ├── main.ts          ← Bootstrap Vue app, mount to #app
│   ├── App.vue          ← App Shell: tab bar, route outlet, gradient bg, particles
│   ├── stores/
│   │   └── offPeak.ts   ← Pinia store (state + actions)
│   ├── views/
│   │   ├── Module1Home.vue       ← [P1-1] Peak forecast, off-peak window, game entry CTAs
│   │   ├── GameA.vue             ← [P1-2a] Commitment pledge (stake selector, confirm button)
│   │   └── GameB.vue             ← [P1-2b] Ridership prediction (slider, submit)
│   ├── components/
│   │   └── SettlementOverlay.vue ← [P1-3] Full-screen result overlay (reward/forfeit card)
│   ├── api/
│   │   ├── mockApi.ts            ← Async mock functions (simulate network delay)
│   │   └── mockData.ts           ← Static ridership data + off-peak window calculation
│   └── styles/
│       └── main.css              ← Global styles (gradient, glassmorphism, tokens)
└── public/
    └── favicon.ico
```

---

## 4. Core State Management (offPeak.ts)

**Location:** `src/stores/offPeak.ts`

### State Shape
For full state schema, see [data-model.md](#) (linked in future).

**Key entities:**
- `userBalance` — current point balance
- `carbonFundPool` — cumulative forfeited points
- `dailyPledge` — today's Game A commitment (stake, timestamp, status)
- `dailyPrediction` — today's Game B submission (range, timestamp)
- `offPeakWindow` — today's dynamic off-peak window (start/end timestamps)
- `activityLog` — audit trail of all actions
- `lastResetDate` — for daily boundary detection

### Core Actions

| Action | Signature | Behaviour |
|--------|-----------|-----------|
| `commitPledge(stake: number)` | `async` | Deducts stake from balance; records pledge + today's off-peak window; persists via pinia-plugin-persistedstate |
| `submitPrediction(range: [min, max])` | `sync` | Records predicted ridership range and timestamp |
| `verifyEntry(timestamp: number)` | `sync` | Checks timestamp against `offPeakWindow`; marks pledge as success or failure; guards settle() calls |
| `settle()` | `sync` | Calculates reward or forfeit per game logic; updates balance and `carbonFundPool`; applies combo multiplier if both games succeeded |
| `resetDay()` | `sync` | Clears `dailyPledge` and `dailyPrediction` at day boundary (called by main.ts on app load if date changed) |
| `simulateGateTap(timestamp?: number)` | `sync` | Demo helper: calls `verifyEntry()` + `settle()` in sequence; used by demo script for judge walkthrough |

### Persistence

**Plugin:** `pinia-plugin-persistedstate`
- Configured in `main.ts` to persist the `offPeakStore` to localStorage
- Key: `offPeakStore` (configurable)
- Hydration on app load restores previous session state

**Failure mode:** If localStorage quota exceeded, catch error in plugin setup and show toast; app continues without persistence.

---

## 5. API Contract & Mock Layer

**Locations:**
- `src/api/mockApi.ts` — async mock endpoint implementations
- `src/api/mockData.ts` — static test data + off-peak calculation logic

See [api-contract.md](#) for full endpoint specifications (linked in future).

### Mock Functions

| Function | Returns | Delay | Purpose |
|----------|---------|-------|---------|
| `fetchOffPeakWindow(lineId, date)` | `{ start, end, confidence }` | 500ms | Returns dynamic off-peak window for today |
| `fetchRidershipForecast(lineId, date)` | `{ yesterday, forecast }` | 400ms | Returns previous day's actual + statistical forecast |
| `submitPledge(stake)` | `{ success, message }` | 300ms | Simulates pledge API; always succeeds in demo |
| `submitPrediction(range)` | `{ success, message }` | 300ms | Simulates prediction API; always succeeds in demo |
| `verifyGateTap(timestamp)` | `{ offPeak, window }` | 800ms | Simulates backend verification; returns boolean + window context |

### Off-Peak Window Calculation

**Location:** `src/api/mockData.ts`

- Input: line ID, date
- Logic: Rule-based (see ADR-005)
  - Extracts yesterday's ridership data
  - Identifies trough in hourly distribution (e.g., 10:00–11:00)
  - Returns start/end timestamps
  - For demo: windows are deterministic (not random) so judges see consistent behavior

---

## 6. View Components & User Flow

### Module1Home (P1-1)
**File:** `src/views/Module1Home.vue`

- Displays:
  - Today's peak congestion forecast (chart or text)
  - Current off-peak window (prominently highlighted)
  - Point balance
  - Two CTAs: "Play Game A" and "Play Game B"

- Triggers:
  - On mount: dispatch `fetchOffPeakWindow()` → show loading state while waiting
  - Navigate to GameA or GameB on CTA click

### GameA (P1-2a: Commitment Pledge)
**File:** `src/views/GameA.vue`

- Displays:
  - Off-peak window (from store state, already fetched)
  - Peak hour forecast context
  - Stake input (min 10 pts enforced, max = userBalance)
  - Expected max return calculator (shows 2× or 3× depending on Game B status)
  - "Confirm Pledge" button

- On confirm:
  - Dispatch `commitPledge(stake)` → deducts balance, records pledge, persists
  - Navigate to settlement overlay (simulated gate tap)

### GameB (P1-2b: Ridership Prediction)
**File:** `src/views/GameB.vue`

- Displays:
  - Reference data: yesterday's ridership + forecast chart
  - Slider for range selection (e.g., 100k–200k)
  - Submit button

- On submit:
  - Dispatch `submitPrediction(range)` → records prediction
  - Navigate to settlement overlay

### SettlementOverlay (P1-3)
**File:** `src/components/SettlementOverlay.vue`

- Full-screen modal
- Flow:
  1. Show "Verifying entry..." loading state (500ms)
  2. Dispatch `simulateGateTap(timestamp)` (or `verifyEntry()` + `settle()` explicitly)
  3. Animate result card (reward or forfeit) with point changes
  4. Show:
     - Standalone rewards OR
     - Combo reward + carbon-reduction badge (if both games succeeded)
  5. "Back to Home" button

---

## 7. App Shell (App.vue)

**File:** `src/App.vue`

- Global layout:
  - Header (branding, balance display)
  - Tab bar navigation (Module1Home, GameA, GameB)
  - Router outlet for view rendering
  - Gradient background (see CLAUDE.md design taste)
  - Floating particle decorations (CSS animations, no JavaScript loop)

- Mounted hooks:
  - Check if date has changed since last session; dispatch `resetDay()` if so
  - Initialize store hydration (pinia-plugin-persistedstate)

---

## 8. Reward Logic & Combo Multiplier

**Implemented in:** `offPeakStore.settle()`

### Calculation Rules

1. **Game A Verification:**
   - If `dailyPledge.status === 'success'`: eligible for Game A reward
   - Reward: `stake × 2` (base multiplier)

2. **Game B Verification:**
   - If `dailyPrediction.correct === true`: eligible for Game B reward
   - Reward: fixed 30 pts

3. **Combo Check:**
   - If Game A success AND Game B success: override standalone rewards
   - Combo reward: `stake × 3` (replaces 2× + 30 pts)
   - Add carbon-reduction badge to UI

4. **Forfeit (Game A failure):**
   - If `dailyPledge.status === 'forfeit'`: deduct stake from balance (already done at commit time)
   - Add stake amount to `carbonFundPool`

### Guardrails

- `settle()` is a no-op if `verifyEntry()` has not been called (check `dailyPledge.status`)
- Combo check is atomic with settle (cannot separate reward application)

---

## 9. Failure Mode Handling

| Scenario | Handling | Code Location |
|----------|----------|---|
| User commits but doesn't ride | `resetDay()` called at day boundary; stake already deducted at commit time; no grace period | `App.vue mounted hook` |
| Off-peak window not yet calculated | Show loading skeleton in Module1Home; mockData always returns a window for demo (never fails) | `Module1Home.vue onMounted` |
| Settlement called before verify | Guard in `offPeakStore.settle()`: check `dailyPledge.status` before applying rewards | `offPeak.ts settle()` |
| localStorage quota exceeded | Catch error in pinia-plugin-persistedstate setup; show toast; continue without persistence | `main.ts` store config |
| User stakes 0 or invalid amount | Input validation in GameA: min 10 pts, max = balance; button disabled if invalid | `GameA.vue v-model validation` |
| Ridership data unavailable | For demo, mockData always returns data; in production would disable GameB with UI message | `mockData.ts fetchRidershipForecast()` |

---

## 10. Observability & Demo Helpers

### Activity Logging

All store actions append to `activityLog[]`:
- Timestamp
- Action name (commitPledge, verifyEntry, settle, etc.)
- Input parameters and result

Example:
```json
{
  "timestamp": 1691234567000,
  "action": "commitPledge",
  "stake": 20,
  "result": "success"
}
```

### Demo Mode

**Trigger:** `AppStore.simulateGateTap(timestamp)`

- Called by demo script for judges
- Invokes `verifyEntry(timestamp)` + `settle()` in sequence
- Allows deterministic, repeatable gate-tap verification without external input
- Judges see full commit → predict → verify → settle flow in <3 minutes

---

## 11. Rollout Plan

1. **Scaffold Vite project**
   ```bash
   npm create vite@latest metro-play-vue -- --template vue-ts
   ```

2. **Install dependencies**
   ```bash
   npm install vue-router@4 pinia pinia-plugin-persistedstate
   npm install -D typescript @types/node
   ```

3. **Implement data layer**
   - `src/api/mockData.ts` — static test data + off-peak calculation logic
   - `src/api/mockApi.ts` — async mock functions with simulated delays

4. **Implement state management**
   - `src/stores/offPeak.ts` — Pinia store with all actions and persistence config

5. **Implement App shell**
   - `src/App.vue` — global layout, tab bar, routing outlet, day-boundary reset
   - `src/main.ts` — Vue app bootstrap, pinia setup, router setup

6. **Implement views**
   - `src/views/Module1Home.vue` → (P1-1)
   - `src/views/GameA.vue` → (P1-2a)
   - `src/views/GameB.vue` → (P1-2b)

7. **Implement settlement**
   - `src/components/SettlementOverlay.vue` → (P1-3)

8. **Wire demo script trigger**
   - Expose `simulateGateTap()` on store for demo-script.md

---

## 12. Deferred Items

| Item | Trigger for Undefer |
|------|-------------------|
| Real MRT API integration | MRT open-data API access granted |
| Anti-cheat (GPS/EasyCard timestamp verification) | Native app development begins |
| Modules 2–4 (blind-box travel, exclusive perks, city RPG) | Module 1 demo approved by judges |

---

## 13. Related Documentation

**Requirement:** [requirement.md](./requirement.md)
**Critical Path:** [critical-path.md](./critical-path.md)
**Glossary:** [glossary.md](./glossary.md)

**Architecture Decisions:**
- [ADR-001](../../architecture/adr-001-vue3-vite.md) — Vue 3 + Vite over React
- [ADR-002](../../architecture/adr-002-pinia.md) — Pinia over Vuex / AppStore
- [ADR-003](../../architecture/adr-003-mock-api.md) — Mock async API over real backend
- [ADR-004](../../architecture/adr-004-localstorage.md) — localStorage persistence
- [ADR-005](../../architecture/adr-005-rule-based-model.md) — Rule-based prediction model

**API & Data:**
- [api-contract.md](../../architecture/api-contract.md) — endpoint signatures
- [data-model.md](../../architecture/data-model.md) — state schema, entity relationships

**Operations:**
- [run-vue-dev.md](../../runbooks/dev/run-vue-dev.md) — local dev setup
- [demo-script.md](../../runbooks/ops/demo-script.md) — hackathon judge walkthrough

**Design:**
- [design-system/overview.md](../../design-system/overview.md)
