# Ops Runbook: Hackathon Demo Script

**Audience:** Demo presenter (ops)
**Trigger:** Before presenting to hackathon judges

## Prerequisites

- Vue dev server running on `http://localhost:5173` (see [Run Vue Dev Server](../dev/run-vue-dev.md))
- Browser open on Module 1 Home

## Demo Flow

### 1. Reset State

Click the "↺ 重置示範" button (top-right) OR clear localStorage `off-peak-store` key and refresh the page.

### 2. Show Module 1 Home (P1-1)

Point out the following to the judges:
- **Today's congestion forecast:** The peak bar chart for 文湖線 and 板南線
- **Today's off-peak window:** Times showing 07:00前 and 09:00後
- **Carbon fund pool:** Current accumulated fund value

### 3. Game A — Commitment (P1-2a)

1. Tap "接受任務 ▶" on the **卡位承諾** (Commitment) card
2. Show the stake selector interface
3. Set stake to **20 pts**
4. Tap "確認下注" (Confirm Bet)
5. Verify the balance decreases by 20 points

### 4. Game B — Prediction (P1-2b)

1. Tap "開始預測 ▶" on the **運量猜猜樂** (Prediction) card
2. Show the reference ridership data to judges
3. Drag the slider to a predicted range
4. Tap "送出預測" (Submit Prediction)

### 5. Simulate Gate Tap

Tap the "模擬進站" (Simulate Gate Tap) button. The system will verify that the entry is within the off-peak window.

### 6. Settlement Overlay

A full-screen overlay will animate in showing the result:
- Expected display: "🔥 COMBO 串關！+60 pts"
- Dismiss by tapping anywhere on the overlay

### 7. Show Balance Updated

Return to Module 1 Home and verify the balance has been updated:
- **Previous balance:** 1,240 pts
- **After stake:** 1,240 - 20 = 1,220 pts
- **After combo reward:** 1,220 + 60 = 1,280 pts

### 8. Show Carbon Fund (Optional Forfeit Path)

To demonstrate the forfeit path:
1. Reset using "↺ 重置示範"
2. Commit to a game (卡位承諾)
3. Simulate entry during peak hours (instead of off-peak)
4. Overlay shows forfeit message
5. Verify carbon fund pool increases

## Verification Signal

Judges should be able to see the complete flow (commit → predict → verify → settle → combo reward) in under 3 minutes.

## Rollback / If Something Breaks

Click the "↺ 重置示範" button to restore all mock data to the initial state.

## Related Documentation

- implement-detail.md — Full technical specifications
- ADR-0003 — Mock API design
- ADR-0005 — Prediction model logic
