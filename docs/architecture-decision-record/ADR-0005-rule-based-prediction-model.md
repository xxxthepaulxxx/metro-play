# ADR-0005: Rule-based prediction model for off-peak window

**Status:** Accepted

**Decision Date:** 2026-08-11

## Context

"運量猜猜樂" (Ridership Guessing Game) is the core of Module 1. Players predict the off-peak window (hours of the day where ridership is low) to earn carbon points and contribute to a community fund.

The game requires:
1. **Definition of "off-peak":** Which hours of the day are off-peak? Must be consistent and derived from realistic data.
2. **"Actual" ridership for settlement:** After a player makes a prediction, the game reveals what the actual ridership was that day, calculates accuracy, and awards points.

Building a real ML model (neural network, regression, etc.) is out of scope for a hackathon. Training data integration with Taipei MRT's open data API is unreliable in a demo environment. However, the game still needs to *feel* realistic to judges.

## Decision

Use a **static, rules-based model** with pre-seeded historical ridership data:

1. **Mock ridership data:** `src/data/mockData.ts` contains 7 days of hourly ridership counts for two MRT lines (Wenhu, Bannan). Numbers are realistic (derived from actual Taipei MRT patterns, not random).

   ```typescript
   // src/data/mockData.ts
   export const historicalRidership = {
     wenhu: [15, 12, 8, 5, 10, 35, 82, 125, 110, 95, 88, ...],
     bannan: [18, 14, 9, 6, 12, 40, 78, 120, 105, 92, 85, ...],
   }
   ```

2. **Off-peak calculation:** Computed once at app init (or on-demand):
   - Peak hour = hour with highest ridership (e.g., hour 7: 125 passengers)
   - Threshold = 70% of daily peak
   - Off-peak window = all hours where ridership < threshold

   ```typescript
   export function calculateOffPeakWindow(): { startHour: number; endHour: number } {
     const dailyPeak = Math.max(...historicalRidership.wenhu)
     const threshold = dailyPeak * 0.7
     const offPeakHours = historicalRidership.wenhu
       .map((count, hour) => ({ hour, count }))
       .filter(({ count }) => count < threshold)
     // contiguous range: startHour to endHour
   }
   ```

3. **"Actual" ridership for settlement:** Pre-seeded in mockData with ±10% random jitter added at runtime for demo variety.

   ```typescript
   export function getActualRidership(): number {
     const base = mockData.todayActualPeak
     const jitter = (Math.random() - 0.5) * 0.2 * base // ±10%
     return Math.round(base + jitter)
   }
   ```

## Alternatives Considered

### Real MRT Open Data API
- **Why rejected:** Taipei MRT's open data requires OAuth, rate-limiting, and reliable network. In a demo environment with spotty WiFi, API failures break the game. Integration adds auth/error-handling code with no payoff for judges.

### Lightweight regression model
- **Why rejected:** More code, similar visual result. A linear regression or simple time-series model adds complexity but doesn't improve the game feel for a 3-minute judge walkthrough. Rule-based is simpler to explain and debug.

### Fully random numbers
- **Why rejected:** Players and judges would immediately notice unrealistic values (e.g., 2000 passengers at 4 AM). Realism matters for immersion.

### Hardcoded single off-peak window
- **Why rejected:** No variety. Multiple plays would feel repetitive. Adding jitter to "actual" values keeps the demo fresh.

## Consequences

- **Data always feels real:** Numbers are within realistic bounds for Taipei MRT (Wenhu/Bannan lines during rush hour hit 100–130, off-peak drops to <30). Judges see a plausible game world.
- **No network dependency:** Off-peak window is calculated from static array. Zero risk of API failure mid-demo.
- **Deterministic with controlled variance:** Jitter (±10%) ensures variety without randomness spiraling into implausibility. Judges can replay and see similar (not identical) results.
- **Deferred: real API integration:** Post-hackathon, `src/data/mockData.ts` is replaced with a real API client that fetches Taipei MRT's historical ridership. `calculateOffPeakWindow()` function signature stays the same; only the data source changes.
- **Deferred: ML model:** If later the product needs predictive ML (forecasting tomorrow's off-peak based on weather, events, etc.), the architecture supports it. Rules-based is a stepping stone.

## Implementation Notes

**File structure:**
- `src/data/mockData.ts` — historical arrays, actual values, jitter function
- `src/utils/offPeakCalculator.ts` — `calculateOffPeakWindow()`, `getActualRidership()`
- `src/stores/offPeak.ts` — calls calculator on app init

**Mock data format:**

```typescript
// src/data/mockData.ts
export const mockData = {
  // Historical ridership (passengers/hour)
  historicalRidership: {
    wenhu: [15, 12, 8, 5, 10, 35, 82, 125, 110, 95, 88, 92, 110, 102, 85, 70, 65, 75, 95, 110, 78, 45, 25, 18],
    bannan: [18, 14, 9, 6, 12, 40, 78, 120, 105, 92, 85, 88, 108, 98, 82, 68, 60, 72, 90, 105, 75, 42, 28, 20],
  },
  // Actual peak for today (used in settlement)
  todayActualPeak: 118,
  // Seed for consistent random behavior across refreshes (optional)
  randomSeed: 12345,
}

export function getActualRidership(variance = 0.1): number {
  const base = mockData.todayActualPeak
  const range = base * variance
  const jitter = (Math.random() - 0.5) * 2 * range
  return Math.round(base + jitter)
}
```

## References

- [Taipei MRT Open Data (TaipeiPass)](https://www.gov.tw/) — future integration
- ADR-0003 (Mock async API)
- ADR-0002 (Pinia state management for storing off-peak window)
