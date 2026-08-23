# ADR-0007: Derived district state from visited-station set

**Status:** Accepted

**Decision Date:** 2026-08-24

## Context

Module 4 (城市RPG解鎖) tracks which MRT stations a player has visited and which districts are "unlocked" (enough stations visited to cross a threshold). The naive approach stores per-district progress as independent mutable state — visited counts, unlocked booleans, bonus-claimed flags for each of 6 districts. This creates 18+ fields that must be kept in sync whenever a station visit occurs, and introduces multiple code paths that can produce inconsistent state.

The app is a hackathon prototype using Pinia with localStorage persistence. The district definitions (which stations belong to which district, thresholds, bonus amounts) are static and known at build time. The only truly dynamic data is "which stations has the player tapped into" and "which district bonuses have already been claimed."

## Decision

Store only two Sets in the Pinia store:

1. `visitedStationIds: Set<string>` — the canonical set of stations the player has visited.
2. `claimedDistrictBonuses: Set<string>` — the set of district IDs whose first-unlock bonus has been credited to the wallet.

All other district state is computed from these two Sets plus the static `DISTRICTS` constant defined in `src/api/mockData.ts`:
- `districtProgress` (computed) — for each district, derives visitedCount, unlocked, bonusClaimed
- `overallProgress` (computed) — total visited / total stations

On first unlock, the `visitStation` action atomically: (a) adds stationId to visitedStationIds, (b) calls `useWalletStore().credit(district.bonusPoints)`, (c) adds district.id to claimedDistrictBonuses. No watcher, no pending flag.

Persistence uses a custom serializer converting Set<string> to/from JSON arrays.

## Alternatives Considered

### 1. Store per-district mutable objects
- **Why rejected:** 18+ mutable fields. Synchronization logic required after every station visit. Bug surface area is proportional to field count. Static district definitions already contain everything needed — duplicating as mutable state is redundant.

### 2. Store visitedStationIds only; derive claimedDistrictBonuses from wallet transaction log
- **Why rejected:** The wallet store (ADR-0006) intentionally holds only a balance number — no transaction history. Adding a transaction log to wallet just to support Module 4's bonus-claimed tracking violates the "intentional thinness" principle from ADR-0006.

### 3. Use a watcher on visitedStationIds to trigger unlock side-effects
- **Why rejected:** Watchers fire asynchronously after the reactive update, creating a frame where the UI shows "unlocked" but the bonus has not yet been credited. Doing the bonus credit inside the action itself is synchronous and atomic.

## Consequences

- **Minimal persistence footprint:** Only two JSON arrays in localStorage.
- **Single source of truth:** No stale unlocked flags. If DISTRICTS constant changes, existing visitedStationIds re-evaluate on next load. No migration needed.
- **Custom serializer requirement:** ~10 lines of code, documented in implement-detail.
- **Coupling to DISTRICTS constant:** The store imports DISTRICTS from mockData.ts. Acceptable at hackathon scale; revisit if a real backend is added.
- **Wallet cross-store dependency:** Follows the same sibling-import pattern from ADR-0006.

## Implementation Notes

Store file: `frontend/src/stores/cityRpg.ts`
Mock data: `frontend/src/api/mockData.ts` (DISTRICTS constant)
Referenced ADRs: ADR-0002 (Pinia conventions), ADR-0006 (shared wallet store)

## References

- `docs/product-requirement-document/metro-city-rpg-unlock/implement-detail.md` sections 2 and 3
- ADR-0002: Pinia for state management (foundational Pinia conventions)
- ADR-0006: Extract shared wallet store for multi-module point balance
