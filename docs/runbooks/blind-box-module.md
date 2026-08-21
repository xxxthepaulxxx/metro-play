# Runbook: Blind Box Travel Module (Module 2)

## Module Overview
Module 2: 盲盒旅行 (Blind Box Travel)
Purpose: gamified random-destination travel experience on Taipei MRT
Stack: Vue 3 + Pinia, client-side only, no backend

## Demo Walkthrough (for hackathon judges)

Step-by-step:
1. Start at app home, tap "盲盒旅行" card
2. On BlindBoxHomeView: note wallet balance (500 pts initial), tap "購買盲盒" (costs 30 pts)
3. On BlindBoxRevealView: watch card-flip animation (600ms CSS 3D rotateY), see destination revealed. Optionally tap "重新抽選" to re-roll (costs 10 pts, one-time only). Tap "出發冒險"
4. On BlindBoxStationView: tap "模擬掃描" to simulate station QR scan. Checkmark animation confirms arrival. Navigates to merchant view
5. On BlindBoxMerchantView: tap "模擬掃描" to simulate merchant scan. Reward card appears with discount text and bonus points. Tap "領取獎勵" to credit points to wallet
6. Return to home. Wallet balance should reflect: 500 − 30 (purchase) − 10 (if re-rolled) + bonusPoints

## State Flow

```
[No Box] --purchaseBox()--> [Box Active, destination set]
         --rerollBox(max 1)--> [Box Active, new destination]
         --verifyStation()--> [Station Verified]
         --verifyMerchant()--> [Merchant Verified, reward populated]
         --claimReward()--> [Reward Done, wallet credited]
         --resetBox()--> [No Box]
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Insufficient balance" when purchasing | Wallet balance < 30 | Reset app (clear localStorage) or call `walletStore.credit(500)` in Vue Devtools |
| Re-roll button disabled | Already used 1 re-roll (by design, max 1) | Expected behavior |
| Station scan always fails | stationId mismatch (hackathon mode auto-matches) | Ensure stationId matches `destination.station` |
| Merchant scan button not shown | Station not yet verified | Complete station scan step first |
| Points not credited after claim | `reward.done` was already `true` (double-claim guard) | Call `resetBox()` to start fresh |
| Balance shows two different values | `offPeak.ts` not refactored to use `useWalletStore` | Check `src/stores/offPeak.ts` for residual `balance` state; apply ADR-0006 migration |

## Key File Paths

| Purpose | Path |
|---------|------|
| Blind box store | `frontend/src/stores/blindBox.ts` |
| Shared wallet store | `frontend/src/stores/wallet.ts` |
| Mock API functions | `frontend/src/api/mockApi.ts` |
| Mock destinations data | `frontend/src/api/mockData.ts` |
| Views | `frontend/src/views/BlindBox*.vue` |
| Routes | `frontend/src/router/index.ts` |

## Reset Procedure (fresh demo)

1. Open Vue Devtools → find `blind-box-store` → call action `resetBox()`
2. Or: clear `localStorage` in browser DevTools → reload page
3. Wallet balance resets to 500 on fresh load (initial state)
