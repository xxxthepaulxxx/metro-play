# City RPG Unlock Store — Data Model

**Module:** 城市探險解鎖 (City RPG Unlock)
**Document:** Data Model Schema
**Date:** 2026-08-24
**Status:** Active

---

## Store Identity

| Property | Value |
|----------|-------|
| **File** | `frontend/src/stores/cityRpg.ts` |
| **Store ID** | `"city-rpg-store"` |
| **Pattern** | Setup function: `defineStore('city-rpg-store', () => { ... })` |
| **Persistence** | Custom serializer (Set ↔ Array conversion) |
| **Framework** | Pinia (Vue 3) |

---

## State

All state is managed via Vue `ref` primitives with reactive Set collections and custom serialization.

### visitedStationIds

```typescript
const visitedStationIds = ref<Set<string>>(new Set())
```

**Purpose:** Tracks which stations the player has visited across the city RPG unlock mechanic.

**Type:** `Set<string>` wrapped in `ref`
**Initial:** Empty set
**Mutated by:** `visitStation()` action
**Persisted:** Yes (serialized as `string[]`)

### claimedDistrictBonuses

```typescript
const claimedDistrictBonuses = ref<Set<string>>(new Set())
```

**Purpose:** Tracks which district unlock bonuses have already been claimed (prevents double-credit).

**Type:** `Set<string>` wrapped in `ref`
**Initial:** Empty set
**Mutated by:** `visitStation()` action (when district first unlocks)
**Persisted:** Yes (serialized as `string[]`)

---

## Persistence Configuration

The store uses a custom serializer to convert Sets to/from JSON-serializable arrays:

```typescript
persist: {
  key: "city-rpg-store",
  serializer: {
    serialize(state): string {
      return JSON.stringify({
        visitedStationIds: [...state.visitedStationIds],
        claimedDistrictBonuses: [...state.claimedDistrictBonuses],
      })
    },
    deserialize(raw: string) {
      const parsed = JSON.parse(raw)
      return {
        visitedStationIds: new Set(parsed.visitedStationIds ?? []),
        claimedDistrictBonuses: new Set(parsed.claimedDistrictBonuses ?? []),
      }
    },
  },
}
```

**Why custom serializer:** Vue's default persistence cannot serialize JavaScript Set objects. The serializer:
- **On write:** Spreads both Sets into arrays for JSON.stringify
- **On load:** Reconstructs Sets from arrays with nullish coalescing fallback for missing keys

---

## Computed Getters

### DistrictProgress Interface

```typescript
interface DistrictProgress {
  id: string
  name: string
  icon: string
  stations: StationDef[]
  threshold: number
  bonusPoints: number
  visitedCount: number
  totalStations: number
  unlocked: boolean
  bonusClaimed: boolean
}
```

| Field | Type | Source | Meaning |
|-------|------|--------|---------|
| `id` | string | DISTRICTS entry | Unique district identifier |
| `name` | string | DISTRICTS entry | Localized district name |
| `icon` | string | DISTRICTS entry | Emoji or icon name for district |
| `stations` | StationDef[] | DISTRICTS entry | Array of station definitions in district |
| `threshold` | number | DISTRICTS entry | Min visited count to unlock |
| `bonusPoints` | number | DISTRICTS entry | Points awarded on first unlock |
| `visitedCount` | number | Computed | Intersection count: stations in district AND in visitedStationIds |
| `totalStations` | number | Computed | `stations.length` |
| `unlocked` | boolean | Computed | `visitedCount >= threshold` |
| `bonusClaimed` | boolean | Computed | `id` in claimedDistrictBonuses |

### districtProgress (Computed)

```typescript
const districtProgress = computed((): DistrictProgress[] => {
  return DISTRICTS.map((district) => {
    const visitedCount = district.stations.filter(
      (station) => visitedStationIds.value.has(station.id)
    ).length

    const unlocked = visitedCount >= district.threshold
    const bonusClaimed = claimedDistrictBonuses.value.has(district.id)

    return {
      ...district,
      visitedCount,
      totalStations: district.stations.length,
      unlocked,
      bonusClaimed,
    }
  })
})
```

**Purpose:** Derives full progress state for each district without mutation.

**Returns:** Array of DistrictProgress objects, sorted by DISTRICTS order.

