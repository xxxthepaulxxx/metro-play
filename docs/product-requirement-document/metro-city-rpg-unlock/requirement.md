# 城市 RPG 解鎖 (City RPG Unlock) — Metro Adventure Map

**Feature name:** `metro-city-rpg-unlock`
**Module:** Module 4
**Demo target:** Hackathon judges; full flow walkable in <3 min

## Problem Statement

Regular metro riding feels transactional. Riders who commute daily across Taipei have no sense of exploration or cumulative achievement tied to the stations they visit. There is no mechanism to turn routine travel into a progression game that rewards geographic breadth.

## Persona

Existing Metro Go Pass riders with a longer time horizon — commuters whose cumulative travel history spans multiple Taipei districts but who receive no recognition or reward for geographic coverage.

## Core Mechanic — District Unlock

The city is divided into 5-6 curated Taipei districts. Each district contains a known set of M stations. When a rider has visited N out of M stations in a district (a forgiving threshold), the district is "unlocked" on the adventure map, and the rider receives bonus points credited to their wallet.

All station-visit data is mock (no real GPS or tap-card integration).

| District (example) | Stations (M) | Threshold (N) | Bonus Points |
|---------------------|-------------|---------------|--------------|
| 信義探險區 | 6 | 4 | 50 |
| 大安文青區 | 7 | 5 | 50 |
| 中山潮流區 | 5 | 3 | 40 |
| 北投溫泉區 | 4 | 3 | 40 |
| 板橋生活圈 | 5 | 4 | 45 |
| 淡水漫遊區 | 4 | 3 | 40 |

(District names, station counts, thresholds, and bonus values are illustrative; implementation may adjust.)

## Success Criteria (Hackathon Demo)

- Open adventure map → all 5-6 districts visible with locked/unlocked visual state
- Tap a district → see station list with visited/unvisited indicators, progress bar (N/M), and bonus points preview
- At least one district is pre-seeded as already unlocked (fully lit) for demo
- At least one district is pre-seeded one visit away from unlock so judges can trigger the unlock moment
- Unlock animation fires once on threshold crossing (entrance-only, no looping)
- Points credited to wallet after unlock
- Overall progress summary visible: X of Y districts unlocked + total bonus earned
- Concept legible to judges in <3 min

## Scope

### In Scope
- 5-6 curated Taipei districts with station lists (mock data)
- Adventure map view showing all districts with locked/unlocked state
- Per-district detail view: station list, visited count, progress bar, bonus points reward
- Unlock moment: one-shot animation + points credited to wallet
- Overall progress view: X of Y districts unlocked + total bonus earned
- Mock data pre-seeds partial progress for demo walkability

### Out of Scope
- Real GPS / tap-card integration (all data is mock)
- Social leaderboard
- Seasonal or time-limited events
- Cross-module combo bonuses (no interaction with Module 1/2/3 point flows)
- Completion badge or special reward when all districts are unlocked
- Backend persistence (stays Pinia / mock API)

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No stations visited in any district | All districts show locked state, progress bars at 0 |
| All districts already unlocked | Map fully lit; no further animations; overall progress shows "6/6 districts unlocked" |
| Threshold crossed for multiple districts simultaneously | Each fires its own unlock animation sequentially (stagger by 400ms) |
| Tap unlocked district again | Shows station list and "已解鎖" (unlocked) badge; no animation replays |

## User Stories

1. As a daily commuter, I want to see which Taipei districts I have explored so I feel a sense of cumulative achievement from my routine travel.
2. As a rider viewing a district, I want to see which stations I have visited and how many more I need so I know my progress toward unlocking it.
3. As a rider who just hit the threshold, I want to see an unlock animation and receive bonus points so the achievement feels rewarding.
4. As a hackathon judge, I want to trigger a district unlock in one interaction so the exploration mechanic is clearly demonstrated.
5. As a rider checking overall progress, I want to see how many districts I have unlocked and total bonus earned so I can track my city-wide adventure.
