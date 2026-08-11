# Critical Path Classification: metro-off-peak-prediction

## Status

**Brand New** — This feature does not extend or supersede any existing critical path in the repo. The repo currently has only a static HTML prototype (`index.html`) with no documented product requirements.

## Primary Critical Path

The core user journey that must be demonstrable end-to-end for the hackathon:

```
commit → predict → verify → settle → combo
```

### Flow Breakdown

1. **Commit** (Game A initialization)
   - User selects stake amount (minimum 10 pts)
   - User views today's off-peak window
   - User confirms commitment by 06:00 day-of
   - System records the pledge

2. **Predict** (Game B initialization)
   - User views reference ridership data (yesterday's actual + forecast)
   - User selects prediction range via slider
   - User submits prediction
   - System records the prediction

3. **Verify** (Gate tap detection)
   - Simulated gate-tap timestamp is generated
   - System checks whether tap falls within off-peak window
   - Result: success (off-peak) or failure (peak / no-show)

4. **Settle** (Reward or forfeit calculation)
   - If Game A succeeds: return staked points × base multiplier (2×)
   - If Game B succeeds: award fixed prediction points (30 pts)
   - If Game A fails: forfeit staked points to carbon-reduction fund pool
   - If Game B fails: no change to balance

5. **Combo** (Multiplier application)
   - Check: did both Game A AND Game B succeed in the same session?
   - If yes: override standalone rewards with 3× combo multiplier on stake (e.g., 20 pts stake → 60 pts total) + carbon-reduction badge
   - If no: apply standalone rewards as calculated

## Success Metric

The full path (commit → predict → verify → settle → combo) must be walkable by a first-time judge with no guidance in under 3 minutes.
