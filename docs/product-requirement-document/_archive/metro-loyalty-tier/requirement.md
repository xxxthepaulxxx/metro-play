---
status: sliced
sliced_at: 2026-08-21
---

> **Archived (sliced 2026-08-21).** Build input only — not a live reference. Durable facts live in ADR / data-model / api-contract / runbooks.

# 夢幻特權 (Dream Privilege) — Metro Loyalty Tier System

**Feature name:** `metro-loyalty-tier`
**Module:** Module 3
**Demo target:** Hackathon judges; full flow walkable in <3 min

## Problem Statement

High-point riders have no aspirational redemption target. Points pile up with nowhere to go, eroding the long-term motivation loop for returning Taipei MRT commuters who have accumulated points across Module 1 (off-peak prediction) and Module 2 (blind box travel).

## Persona

Returning Taipei MRT commuters who have accumulated off-peak points across Module 1/2 and need a long-term progression reason to sustain the habit.

## Core Mechanic — Hybrid Tier System

Tiers are driven by **cumulative points thresholds**. Certain individual privileges may also be gated behind specific achievements (future scope; out of hackathon demo).

| Tier | Cumulative pts threshold | Passive Multiplier |
|------|--------------------------|--------------------|
| Bronze | 0 | 1.0x |
| Silver | 200 | 1.2x |
| Gold | 500 | 1.5x |
| Platinum | 1000 | 2.0x |

The **Passive Multiplier** is applied automatically to session rewards at settlement (e.g. "Gold 1.5x applied" line item on the settlement card).

## Success Criteria (Hackathon Demo)

- Tap "確認等級" button → always shows current tier badge + progress bar toward next tier
- If a new threshold was just crossed → unlock animation fires on top of the tier/progress view
- Settlement card shows tier multiplier as a visible line item
- Mock data pre-seeded just below a threshold so one demo session crosses it

## Scope

### In Scope
- Tier data model (cumulative points, current tier, next-tier threshold) in Pinia store
- Tier progress UI: tier badge, progress bar, tier name
- Unlock animation on tier-up (entrance-only, no looping — consistent with design taste)
- Settlement card integration: passive multiplier line item
- "確認等級" entry point on Module 1 home screen
- Mock data pre-seeded near a threshold boundary for easy demo

### Out of Scope
- Tier decay / demotion mechanics
- Social / leaderboard features
- Privilege benefits beyond the passive multiplier (cosmetic rewards, exclusive stations, etc.)
- Backend persistence (stays Pinia / mock API, same as Module 1)
- Module 2 integration
- Actual redemption flows

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No sessions played | Bronze tier, progress bar at 0, no animation |
| Cross two thresholds in one session | Unlock animation fires for the highest tier reached only |
| Already at Platinum (max tier) | Progress bar shows "MAX", no animation fires |
| Tap "確認等級" at any time | Always shows current tier + progress bar; unlock animation overlays only if a threshold was just crossed in this session |

## User Stories

1. As a returning commuter, I want to see my loyalty tier and progress so I know how close I am to the next level.
2. As a commuter who just completed a session, I want to see my tier multiplier applied in the settlement card so I understand how my tier benefits me.
3. As a commuter who crosses a tier threshold, I want to see an unlock animation so the achievement feels rewarding.
4. As a hackathon judge, I want to trigger a tier-up in one demo session so the progression mechanic is clearly demonstrated.
