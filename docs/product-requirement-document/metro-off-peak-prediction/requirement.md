# 離峰減碳大作戰 — Off-Peak Prediction Game (Module 1)

## Project Context

This is Module 1 of the "捷點生活 Metro Go Pass" hackathon prototype. The full product has four modules; this PRD covers Module 1 only. The prototype is a pure HTML/CSS/JS web demo (no build toolchain) targeting hackathon judges.

## 1. Problem Statement

Taipei MRT's Wenhu and Bannan lines suffer severe peak-hour congestion (07:30–08:30). The existing MRT point system offers no behavioral incentive to shift travel time. Commuters have no reason to adjust, and the current hackathon prototype only has screen mockups with no realistic game flow or data.

## 2. User / Persona

**Primary:** Taipei MRT commuters who regularly travel during peak hours (07:30–08:30) on Wenhu or Bannan lines. App-familiar riders willing to adjust their travel window for tangible, gamified rewards.

## 3. Core Mechanic — Two Independent Games with Combo Multiplier

The module contains two playable games. Each is independently completable. When both succeed in the same session, a combo multiplier applies (1+1 > 2).

### Game A — Commitment Pledge (卡位承諾)

| Step | Detail |
|------|--------|
| Commit window | Previous evening up to **06:00** on day-of travel |
| Action | User stakes a chosen number of points (e.g. 20 pts) and pledges to enter the MRT during that day's off-peak window |
| Off-peak window | Dynamic per line/station/day — derived from previous day's ridership data (or a simple forecast); the current day's window is displayed at commit time |
| Success condition | User taps the gate during the off-peak window |
| Standalone reward | Staked points returned + a base multiplier (e.g. 2× → 40 pts) |
| Failure — wrong time | Staked points forfeited to the public carbon-reduction fund pool |
| Failure — no-show | Staked points forfeited immediately; no grace period, no cancel |

### Game B — Ridership Prediction (運量猜猜樂)

| Step | Detail |
|------|--------|
| Action | User predicts today's ridership count (or range) for a specific line/station/time window |
| Data basis | Previous day's actuals + simple statistical forecast shown as reference |
| Success condition | Actual ridership falls within the user's predicted range |
| Standalone reward | Fixed point reward for a correct prediction (e.g. 30 pts) |
| Failure | No point change (prediction game has no stake) |

### Combo Multiplier — Both Succeed

When Game A (off-peak entry verified) AND Game B (prediction correct) both succeed in the same session, the user receives the 3× combo reward on the staked amount (e.g. stake 20 pts → receive 60 pts) plus a carbon-reduction badge. Standalone rewards do NOT stack additively on top of the combo — the combo replaces them.

## 4. Success Criteria (Hackathon Demo)

- Judges can walk through the full flow end-to-end: commit → predict → (simulated) off-peak gate verification → reward/forfeit settlement
- Each game is navigable from a separate tab/page in the UI
- Realistic sample data (simulated ridership numbers, off-peak windows, point balances) makes the demo feel credible
- The combo bonus path is demonstrable in one click

Measurable proxy: demo script can be completed in under 3 minutes by a first-time judge with no guidance.

## 5. Scope (In)

- Module 1 UI: separate pages/tabs for Game A and Game B
- Business logic spec for commit, predict, verify, settle, forfeit, combo detection
- Realistic mock/sample ridership data for the demo
- API contract spec (endpoints: commit, predict, verify, settle)
- Simple statistical prediction model for peak/off-peak forecasting (can be rule-based or lightweight regression on mock data)
- Carbon-reduction fund pool display (points forfeited go here)

## 6. Scope (Out)

- Modules 2, 3, 4 (blind-box travel, exclusive perks, city RPG)
- Live MRT data integration
- Real anti-cheat (GPS/Bluetooth/EasyCard timestamp verification)
- Native app development (demo remains web prototype)
- Backend infrastructure / production deployment

## 7. Edge Cases

| Scenario | Handling |
|----------|----------|
| User commits but doesn't ride | Points forfeited immediately at end of day; no cancel option |
| Off-peak window shifts from yesterday's default | UI must surface today's window at commit time; user sees it before staking |
| Only one game succeeds | Pays standalone reward only; no combo multiplier |
| Prediction played without commitment | Valid; pays standalone prediction reward if correct |
| User stakes 0 points | Should be disallowed — minimum stake enforced (TBD, suggest 10 pts) |
| Ridership data unavailable | Prediction game disabled for that day; clear UI message |

## 8. User Flow (Module 1)

```
[Open App / Module 1 tab]
        │
        ├──▶ [Game A: Commitment Pledge tab]
        │         │
        │         ├── View today's off-peak window (dynamic, shown prominently)
        │         ├── View peak congestion forecast
        │         ├── Choose stake amount (min 10 pts)
        │         ├── Confirm commit (deadline: 06:00 day-of)
        │         └── [Day passes] → gate tap detected
        │                   ├── Off-peak? → return stake + base reward
        │                   └── Peak / no-show? → forfeit to carbon fund
        │
        └──▶ [Game B: Ridership Prediction tab]
                  │
                  ├── View reference data (yesterday's ridership + forecast)
                  ├── Select prediction range (slider)
                  ├── Submit prediction
                  └── [Day-end] → actual vs. predicted
                            ├── Correct? → standalone prediction reward
                            └── Wrong? → no change
        │
        [Both games completed in same session]
                  └── Combo check → both succeed? → 3× reward + carbon badge
```

## 9. Prototype Page Requirements

- **P1-1 Prediction Homepage:** Today's peak congestion forecast; current off-peak window; commit button
- **P1-2 Bet & Zone Selection:** Ridership slider; stake point input; expected max return calculator; combo preview
- **P1-3 Entry Verification & Settlement Card:** Simulated gate-tap trigger; animated "+60 pts / Prediction Success!" card or forfeit notification
