# ADR-0002: Pinia for state management

**Status:** Accepted

**Decision Date:** 2026-08-11

## Context

The existing HTML prototype uses a hand-rolled `AppStore` object with subscribe/notify listeners for state management. This pattern works for small demos but lacks type safety, composability, and testing infrastructure.

Module 1 (Off-Peak Prediction Game) requires a structured state layer to track:
- Player's daily pledge (commit to off-peak travel)
- Prediction (guess the off-peak window's ridership)
- Settlement (actual vs. predicted ridership, point award)
- Balance (carbon points, rewards)
- Pool state (community carbon fund accumulation)

The existing `AppStore.actions.*` pattern is familiar to the team, so migration should feel natural.

## Decision

Adopt **Pinia** (Vue's official state management library) for all Module 1 game state.

**Why Pinia:**
- Official Vue library with first-class TypeScript support
- Actions map naturally to the existing `AppStore.actions.*` pattern, easing migration
- `pinia-plugin-persistedstate` replaces manual localStorage writes, reducing boilerplate
- Small bundle footprint (~2KB), no setup overhead
- Testing is simple: stores are just functions, mockable without special utilities

**Architecture:**
- Single store module: `src/stores/offPeak.ts`
- State shape: `{ pledge, prediction, settlement, balance, carbonFundPool }`
- Actions: `commitPledge()`, `makePrediction()`, `verifySurvey()`, `settleDay()`, `resetDay()`
- Getters: `offPeakWindow`, `pointsEarned`, `totalCarbon`

## Alternatives Considered

### Vuex (Vue 2 legacy state management)
- **Why rejected:** Vuex is older, more verbose, and Vue 3's ecosystem has moved toward Pinia. Vuex is better for large enterprise apps; Pinia is lightweight and idiomatic for Vue 3.

### Keep hand-rolled store
- **Why rejected:** No TypeScript support, no persistence plugin, and testing becomes manual. As state grows, the hand-rolled approach becomes a maintenance burden.

### Context API (from React world)
- **Why rejected:** Not applicable—Vue doesn't have an equivalent Context API. Pinia is Vue's idiomatic choice.

## Consequences

- **All Module 1 state centralized:** Every state change flows through `src/stores/offPeak.ts`, making debugging and auditing easier.
- **Existing HTML prototype unchanged:** The old `store.js` in the HTML prototype remains as-is for reference / fallback demo. It is NOT replaced or integrated with Pinia.
- **Persistence is automatic:** `pinia-plugin-persistedstate` watches the store and writes to localStorage. The "↺ 重置示範" reset button calls `resetDay()` and clears the localStorage key.
- **Testing is straightforward:** Unit tests can import and instantiate the store directly without mocking Context or Provider components.
- **Server-side integration deferred:** When a real backend is added, actions in `offPeak.ts` will call real API endpoints instead of mock functions (see ADR-0003).

## Implementation Notes

**Store structure** (`src/stores/offPeak.ts`):

```typescript
// State
interface OffPeakState {
  pledge: boolean
  prediction: { startHour: number; endHour: number } | null
  settlement: { actual: number; predicted: number; correct: boolean } | null
  balance: { carbon: number; rewards: number }
  carbonFundPool: number
}

// Actions
const actions = {
  commitPledge() { /* ... */ },
  makePrediction() { /* ... */ },
  verifySurvey() { /* ... */ },
  settleDay() { /* ... */ },
  resetDay() { /* ... */ },
}

// Getters
const getters = {
  offPeakWindow: (state) => { /* ... */ },
  pointsEarned: (state) => { /* ... */ },
}
```

## References

- [Pinia Docs](https://pinia.vuejs.org/)
- [pinia-plugin-persistedstate](https://sderickson.github.io/pinia-plugin-persistedstate/)
- ADR-0001 (Vue 3 + Vite framework)
- ADR-0003 (Mock async API)