**Reactivity:** Recomputes when:
- `visitedStationIds` changes (Set reference replacement)
- `claimedDistrictBonuses` changes (Set reference replacement)
- DISTRICTS constant changes (rare)

### overallProgress (Computed)

```typescript
const overallProgress = computed((): {
  visited: number
  total: number
  percent: number
} => {
  const total = DISTRICTS.reduce(
    (sum, d) => sum + d.stations.length,
    0
  )
  const visited = visitedStationIds.value.size

  return {
    visited,
    total,
    percent: total > 0 ? Math.round((visited / total) * 100) : 0,
  }
})
```

**Purpose:** One-line progress summary across all districts.

**Returns:**
- `visited`: Total unique stations visited (cardinality of visitedStationIds)
- `total`: Total stations across all districts
- `percent`: Percentage (0–100, rounded)

**Reactivity:** Recomputes when `visitedStationIds` changes.

---

## Actions

### visitStation(stationId: string)

```typescript
const visitStation = (stationId: string): {
  newlyUnlocked: boolean
  districtId: string | null
} => {
  // Already visited: no-op
  if (visitedStationIds.value.has(stationId)) {
    return { newlyUnlocked: false, districtId: null }
  }

  // Find the district containing this station
  const district = DISTRICTS.find((d) =>
    d.stations.some((s) => s.id === stationId)
  )

  if (!district) {
    console.warn(`Station ${stationId} not found in DISTRICTS`)
    return { newlyUnlocked: false, districtId: null }
  }

  // Add station (replace Set to trigger Vue reactivity)
  visitedStationIds.value = new Set([
    ...visitedStationIds.value,
    stationId,
  ])

  // Check if district just unlocked
  const updatedVisitedCount = district.stations.filter((s) =>
    visitedStationIds.value.has(s.id)
  ).length

  const justUnlocked =
    updatedVisitedCount === district.threshold &&
    !claimedDistrictBonuses.value.has(district.id)

  // Claim bonus if just unlocked
  if (justUnlocked) {
    claimedDistrictBonuses.value = new Set([
      ...claimedDistrictBonuses.value,
      district.id,
    ])
    useWalletStore().credit(district.bonusPoints)
  }

  return {
    newlyUnlocked: justUnlocked,
    districtId: district.id,
  }
}
```

**Signature:**
```typescript
visitStation(stationId: string): {
  newlyUnlocked: boolean
  districtId: string | null
}
```

**Logic:**

1. **Early return if already visited:** If `stationId` already exists in `visitedStationIds`, return `{ newlyUnlocked: false, districtId: null }` (prevents double-credit).

2. **Find district:** Search DISTRICTS for the station. If not found, warn and return early.

3. **Add to visited set (immutable):** Create new Set by spreading the existing set plus the new station. Replace the ref (this triggers Vue reactivity — in-place `.add()` does not).

4. **Check unlock threshold:** Count stations in the district that are now visited. Compare to district threshold.

5. **Claim bonus on first unlock:**
   - If `justUnlocked` (count == threshold) AND bonus not yet in `claimedDistrictBonuses`:
     - Add district.id to `claimedDistrictBonuses` (via Set replacement)
     - Call `useWalletStore().credit(district.bonusPoints)` to award points
   - Otherwise, skip bonus credit.

6. **Return:** `{ newlyUnlocked: justUnlocked, districtId: district.id }`

**Return fields:**
- `newlyUnlocked`: `true` if this action just crossed the unlock threshold for the district
- `districtId`: ID of the district (or null if station not found)

**Why Set replacement matters:**

> Vue 3 reactivity system deeply watches object properties but does NOT track Set method calls (`.add()`, `.delete()`). To trigger reactivity, the entire Set must be replaced via ref assignment. This pattern applies to all Set mutations in this store.

### resetProgress()

```typescript
const resetProgress = (): void => {
  visitedStationIds.value = new Set()
  claimedDistrictBonuses.value = new Set()
}
```

**Purpose:** Clear all progress (visited stations and claimed bonuses).

**Use case:** Player reset or account wipe.

**Side effects:**
- Clears `visitedStationIds`
- Clears `claimedDistrictBonuses`
- Does NOT refund previously awarded bonus points (wallet state is independent)

---

## Cross-Store Dependencies

### useWalletStore

