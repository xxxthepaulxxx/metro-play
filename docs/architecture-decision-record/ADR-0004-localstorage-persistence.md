# ADR-0004: localStorage for client-side persistence

**Status:** Accepted

**Decision Date:** 2026-08-11

## Context

Module 1's game state (pledge, prediction, settlement, balance) must survive page refresh so players don't lose progress if they accidentally close the tab or reload.

Without a backend, the only reliable local persistence mechanism available is the browser's Web Storage API. The choice is between `localStorage` (persistent across sessions) and `sessionStorage` (cleared on tab close).

For a hackathon demo, `localStorage` is the obvious choice: judges may walk away mid-game, return later, and expect to continue. `sessionStorage` would lose state, breaking the demo experience.

## Decision

Use **`localStorage`** for all Module 1 game state persistence.

**Implementation:** `pinia-plugin-persistedstate` (see ADR-0002) automatically serializes the Pinia store to a localStorage key after each state mutation.

**Reset mechanism:** The existing HTML prototype's "↺ 重置示範" (Reset Demo) button is preserved and updated to:
1. Call the Pinia store's `resetDay()` action (clears all state)
2. Clear the localStorage key (`localStorage.removeItem('offPeak')`)

**Storage key:** `offPeak` (matches store module name for convention)

## Alternatives Considered

### sessionStorage
- **Why rejected:** Data is lost when the tab closes. For a demo that judges may revisit later, this breaks continuity. Not suitable for a game where state persistence across browser sessions is critical.

### IndexedDB
- **Why rejected:** Overkill for this scope. IndexedDB is powerful for large datasets or complex queries, but the offPeak store is small (<10KB when serialized). localStorage is sufficient.

### Cookies
- **Why rejected:** Cookies are meant for server-client communication (sent with HTTP requests). For pure client-side persistence, localStorage is cleaner and more efficient.

### Service Worker + Cache API
- **Why rejected:** Complex setup for no benefit. The app is fully client-side; caching responses or assets is handled by Vite's build system and browser caching headers.

## Consequences

- **Storage quota:** localStorage has a 5–10MB quota per origin (browser-dependent). The offPeak store is <1MB, so quota is not a concern.
- **No automatic cleanup:** Old data persists indefinitely. The "↺ 重置示範" button or a manual `localStorage.clear()` is needed to reset.
- **Sync across tabs:** localStorage changes in one tab are NOT automatically synced to other tabs. If a player opens the game in two tabs and plays in one, the other tab won't see the updates. This is acceptable for a single-player game demo.
- **Transparent to components:** Because `pinia-plugin-persistedstate` handles writes, Vue components don't need to call `localStorage` directly. Persistence is automatic and transparent.
- **Security consideration:** localStorage is vulnerable to XSS attacks (inline scripts can read it). For a demo with no sensitive data, this is acceptable. Production should use secure session tokens and httpOnly cookies.

## Implementation Notes

**Plugin configuration** (`src/main.ts`):

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

**Reset button** (in existing HTML or new Vue component):

```typescript
// Method in Module1Home component
function resetDemo() {
  const offPeakStore = useOffPeakStore()
  offPeakStore.resetDay() // Clears store state
  localStorage.removeItem('offPeak') // Removes stored JSON
}
```

**Persisted store shape:**

```json
{
  "offPeak": {
    "pledge": false,
    "prediction": null,
    "settlement": null,
    "balance": { "carbon": 0, "rewards": 0 },
    "carbonFundPool": 0
  }
}
```

## References

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [pinia-plugin-persistedstate](https://sderickson.github.io/pinia-plugin-persistedstate/)
- ADR-0002 (Pinia state management)
- Existing prototype's "↺ 重置示範" button pattern
