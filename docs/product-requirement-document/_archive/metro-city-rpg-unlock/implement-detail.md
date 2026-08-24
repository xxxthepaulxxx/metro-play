---
status: locked
locked_at: 2026-08-24
---

# Implement Detail: metro-city-rpg-unlock (Module 4 — City RPG Unlock)

**Document Version:** 1.0
**Status:** Architecture Locked
**Last Updated:** 2026-08-24

---

## 1. Overview

Module 4: 城市RPG解鎖 (City RPG Unlock) implements a station-collection RPG mechanic where players "visit" MRT stations (via simulated tap), collect districts when visiting enough stations in that district, and earn bonus points for first unlock of each district. The implementation follows locked architectural decisions (See Section 4).

**Stack:** Vue 3 + Vite + Pinia + Vue Router (TypeScript)
**API Strategy:** Mock async API with simulated delays per `mockApi.ts` pattern
**Persistence:** LocalStorage (per ADR-0004)

---

## 2. Architecture Summary

| Component | Choice | Rationale |
|-----------|--------|-----------|
| State Management | Pinia (setup-function style) | Matches wallet.ts and loyaltyTier.ts pattern; `visitedStationIds` and `claimedDistrictBonuses` as persistent Sets |
| District Unlock Animation | One-shot scale-bounce + glow (fired in visitStation promise resolution) | Synchronous unlock trigger; no pending flags or watchers (ADR-0007) |
| Mock API | Append-only async functions with `delay()` | Consistent with Module 1-3 pattern; no real network calls |
| Router | Flat lazy-loaded routes: `/rpg` and `/rpg/district/:id` | Matches Vue Router 4 convention; replace `/module4` placeholder |
| Design Accent | Amber (#FF8F00) for RPG mechanic | Unique per-module palette; used for district unlock, bonus points |

---

## 3. Locked Architectural Decisions

**ADR-0007** (new) covers the "derived district state from visited-station set" pattern:
- All district-level computed state (progress, unlocked status) derives from `visitedStationIds: Set<string>`.
- No per-district mutable state in store.
- Unlock detection is deterministic: `stationCount >= threshold` triggers unlock.
- On first unlock of a district, `visitStation` action immediately:
  1. Adds district id to `claimedDistrictBonuses` set.
  2. Calls `useWalletStore().credit(district.bonusPoints)`.
  3. Returns `{ newlyUnlocked: true; districtId: "..." }` to caller.
  4. Caller component fires UnlockBurstAnimation (no watcher, no pending flag).

---

## 4. File Inventory & Specifications

### 4.1 Mock Data: `frontend/src/api/mockData.ts` — APPEND

**New interfaces:**

```typescript
export interface StationDef {
  id: string;
  name: string; // MRT station name (Chinese)
}

export interface DistrictDef {
  id: string;
  name: string; // District name (Chinese)
  icon: string; // Unicode emoji or text representation
  stations: StationDef[];
  threshold: number; // number of stations required to unlock
  bonusPoints: number; // reward for first unlock
}
```

**New constant:**

```typescript
export const DISTRICTS: DistrictDef[] = [
  {
    id: "xinyi",
    name: "信義區",
    icon: "🏙️",
    stations: [
      { id: "st-101", name: "台北101/世貿" },
      { id: "st-102", name: "信義安和" },
      { id: "st-103", name: "象山" },
      { id: "st-104", name: "市政府" },
    ],
    threshold: 3,
    bonusPoints: 80,
  },
  {
    id: "zhongshan",
    name: "中山區",
    icon: "🛍️",
    stations: [
      { id: "st-201", name: "中山" },
      { id: "st-202", name: "南京復興" },
      { id: "st-203", name: "松江南京" },
      { id: "st-204", name: "民權西路" },
      { id: "st-205", name: "雙連" },
    ],
    threshold: 3,
    bonusPoints: 100,
  },
  {
    id: "banqiao",
    name: "板橋區",
    icon: "🚇",
    stations: [
      { id: "st-301", name: "板橋" },
      { id: "st-302", name: "新埤" },
      { id: "st-303", name: "幸福" },
      { id: "st-304", name: "頭前庄" },
    ],
    threshold: 3,
    bonusPoints: 80,
  },
  {
    id: "beitou",
    name: "北投區",
    icon: "♨",
    stations: [
      { id: "st-401", name: "北投" },
      { id: "st-402", name: "新北投" },
      { id: "st-403", name: "奇岩" },
    ],
    threshold: 2,
    bonusPoints: 120,
  },
  {
    id: "nangang",
    name: "南港區",
    icon: "🏢",
    stations: [
      { id: "st-501", name: "南港" },
      { id: "st-502", name: "南港展覽館" },
      { id: "st-503", name: "後山埤" },
    ],
    threshold: 2,
    bonusPoints: 90,
  },
  {
    id: "daan",
    name: "大安區",
    icon: "🌆",
    stations: [
      { id: "st-601", name: "大安" },
      { id: "st-602", name: "科技大樓" },
      { id: "st-603", name: "忠孝復興" },
      { id: "st-604", name: "忠孝敦化" },
    ],
    threshold: 3,
    bonusPoints: 100,
  },
];
```

---

### 4.2 Mock API: `frontend/src/api/mockApi.ts` — APPEND

**New interfaces:**

```typescript
export interface VisitStationResponse {
  stationId: string;
  newlyUnlockedDistricts: string[]; // array of district ids unlocked in this visit
}
```

**New async functions:**

```typescript
export async function getDistricts(): Promise<DistrictDef[]> {
  await delay(200);
  return DISTRICTS;
}

export async function visitStation(stationId: string): Promise<VisitStationResponse> {
  await delay(400);
  // Return empty array; the store will determine which districts unlock
  return {
    stationId,
    newlyUnlockedDistricts: [],
  };
}
```

**Note:** The mock functions are thin wrappers. Unlock logic is entirely in the store action (see Section 4.3).

---

### 4.3 Pinia Store: `frontend/src/stores/cityRpg.ts` — NEW

**Store ID:** `"city-rpg-store"`
**Setup-function style** (matching wallet.ts and loyaltyTier.ts):

```typescript
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getDistricts, visitStation as mockVisitStation } from "../api/mockApi";
import { DISTRICTS, type DistrictDef } from "../api/mockData";
import { useWalletStore } from "./wallet";

export interface DistrictProgress {
  district: DistrictDef;
  visitedCount: number;
  unlocked: boolean;
  progress: number; // 0-100 percentage
}

export const useCityRpgStore = defineStore(
  "city-rpg-store",
  () => {
    // State: persisted via pinia-plugin-persistedstate (custom serialization for Sets)
    const visitedStationIds = ref<Set<string>>(new Set());
    const claimedDistrictBonuses = ref<Set<string>>(new Set());

    // Computed: district-level progress (derived from visited-station set)
    const districtProgress = computed((): DistrictProgress[] => {
      return DISTRICTS.map((district) => {
        const visitedCount = district.stations.filter((s) =>
          visitedStationIds.value.has(s.id)
        ).length;
        const unlocked = visitedCount >= district.threshold;
        const progress = Math.round((visitedCount / district.threshold) * 100);

        return {
          district,
          visitedCount,
          unlocked,
          progress,
        };
      });
    });

    // Computed: overall progress
    const overallProgress = computed((): number => {
      const totalStations = DISTRICTS.reduce((sum, d) => sum + d.stations.length, 0);
      const visited = visitedStationIds.value.size;
      return Math.round((visited / totalStations) * 100);
    });

    // Actions

    async function visitStation(stationId: string): Promise<{
      newlyUnlocked: boolean;
      districtId: string | null;
    }> {
      // Call mock API (thin wrapper, always succeeds)
      await mockVisitStation(stationId);

      // Mark station as visited
      const wasVisited = visitedStationIds.value.has(stationId);
      if (!wasVisited) {
        visitedStationIds.value.add(stationId);
      }

      // Detect if this visit caused a new district unlock
      let newlyUnlocked = false;
      let districtId: string | null = null;

      for (const district of DISTRICTS) {
        // Skip if already claimed bonus
        if (claimedDistrictBonuses.value.has(district.id)) {
          continue;
        }

        // Check if district is now unlocked
        const visitedCount = district.stations.filter((s) =>
          visitedStationIds.value.has(s.id)
        ).length;

        if (visitedCount >= district.threshold) {
          // First-time unlock: claim bonus
          newlyUnlocked = true;
          districtId = district.id;
          claimedDistrictBonuses.value.add(district.id);
          useWalletStore().credit(district.bonusPoints);
          break; // Only one unlock per visit
        }
      }

      return { newlyUnlocked, districtId };
    }

    function resetProgress(): void {
      visitedStationIds.value.clear();
      claimedDistrictBonuses.value.clear();
    }

    return {
      visitedStationIds,
      claimedDistrictBonuses,
      districtProgress,
      overallProgress,
      visitStation,
      resetProgress,
    };
  },
  {
    persist: {
      key: "city-rpg-store",
      serializer: {
        serialize: (state: any) => {
          return JSON.stringify({
            visitedStationIds: Array.from(state.visitedStationIds),
            claimedDistrictBonuses: Array.from(state.claimedDistrictBonuses),
          });
        },
        deserialize: (data: string) => {
          const parsed = JSON.parse(data);
          return {
            visitedStationIds: new Set(parsed.visitedStationIds),
            claimedDistrictBonuses: new Set(parsed.claimedDistrictBonuses),
          };
        },
      },
    },
  }
);
```

**Custom Serializer Rationale:**
Pinia persists state as JSON; JavaScript Sets are not JSON-serializable. The custom serializer converts Sets to arrays on persist and back to Sets on hydrate.

---

### 4.4 Components: City RPG Views

#### 4.4.1 `frontend/src/views/cityRpg/CityRpgMapView.vue` — NEW

**Route:** `/rpg`

**Purpose:** Main hub showing overall progress and district cards.

**Features:**
- Progress hero card (overall progress percentage, animated bar).
- District card grid (6 cards, one per district from DISTRICTS).
- For each card:
  - District name, icon, progress bar (visited/threshold).
  - Locked state: muted color, progress hidden.
  - Unlocked state: highlight with amber accent, bonus points displayed.
  - On click: navigate to `/rpg/district/:id`.

**Pseudocode:**
```javascript
onMounted() {
  // Load districts (for UI consistency; data is static)
}

// Computed: districtProgress from store
const districts = computed(() => useCityRpgStore().districtProgress);
const overall = computed(() => useCityRpgStore().overallProgress);

function gotoDistrict(districtId) {
  router.push(`/rpg/district/${districtId}`);
}
```

**Design:**
- Hero card: amber (#FF8F00) accent for progress bar.
- Glass-morphism: `rgba(255,255,255,0.15)` + `blur(12px)`.
- Entrance animation: `fadeSlideUp` (staggered for title, then cards).
- Locked district: dim gray text, reduced opacity.
- Unlocked district: amber glow on border, prominent bonus-points badge.

---

#### 4.4.2 `frontend/src/views/cityRpg/DistrictCard.vue` — NEW

**Purpose:** Reusable card component for a single district (locked or unlocked).

**Props:**
```typescript
interface Props {
  district: DistrictProgress;
}
```

**Features:**
- Icon + name.
- Progress bar: `visitedCount / threshold`.
- If locked: "未解鎖" (not unlocked), muted styling.
- If unlocked: "已解鎖" (unlocked), amber glow, show bonus points icon + amount.

**Design tokens:**
- Locked: `--color-text-muted` + `--color-glass-card`.
- Unlocked: amber (#FF8F00) border + glow, `--color-rpg-accent`.

---

#### 4.4.3 `frontend/src/views/cityRpg/DistrictDetailView.vue` — NEW

**Route:** `/rpg/district/:id`

**Purpose:** Detailed view for a single district; simulated "進站" (entry) tap.

**Features:**
- DistrictDetailCard hero (district name, icon, station checklist, progress).
- "模擬進站" (Simulated Entry) button.
- Conditional UnlockBurstAnimation (fires on newly-unlocked).

**Pseudocode:**
```javascript
const route = useRoute();
const districtId = route.params.id as string;
const store = useCityRpgStore();

// Find district from store.districtProgress
const districtData = computed(() => {
  return store.districtProgress.find((d) => d.district.id === districtId);
});

const showBurst = ref(false);
const burstDistrictId = ref<string | null>(null);

async function simulateEntry() {
  // Pick a random unvisited station from this district (or any unvisited)
  const unvisited = findUnvisitedStations();
  if (unvisited.length === 0) {
    // All visited; pick random visited station
    unvisited.push(...findVisitedStations());
  }
  const chosen = unvisited[Math.floor(Math.random() * unvisited.length)];

  const result = await store.visitStation(chosen.id);
  if (result.newlyUnlocked) {
    showBurst.value = true;
    burstDistrictId.value = result.districtId;
  }
}

function onBurstDone() {
  showBurst.value = false;
  burstDistrictId.value = null;
}
```

**Design:**
- Hero card style matching other views.
- Button disabled if all stations visited (optional guard).
- Entrance animation: `fadeSlideUp` on mount.

---

#### 4.4.4 `frontend/src/views/cityRpg/DistrictDetailCard.vue` — NEW

**Purpose:** ComboCard-style hero card for district detail view.

**Props:**
```typescript
interface Props {
  district: DistrictProgress;
}
```

**Features:**
- District name (large), icon.
- Station checklist: bullet list with checkmarks for visited stations.
- Progress bar: `visitedCount / threshold`, labeled "進度".
- Unlock requirement text: e.g., "再訪問 1 個車站即可解鎖".

**Design:**
- ComboCard base: `rgba(0, 20, 40, 0.55)` + darker inner glass.
- Accent: amber (#FF8F00) for progress bar and unlock-ready state.
- Checked station: green (#00A86B) checkmark.
- Unchecked station: muted, no checkmark.

---

#### 4.4.5 `frontend/src/views/cityRpg/UnlockBurstAnimation.vue` — NEW

**Purpose:** One-shot scale-bounce + amber glow animation, fires on district unlock.

**Props:**
```typescript
interface Props {
  districtId: string; // for context/messaging
}
```

**Emits:** `done` event when animation completes.

**Features:**
- Full-screen overlay (semi-transparent dark background).
- Centered animation sequence:
  1. Scale-bounce: start 0.8x, scale to 1.2x over 200ms (ease-out), bounce back to 1.0x over 200ms (ease-out). Total 400ms.
  2. Glow pulse: amber (#FF8F00) shadow around the burst, fade in over 200ms, hold for 200ms, fade out over 200ms. Total 600ms (overlaps with bounce).
- Text: "區域解鎖" or "District Unlocked" overlay.
- After animation ends: emit `done`.

**Pseudocode:**
```javascript
onMounted() {
  // Trigger CSS animations
  nextTick(() => {
    bounceElRef.value?.classList.add('bounce-animation');
    glowElRef.value?.classList.add('glow-animation');

    // After 600ms, emit done
    setTimeout(() => {
      emit('done');
    }, 600);
  });
}
```

**CSS Animations:**
```css
@keyframes unlock-bounce {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1.0); }
}

@keyframes unlock-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 143, 0, 0); }
  50% { box-shadow: 0 0 30px 10px rgba(255, 143, 0, 0.6); }
}

.bounce-animation {
  animation: unlock-bounce 400ms ease-out forwards;
}

.glow-animation {
  animation: unlock-glow 600ms ease-out forwards;
}
```

---

### 4.5 Router Changes: `frontend/src/router/index.ts` — MODIFY

**Remove:**
```typescript
{
  path: "/module4",
  component: () => import("../views/Module4Placeholder.vue"),
},
```

**Add:**
```typescript
{
  path: "/rpg",
  component: () => import("../views/cityRpg/CityRpgMapView.vue"),
},
{
  path: "/rpg/district/:id",
  component: () => import("../views/cityRpg/DistrictDetailView.vue"),
},
```

---

### 4.6 App Shell Changes: `frontend/src/App.vue` — MODIFY

**Current (line ~52):**
```typescript
{ label: "🗺️ 城市RPG", to: "/module4", activePaths: ["/module4"] },
```

**Change to:**
```typescript
{ label: "🗺️ 城市RPG", to: "/rpg", activePaths: ["/rpg"] },
```

---

### 4.7 Design Tokens: `frontend/src/styles/tokens.css` — APPEND

**Add after Module 3 tokens (around line 61):**

```css
  /* Module 4 — City RPG accent */
  --color-rpg-accent: #ff8f00;
  --color-rpg-accent-dim: rgba(255, 143, 0, 0.12);
  --color-rpg-accent-border: rgba(255, 143, 0, 0.35);
  --color-rpg-accent-glow: rgba(255, 143, 0, 0.5);
  --duration-rpg-unlock-bounce: 400ms;
  --duration-rpg-glow: 600ms;
```

---

## 5. Component Tree

```
App.vue (TabBar, route /rpg active)
└─ <router-view>
   ├─ CityRpgMapView.vue                (/rpg)
   │  ├─ DistrictCard.vue               (x6, one per district)
   │  └─ ProgressHeroCard (inline)
   └─ DistrictDetailView.vue            (/rpg/district/:id)
      ├─ DistrictDetailCard.vue
      └─ UnlockBurstAnimation.vue        (conditional, one-shot on unlock)
```

---

## 6. State Management Flow

1. **App Init:** Pinia hydrates `cityRpgStore` from localStorage (Sets reconstructed via custom serializer).
2. **Visit Station:**
   - User taps "模擬進站" button on DistrictDetailView.
   - Action: `useCityRpgStore().visitStation(stationId)`.
   - Store logic:
     - Adds stationId to `visitedStationIds`.
     - Computes new district unlock state.
     - If a district newly unlocked:
       - Adds districtId to `claimedDistrictBonuses`.
       - Calls `useWalletStore().credit(bonusPoints)`.
       - Returns `{ newlyUnlocked: true, districtId }`.
   - DistrictDetailView receives response, sets `showBurst = true`.
   - UnlockBurstAnimation mounts, fires animation, emits `done`.
   - DistrictDetailView clears `showBurst`, component unmounts.
   - Store state persisted automatically via pinia-plugin-persistedstate.

---

## 7. Mock Data & API

**Mock Data** (`mockData.ts`):
- Static `DISTRICTS` constant (6 entries, ~20 total stations).
- StationDef: id, name.
- DistrictDef: id, name, icon, stations[], threshold, bonusPoints.

**Mock API** (`mockApi.ts`):
- `getDistricts()` — async, 200ms delay, returns DISTRICTS.
- `visitStation(stationId)` — async, 400ms delay, returns VisitStationResponse (always succeeds).

**Unlock Logic:** Entirely in store action (NOT in mock API). Mock API is thin wrapper.

---

## 8. Design Language

### Colors
- **Amber (#FF8F00):** Primary RPG accent for unlock, progress, bonus points.
  - Tokens: `--color-rpg-accent`, `--color-rpg-accent-dim`, `--color-rpg-accent-border`, `--color-rpg-accent-glow`.
- **Background Gradient:** Inherited from app (blue → green), never overridden.
- **Text:** White primary, muted for locked state.

### Cards & Glass
- **Glassmorphism:** `rgba(255,255,255,0.15)` + `blur(12px)` for regular cards.
- **ComboCard (DistrictDetailCard):** `rgba(0, 20, 40, 0.55)` + darker inner glass (matching Module 3 TierShieldCard).
- **Borders:** `rgba(255,255,255,0.3)` or amber-tinted for unlocked state.

### Motion
- **Entrance:** Staggered `fadeSlideUp` on view mount.
- **Unlock Burst:** One-shot scale-bounce (400ms) + glow (600ms), no looping.
- **Progress Bar:** Smooth CSS transition (no JavaScript animation).

### Typography
- **System fonts only** (no custom typefaces).
- **Bold/extra-bold** for district names and hero text.
- **Regular weight** for progress labels and station lists.

---

## 9. File Inventory (Summary)

| File | Action | Purpose |
|------|--------|---------|
| `frontend/src/api/mockData.ts` | APPEND | StationDef, DistrictDef, DISTRICTS constant (6 entries) |
| `frontend/src/api/mockApi.ts` | APPEND | getDistricts(), visitStation() — async, mocked delays |
| `frontend/src/stores/cityRpg.ts` | NEW | Pinia store: visitedStationIds, claimedDistrictBonuses, computed district progress, visitStation action |
| `frontend/src/views/cityRpg/CityRpgMapView.vue` | NEW | /rpg route: overall progress hero + district card grid |
| `frontend/src/views/cityRpg/DistrictCard.vue` | NEW | Reusable district card (locked/unlocked state, progress bar) |
| `frontend/src/views/cityRpg/DistrictDetailView.vue` | NEW | /rpg/district/:id route: detail card + simulate-entry button + burst animation conditional |
| `frontend/src/views/cityRpg/DistrictDetailCard.vue` | NEW | ComboCard hero: district name, icon, station checklist, progress, requirement text |
| `frontend/src/views/cityRpg/UnlockBurstAnimation.vue` | NEW | One-shot scale-bounce (400ms) + amber glow (600ms), emits done |
| `frontend/src/router/index.ts` | MODIFY | Remove /module4, add /rpg and /rpg/district/:id |
| `frontend/src/App.vue` | MODIFY | Tab 4: to="/rpg", activePaths=["/rpg"] |
| `frontend/src/styles/tokens.css` | APPEND | 6 Module 4 RPG tokens (--color-rpg-accent, --color-rpg-accent-dim, --color-rpg-accent-border, --color-rpg-accent-glow, durations) |

---

## 10. ADR References & Locked Decisions

- **ADR-0002:** Pinia state management (cityRpgStore setup-function style, matches wallet.ts and loyaltyTier.ts).
- **ADR-0003:** Mock async API design (getDistricts, visitStation with simulated delays).
- **ADR-0004:** LocalStorage persistence (custom Set serializer for visitedStationIds and claimedDistrictBonuses).
- **ADR-0007 (new):** Derived district state pattern — all district-level computed state derives from visited-station Set; no per-district mutable state; unlock animation fires synchronously in visitStation promise resolution.

---

## 11. Integration with Shared Wallet

When a district unlocks for the first time:
```typescript
const result = await store.visitStation(stationId);
if (result.newlyUnlocked) {
  // District unlock already credited to wallet inside store action
  useWalletStore().credit(district.bonusPoints);
}
```

The wallet store (`wallet.ts`) is the single source of truth for user balance across all modules.

---

## 12. Testing Considerations

- **Unit:** Store actions should be tested for:
  - Correct Set mutation on visitStation.
  - Correct unlock detection (threshold comparison).
  - Correct bonus crediting to wallet.
  - Correct persistence (serialization/deserialization).

- **Integration:** Full flow (CityRpgMapView → DistrictDetailView → visitStation → UnlockBurstAnimation) should be walkable in hackathon demo (<3 min).

- **Regression:** Ensure existing Modules 1-3 are unaffected (shared wallet integration only).

---

## 13. Rollout Sequence

1. **Add mock data** — append StationDef, DistrictDef, DISTRICTS to `mockData.ts`.
2. **Add mock API** — append getDistricts, visitStation to `mockApi.ts`.
3. **Implement store** — create `cityRpg.ts` with all actions, computeds, persistence.
4. **Implement views** — create CityRpgMapView, DistrictCard, DistrictDetailView, DistrictDetailCard, UnlockBurstAnimation.
5. **Update router** — modify `router/index.ts` (remove /module4, add /rpg routes).
6. **Update App shell** — modify `App.vue` tab 4 (to="/rpg", activePaths=["/rpg"]).
7. **Add tokens** — append 6 Module 4 tokens to `tokens.css`.
8. **Test full flow** — walk through hackathon demo (visit stations, unlock districts, see burst animation, check wallet credit).

---

## 14. Deferred Items

| Item | Trigger for Undefer |
|------|-------------------|
| QR code station identification | Native app development begins |
| Real MRT API integration | MRT open-data API access granted |
| District unlock milestone badges | Post-hackathon iteration |
| Multi-player leaderboard | Community demand & backend support |

---

## 15. Related Documentation

**Requirement:** [requirement.md](./requirement.md) (TBD — PO specification)
**Critical Path:** [critical-path.md](./critical-path.md) (TBD — PO specification)

**Architecture Decisions:**
- [ADR-0001](../../architecture-decision-record/ADR-0001.md) — Vue 3 + Vite over React
- [ADR-0002](../../architecture-decision-record/ADR-0002.md) — Pinia over Vuex
- [ADR-0003](../../architecture-decision-record/ADR-0003.md) — Mock async API
- [ADR-0004](../../architecture-decision-record/ADR-0004.md) — LocalStorage persistence
- [ADR-0007](../../architecture-decision-record/ADR-0007.md) — Derived district state from visited-station Set (new)

**API & Data:**
- [api-contract.md](../../architecture/api-contract.md) — endpoint signatures
- [data-model.md](../../architecture/data-model.md) — state schema

**Design:**
- [design-system/overview.md](../../design-system/overview.md) — glassmorphism, tokens, motion

**Operations:**
- [runbooks/dev/run-vue-dev.md](../../runbooks/dev/run-vue-dev.md) — local dev setup
- [runbooks/ops/demo-script.md](../../runbooks/ops/demo-script.md) — hackathon walkthrough

---

## Summary

This implementation detail specifies all state management, component structure, mock API, and design tokens for Module 4 (City RPG Unlock). The architecture is fully locked: district unlock state derives from a visited-station Set, unlock animations fire synchronously in store action promise resolution, and bonus points are credited immediately to the shared wallet. All files follow established Vue 3 + Pinia + Vue Router patterns from Modules 1-3.