**When:** `visitStation()` action, only on first district unlock.

**Call:** `useWalletStore().credit(district.bonusPoints)`

**Pattern:** Sibling-import (ADR-0006). The action imports and calls the wallet store to atomically credit points when a district is unlocked for the first time.

**No circular dependency:** cityRpg store does not read wallet state, only writes (credit).

### No dependency on other modules

- `offPeak` (Module 1) — independent
- `blindBox` (Module 2) — independent
- `loyaltyTier` (Module 3) — independent

---

## Mock Data Imports

The store imports two items from the mock API:

```typescript
import { DISTRICTS, StationDef } from '../api/mockData'
```

### DISTRICTS

**Type:** `DistrictDef[]`

**Structure (inferred):**
```typescript
interface DistrictDef {
  id: string
  name: string
  icon: string
  stations: StationDef[]
  threshold: number
  bonusPoints: number
}
```

**Responsibility:** Defines all districts and their stations. Never mutated by the store.

### StationDef

**Type:** Type definition for a single station.

**Structure (inferred):**
```typescript
interface StationDef {
  id: string
  name: string
  [other properties...]
}
```

**Usage:** Dereferenced in `DistrictProgress` interface and computed getters.

---

## Reactivity Patterns & Best Practices

### Set Immutability

All Set mutations follow the immutable pattern:

```typescript
// ❌ Do NOT do this (Vue won't detect it)
visitedStationIds.value.add(stationId)

// ✅ Do this instead (triggers reactivity)
visitedStationIds.value = new Set([
  ...visitedStationIds.value,
  stationId,
])
```

### Computed Idempotency

Getters (`districtProgress`, `overallProgress`) are pure functions with no side effects. They can be called multiple times safely.

### Persistence Lifecycle

- **Load:** On app boot, deserializer reconstructs Sets from localStorage array
- **Save:** On any Set mutation (via ref replacement), serializer runs and saves to localStorage
- **Fallback:** Nullish coalescing (`?? []`) in deserializer handles missing keys gracefully

---

## Type Definitions Summary

```typescript
interface DistrictProgress {
  id: string
  name: string
  icon: string
  stations: StationDef[]
  threshold: number
  bonusPoints: number
  visitedCount: number
  totalStations: number
  unlocked: boolean
  bonusClaimed: boolean
}

interface OverallProgress {
  visited: number
  total: number
  percent: number
}

type VisitStationResult = {
  newlyUnlocked: boolean
  districtId: string | null
}
```

---

## Examples

### Example 1: Player visits first station in a district

```typescript
const result = cityRpgStore.visitStation('station-a1')
// If threshold is 3 and 'a1' is first visit to district A:
// → result = { newlyUnlocked: false, districtId: 'district-a' }
// (one station visited, not yet unlocked)
```

### Example 2: Player visits third station, unlocking district

```typescript
const result = cityRpgStore.visitStation('station-a3')
// Assuming stations a1 and a2 already visited, threshold = 3:
// → result = { newlyUnlocked: true, districtId: 'district-a' }
// → Bonus points credited to wallet automatically
// → claimedDistrictBonuses now includes 'district-a'
```

### Example 3: Player attempts to revisit a station

```typescript
const result = cityRpgStore.visitStation('station-a1')
// Already in visitedStationIds:
// → result = { newlyUnlocked: false, districtId: null }
// (no state change, no wallet credit)
```

### Example 4: Check overall progress

```typescript
const progress = cityRpgStore.overallProgress
// { visited: 12, total: 45, percent: 27 }
```

### Example 5: Inspect district-by-district state

```typescript
const districts = cityRpgStore.districtProgress
// Array of DistrictProgress objects:
// [
//   {
//     id: 'district-a',
//     name: '台北中心',
//     icon: '🏙️',
//     stations: [...],
//     threshold: 3,
//     bonusPoints: 50,
//     visitedCount: 3,
//     totalStations: 5,
//     unlocked: true,
//     bonusClaimed: true,
//   },
//   ...
// ]
```

---

## References

- **ADR-0006:** Sibling-import pattern for cross-store dependencies
- **Module 1 (offPeak):** `frontend/src/stores/offPeak.ts`
- **Wallet Store:** `frontend/src/stores/wallet.ts`
- **Mock API:** `frontend/src/api/mockData.ts`
