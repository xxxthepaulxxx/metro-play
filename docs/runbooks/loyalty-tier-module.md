# Runbook: Loyalty Tier Module (Module 3)

## Module Overview

Module 3: 會員等級 (Loyalty Tier / Privileges)

Purpose: Gamified tier progression that rewards cumulative point-earning with increasing reward multipliers.

Stack: Vue 3 + Pinia, client-side only, no backend, no mock API.

Store: `src/stores/loyaltyTier.ts`

Tier thresholds:

| Tier | Threshold | Multiplier |
|------|-----------|------------|
| Bronze | 0 | 1.0x |
| Silver | 200 | 1.2x |
| Gold | 500 | 1.5x |
| Platinum | 1000 | 2.0x |

## Demo Walkthrough (for hackathon judges)

Step-by-step:

1. App seeds `cumulativePoints` at 450 → user starts in Silver tier (1.2x multiplier)
2. Tap Tab 3 ("特權"/"會員等級") → navigates to `/privileges`
3. PrivilegesHomeView shows TierShieldCard: "Silver" badge, 1.2x multiplier, progress bar at ~83% toward Gold (500 pts)
4. CurrentPerksCard lists Silver perks; NextTierCard shows Gold at 500 pts, 50 remaining
5. Return to Module 1, complete a prediction game
6. Settlement: reward multiplied by 1.2x. SettlementOverlay shows "1.2x 加成"
7. If settlement pushes `cumulativePoints` past 500: `unlockPending=true` → UnlockAnimation plays tier-up celebration
8. After unlock: TierShieldCard shows "Gold", 1.5x multiplier, new progress toward Platinum (1000)

## State Flow

```
[Silver, 450 pts]
  → settle() in offPeak
  → reward * 1.2x multiplied → wallet credited
  → addPoints(adjustedReward) → cumulativePoints increases
  → if threshold crossed → unlockPending = true
  → UnlockAnimation plays → clearUnlock()
  → new tier active → higher multiplier on next settle
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Multiplier always 1.0x | cumulativePoints is 0 (localStorage cleared, seed not applied) | Clear all localStorage and reload; seed re-applies to 450 |
| Tier never upgrades after settlement | offPeak.ts settle() not calling loyaltyTierStore.addPoints() | Verify cross-store integration: must import useLoyaltyTierStore and call addPoints(adjustedReward) |
| UnlockAnimation never appears | unlockPending never set | Check addPoints() compares tier before/after increment |
| UnlockAnimation replays on every route change | clearUnlock() not called on dismiss | Ensure UnlockAnimation calls clearUnlock() in its dismiss handler |
| Progress bar > 100% | progress not clamped at Platinum | Verify progress computed handles null nextTierThreshold (Platinum) → returns 100 |
| Settlement reward not multiplied | settle() reads multiplier before store init | Ensure useLoyaltyTierStore() is called inside settle() action body |
| Tab 3 still shows old label | App.vue not updated | Update App.vue Tab 3: path /privileges, label "特權" |

## Key File Paths

| Purpose | Path |
|---------|------|
| Loyalty tier store | `src/stores/loyaltyTier.ts` |
| Off-peak store (cross-store caller) | `src/stores/offPeak.ts` |
| Shared wallet store | `src/stores/wallet.ts` |
| Privileges home view | `src/views/privileges/PrivilegesHomeView.vue` |
| TierShieldCard | `src/views/privileges/TierShieldCard.vue` |
| CurrentPerksCard | `src/views/privileges/CurrentPerksCard.vue` |
| NextTierCard | `src/views/privileges/NextTierCard.vue` |
| UnlockAnimation | `src/views/privileges/UnlockAnimation.vue` |
| Router config | `src/router/index.ts` |
| App shell (tab bar) | `src/App.vue` |
| App tests | `src/App.test.ts` |

## Reset Procedure (fresh demo)

1. Vue Devtools → find `loyalty-tier-store` → call `$reset()` or set cumulativePoints=450, unlockPending=false
2. Or: clear `loyalty-tier-store` key from localStorage → reload
3. Full reset: clear all localStorage → reload (wallet resets to 500, all modules reset)
