# ADR-0003: Mock async API over real backend

**Status:** Accepted

**Decision Date:** 2026-08-11

## Context

The hackathon operates under tight scope constraints: no backend infrastructure exists, and no real MRT API integration is planned for the demo phase. The product will be judged entirely on frontend gameplay, visual design, and user flow clarity.

However, the game mechanics depend on server-like operations:
- Committing a pledge (writing to backend)
- Submitting a prediction (validation + storage)
- Verifying a survey (reading actual ridership data)
- Settling the day (calculating points, updating balance)

Fully mocking these operations synchronously would make the game feel unrealistic. Instead, we introduce simulated network latency to approximate real-world behavior without backend infrastructure.

## Decision

All "API calls" are **async TypeScript functions** in `src/api/mockApi.ts` that:
1. Accept parameters matching what a real REST endpoint would receive
2. Return data shapes matching what production endpoints would return
3. Include simulated network delay (300–800ms random per call)
4. Are deterministic and fully offline-capable

**Example:**
```typescript
// src/api/mockApi.ts
export async function commitPledge(userId: string): Promise<{ success: boolean }> {
  await delay(Math.random() * 500 + 300) // 300-800ms
  return { success: true }
}

export async function verifySurvey(userId: string): Promise<ActualRidership> {
  await delay(Math.random() * 500 + 300)
  return { wenhuPeak: 85, bannanPeak: 72, timestamp: Date.now() }
}
```

**Future migration:** When a real backend is added, swap `src/api/mockApi.ts` for `src/api/realApi.ts`. Function signatures stay the same; Pinia actions (ADR-0002) remain unchanged.

## Alternatives Considered

### MSW (Mock Service Worker)
- **Why rejected:** Powerful tool for intercepting actual HTTP requests, but adds setup complexity (service worker registration, request interception rules). For a demo with no real network calls, MSW introduces overhead without benefit.

### json-server
- **Why rejected:** Useful for prototyping with real REST endpoints and a JSON database file. But json-server is a separate process to manage, and the hackathon scope doesn't require it—async mock functions are simpler and fully self-contained.

### Synchronous mock functions (no delay)
- **Why rejected:** Removes realism. Players might not perceive that their action was processed. A tiny delay (300–800ms) makes the interaction feel like a real system.

## Consequences

- **Fully offline:** No network calls. Game works anywhere, anytime. Perfect for demo at venues with unreliable WiFi.
- **Deterministic data:** All responses are pre-seeded (see ADR-0005). Players see consistent behavior, aiding reproducible demo walkthroughs.
- **One-file swap for production:** When real backend is ready, replace `src/api/mockApi.ts` with a real API client. No changes to Pinia store or component code.
- **No auth/session management:** Mock API does not check credentials or tokens. Production API integration will add auth layer (deferred ADR).
- **Latency simulation:** The mock delay is arbitrary (300–800ms). Real backend latency may differ; perf optimizations can be applied later.

## Implementation Notes

**File structure:**
- `src/api/mockApi.ts` — all async mock functions
- `src/api/types.ts` — shared TypeScript interfaces (commitment, prediction, settlement, ridership)
- Pinia store (`src/stores/offPeak.ts`) imports and calls functions from `mockApi.ts` in action handlers

**Delay helper:**
```typescript
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

**Data structure:**
- Mock ridership data lives in `src/data/mockData.ts` (see ADR-0005)
- Each API function reads from mockData and returns a realistic response

## References

- [Mock Service Worker (MSW)](https://mswjs.io/) — alternative, not chosen
- [json-server](https://github.com/typicode/json-server) — alternative, not chosen
- ADR-0002 (Pinia state management)
- ADR-0004 (localStorage persistence)
- ADR-0005 (Rule-based prediction model)
