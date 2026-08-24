# API Contract — Metro City RPG Unlock (Module 4)

## Overview

The mock API layer for Module 4 (City RPG Unlock) provides a thin, client-side simulation of backend services. The API surfaces district definitions and handles station visit transactions. This contract documents the interface between the Vue 3 frontend (Pinia store + components) and the mock layer (`src/api/mockApi.ts`).

**Design principle:** The mock API returns only the minimum data needed for views to render and for the store to update its internal state. Unlock logic and reward computation remain entirely client-side, avoiding duplication and keeping the mock layer lean. This ensures a smooth transition to a real backend—when server-side unlock rules become authoritative, the same view/store architecture will work unchanged.

---

## Type Definitions

To be appended to `src/api/mockData.ts`:

```typescript
/**
 * Represents a single MRT station within a district.
 */
export interface StationDef {
  /** Unique identifier (e.g., "xinyi-city-hall", "taipei-101-86") */
  id: string;
  /** Display name in Chinese (e.g., "市政府", "台北101/世貿") */
  name: string;
}

/**
 * Represents a city district with a collection of stations and unlock rules.
 */
export interface DistrictDef {
  /** Unique identifier (e.g., "xinyi", "taipei-central") */
  id: string;
  /** Display name in Chinese (e.g., "信義區") */
  name: string;
  /** Icon class or emoji (e.g., "skyscraper", "🏢") */
  icon: string;
  /** Array of stations within this district */
  stations: StationDef[];
  /** Number of unique stations required to unlock this district */
  threshold: number;
  /** Bonus reward points awarded upon unlock */
  bonusPoints: number;
}

/**
 * Response from visitStation API call.
 * Indicates the outcome of a single station visit.
 */
export interface VisitStationResponse {
  /** The ID of the station visited */
  stationId: string;
  /** The ID of the district containing the station */
  districtId: string;
  /** true if this station was already in the visited Set before this call */
  alreadyVisited: boolean;
  /** ISO 8601 timestamp of the visit (server time, for demo purposes) */
  timestamp: string;
}
```

---

## API Functions

### getDistricts

**Signature:**
```typescript
export async function getDistricts(): Promise<DistrictDef[]>
```

**Behavior:**
- Simulates network latency with a 200ms delay.
- Returns a deep copy of the `DISTRICTS` array (prevents accidental mutations from the caller).
- Always succeeds (happy path for hackathon demo).

**Usage:**
- Called by `CityRpgMapView` on component mount.
- Results are stored in the Pinia store (`cityRpg.districts`).
- View filters and renders districts based on unlock state computed in the store.

**Example call:**
```typescript
const districts = await getDistricts();
// Result:
// [
//   {
//     id: "xinyi",
//     name: "信義區",
//     icon: "skyscraper",
//     stations: [
//       { id: "xinyi-city-hall", name: "市政府" },
//       { id: "xinyi-taipei-101", name: "台北101/世貿" },
//       ...
//     ],
//     threshold: 3,
//     bonusPoints: 500
//   },
//   ...
// ]
```

---

### visitStation

**Signature:**
```typescript
export interface VisitStationResponse {
  stationId: string;
  districtId: string;
  alreadyVisited: boolean;
  timestamp: string; // ISO 8601
}

export async function visitStation(stationId: string): Promise<VisitStationResponse>
```

**Behavior:**
- Simulates network latency with a 400ms delay.
- Records the station ID in an internal visited Set (persists for the session).
- Returns a response indicating whether the station was newly visited or already recorded.
- Always succeeds (happy path for demo).

**Important design note — Unlock logic stays client-side:**
The response intentionally **does not include** `newlyUnlocked` or `bonusAwarded` fields. The store determines unlock status from its own computed state:
1. Store calls `visitStation(stationId)`.
2. Mock API records the visit and returns basic metadata.
3. Store updates its visited Set.
4. Store's computed `districtProgress` and `unlockedDistricts` re-evaluate based on the updated Set.
5. View reacts to the computed state changes.

This keeps the mock API thin and avoids duplicating business logic. When a real backend exists, the server will compute and return unlock/reward outcomes; the view and store code will remain unchanged.

**Example call:**
```typescript
const result = await visitStation("xinyi-city-hall");
// Result:
// {
//   stationId: "xinyi-city-hall",
//   districtId: "xinyi",
//   alreadyVisited: false,
//   timestamp: "2026-08-24T12:34:56.789Z"
// }
```

---

## Data Flow

### Station Visit Workflow

```
CityRpgMapView
  ↓ (user clicks station)
  ↓ calls store action: visitStation(stationId)
      ↓ store action calls: mockApi.visitStation(stationId)
          ↓ (400ms delay)
          ↓ mockApi returns VisitStationResponse
      ↓ store updates its visited Set: visitedStations.add(stationId)
      ↓ store's computed districtProgress re-evaluates
      ↓ store's computed unlockedDistricts re-evaluates
      ↓ if threshold met, store computed emit unlock event
  ↓ view reacts to store state changes
  ↓ renders updated unlock status, new points, etc.
```

### District Loading Workflow

```
CityRpgMapView (onMounted)
  ↓ calls store action: loadDistricts()
      ↓ store action calls: mockApi.getDistricts()
          ↓ (200ms delay)
          ↓ mockApi returns DistrictDef[]
      ↓ store stores in districts array
  ↓ view renders district list
```

---

## Future Backend Migration

When a real backend is introduced:

1. **visitStation response expansion:** The server will compute unlock outcomes and return them:
   ```typescript
   export interface VisitStationResponse {
     stationId: string;
     districtId: string;
     alreadyVisited: boolean;
     timestamp: string;
     newlyUnlocked?: boolean;        // ← server tells us if district unlocked
     bonusAwarded?: number;          // ← server tells us reward amount
   }
   ```

2. **Store logic update:** The store's `visitStation` action will read the server response instead of computing locally:
   ```typescript
   const response = await mockApi.visitStation(stationId);
   if (response.newlyUnlocked) {
     // apply unlock effects (animation, sound, etc.)
   }
   if (response.bonusAwarded) {
     // add to points balance
   }
   ```

3. **No view changes:** The Pinia store and Vue components remain unmodified. The same `districtProgress` computed property and same event handlers work with server data.

This design ensures the mock implementation is a faithful stepping stone to the real backend—no architectural debt, no rework required.

---

## Implementation Notes

- All mock API calls are `async` to simulate real network behavior and allow the UI to show loading states.
- Visited stations persist in memory for the session; page reload clears them (matching expected demo behavior).
- Timestamps are generated on the mock server (client `new Date().toISOString()`), not sent by the caller.
- No error handling is needed for the demo (no `throw` or error responses), but a real backend would use standard HTTP status codes and error payloads.
