---
status: sliced
sliced_at: 2026-08-21
---

> **Archived (sliced 2026-08-21).** Build input only — not a live reference. Durable facts live in ADR / data-model / api-contract / runbooks.

# Implementation Detail — metro-blind-box-travel Module 2

**Document Version:** 1.0
**Status:** Architecture Locked
**Last Updated:** 2026-08-21

---

## Overview

Module 2: 盲盒旅行 (Blind Box Travel) implements a gamified discovery mechanism for Taipei MRT destinations. Users purchase a sealed blind box (randomized destination), optionally re-roll once, travel to the revealed MRT station, scan at station to verify arrival, visit a partnered merchant, scan merchant QR to verify purchase, and claim a discount plus bonus points.

**Stack:** Vue 3 + Vite + Pinia + Vue Router (TypeScript)
**API Strategy:** No backend; all API calls mocked via `src/api/mockApi.ts`
**Persistence:** LocalStorage (per ADR-0004)

---

## Store: `src/stores/blindBox.ts`

Pinia store named `useBlindBoxStore`. Manages the entire blind box purchase and verification workflow.

### State Shape

```typescript
interface BlindBoxState {
  activeBox: {
    id: string | null;
    destination: Destination | null;
    stationVerified: boolean;
    merchantVerified: boolean;
  };
  reward: {
    done: boolean;
    discountActivated: boolean;
    bonusPoints: number;
  };
  rerollCount: number; // max 1 re-roll per box
}
```

### Initial State

```typescript
{
  activeBox: {
    id: null,
    destination: null,
    stationVerified: false,
    merchantVerified: false,
  },
  reward: {
    done: false,
    discountActivated: false,
    bonusPoints: 0,
  },
  rerollCount: 0,
}
```

### Actions

#### `purchaseBox()`

- Calls `purchaseBox(cost)` from mock API (cost = 30 points for hackathon).
- Deducts cost from `useWalletStore().deduct(30)`.
- Sets `activeBox.id` and `activeBox.destination` from API response.
- Resets `rerollCount` to 0.

#### `rerollBox()`

- Guards: `rerollCount < 1` (max 1 re-roll per box).
- Calls `rerollBox(activeBox.id, cost)` from mock API (cost = 10 points).
- Deducts cost from wallet: `useWalletStore().deduct(10)`.
- Replaces `activeBox.destination` with new destination from response.
- Increments `rerollCount`.

#### `verifyStation(stationId: string)`

- Calls `scanStation(activeBox.id, stationId)` from mock API.
- On success (`verified === true`): sets `activeBox.stationVerified = true`.
- On failure: returns error without mutation.

#### `verifyMerchant(merchantCode: string)`

- Guards: `activeBox.stationVerified === true`.
- Calls `scanMerchant(activeBox.id, merchantCode)` from mock API.
- On success:
  - Sets `activeBox.merchantVerified = true`.
  - Populates `reward` object with response data: `discountActivated` remains `false` until claim, `bonusPoints` set from response.

#### `claimReward()`

- Guards: Both `activeBox.stationVerified === true` and `activeBox.merchantVerified === true`.
- Guards: `reward.done === false`.
- Calls `useWalletStore().credit(reward.bonusPoints)` to add bonus to wallet.
- Sets `reward.done = true`.
- Sets `reward.discountActivated = true`.

#### `resetBox()`

- Resets all state to initial values.
- Called after reward claim or when user returns home.

---

## Shared Wallet Store: `src/stores/wallet.ts`

**New store.** Extracted from `offPeak.ts` per ADR-0006 (wallet state separation).

### State Shape

```typescript
interface WalletState {
  balance: number; // initial 500 for hackathon demo
}
```

### Actions

#### `deduct(amount: number)`

- Subtracts `amount` from `balance`.
- Guards: throws error if result would be negative.

#### `credit(amount: number)`

- Adds `amount` to `balance`.

### Integration with offPeak Store

The existing `offPeak.ts` store **must be refactored** to:
- Import `useWalletStore`.
- Remove the `balance` field from offPeak state.
- Replace all reads of `state.balance` with `useWalletStore().balance`.
- Replace all writes (deductions, credits) with `useWalletStore().deduct()` and `useWalletStore().credit()`.

This separation allows blind box, off-peak prediction, and future modules to share a single wallet.

---

## Mock API: `src/api/mockApi.ts`

Append 4 new async functions to the existing file.

### `purchaseBox(cost: number): Promise<PurchaseBoxResponse>`

- Picks a random `Destination` from `DESTINATIONS` array in `mockData.ts`.
- Generates a UUID-like `boxId` (e.g., `"box-" + crypto.randomUUID()`).
- Returns `{ boxId, destination }`.
- **Simulated delay:** 300ms.

### `rerollBox(boxId: string, cost: number): Promise<RerollBoxResponse>`

- Picks a **different** random `Destination` from `DESTINATIONS` array.
- Returns `{ destination }`.
- **Simulated delay:** 300ms.

### `scanStation(boxId: string, stationId: string): Promise<ScanStationResponse>`

- Validates that `stationId` matches the current `activeBox.destination.station`.
- Returns `{ verified: boolean }`.
- On mismatch, returns `{ verified: false }`.
- **Simulated delay:** 500ms.

### `scanMerchant(boxId: string, merchantCode: string): Promise<ScanMerchantResponse>`

- Validates that `merchantCode` matches the current `activeBox.destination.merchantCode`.
- Returns:
  ```typescript
  {
    verified: boolean;
    discountText: string;
    bonusPoints: number;
  }
  ```
- On mismatch, returns `{ verified: false, discountText: "", bonusPoints: 0 }`.
- **Simulated delay:** 500ms.

### Response Types (in `src/api/types.ts`)

```typescript
interface PurchaseBoxResponse {
  boxId: string;
  destination: Destination;
}

interface RerollBoxResponse {
  destination: Destination;
}

interface ScanStationResponse {
  verified: boolean;
}

interface ScanMerchantResponse {
  verified: boolean;
  discountText: string;
  bonusPoints: number;
}
```

---

## Mock Data: `src/api/mockData.ts`

Add `DESTINATIONS: Destination[]` array with exactly 8 entries. Each entry structure:

```typescript
interface Destination {
  id: string;
  name: string; // Chinese destination name
  station: string; // MRT station name (Chinese)
  description: string; // 1-sentence Chinese description
  merchantCode: string; // format: MERCH-{AREA}-001
  discountText: string; // Chinese discount description
  bonusPoints: number; // 50–150
}
```

### The 8 Destinations

1. **dest-001: 北投溫泉**
   - Station: 新北投
   - Description: 北投溫泉鄉，享受天然溫泉浴池的舒適體驗
   - Merchant Code: `MERCH-BEITOU-001`
   - Discount Text: 溫泉飯店 9 折優惠
   - Bonus Points: 100

2. **dest-002: 永康街**
   - Station: 東門
   - Description: 永康街美食一條街，匯聚台灣道地小吃與餐飲名店
   - Merchant Code: `MERCH-YONGKANG-001`
   - Discount Text: 餐飲消費滿 200 元享 8 折
   - Bonus Points: 80

3. **dest-003: 西門町**
   - Station: 西門
   - Description: 西門町年輕活力商圈，流行服飾與電影文化的匯聚地
   - Merchant Code: `MERCH-XIMEN-001`
   - Discount Text: 品牌服飾 7 折優惠
   - Bonus Points: 70

4. **dest-004: 淡水老街**
   - Station: 淡水
   - Description: 淡水河畔老街，古蹟建築與夕陽景觀名聞遐邇
   - Merchant Code: `MERCH-TAMSUI-001`
   - Discount Text: 老街小吃消費享 9 折
   - Bonus Points: 120

5. **dest-005: 貓空**
   - Station: 動物園
   - Description: 貓空茶園與景觀餐廳，俯瞰台北夜景的最佳去處
   - Merchant Code: `MERCH-MAOKONG-001`
   - Discount Text: 茶餐廳消費滿 300 元享 8 折
   - Bonus Points: 150

6. **dest-006: 象山步道**
   - Station: 象山
   - Description: 象山步道登山步道，眺望台北 101 與城市景觀
   - Merchant Code: `MERCH-XIANGSHAN-001`
   - Discount Text: 登山裝備店 8 折優惠
   - Bonus Points: 90

7. **dest-007: 大稻埕**
   - Station: 大橋頭
   - Description: 大稻埕老社區，百年歷史與傳統工藝的文化重鎮
   - Merchant Code: `MERCH-DADAOCHENG-001`
   - Discount Text: 傳統工藝品消費享 9 折
   - Bonus Points: 110

8. **dest-008: 饒河夜市**
   - Station: 松山
   - Description: 饒河街夜市，在地美食與人情味的經典夜市體驗
   - Merchant Code: `MERCH-RAOHE-001`
   - Discount Text: 夜市消費滿 150 元享 7 折
   - Bonus Points: 60

---

## Routes: `src/router/index.ts`

Add 4 lazy-loaded routes to the router configuration:

```typescript
{
  path: '/blind-box',
  name: 'blind-box-home',
  component: () => import('../views/BlindBoxHomeView.vue'),
},
{
  path: '/blind-box/reveal',
  name: 'blind-box-reveal',
  component: () => import('../views/BlindBoxRevealView.vue'),
},
{
  path: '/blind-box/station',
  name: 'blind-box-station',
  component: () => import('../views/BlindBoxStationView.vue'),
},
{
  path: '/blind-box/merchant',
  name: 'blind-box-merchant',
  component: () => import('../views/BlindBoxMerchantView.vue'),
},
```

---

## Views (UI Components)

### BlindBoxHomeView.vue

**Purpose:** Home screen for blind box purchase flow.

**Features:**
- Display box price (30 points).
- Display current wallet balance (from `useWalletStore().balance`).
- "Purchase Blind Box" button → calls `useBlindBoxStore().purchaseBox()`.
- If `activeBox.id` already set, show current box status (destination preview, current journey progress) with "Continue Journey" button.
- Button disabled if wallet balance < 30 points.

**Navigation:**
- After successful purchase: navigate to `/blind-box/reveal`.
- Continue journey: navigate to `/blind-box/reveal`.

### BlindBoxRevealView.vue

**Purpose:** Animated card-flip reveal of the purchased destination.

**Features:**
- 3D card-flip animation (CSS `rotateY(180deg)` transform, 600ms duration).
- Before flip: sealed box image or "?" placeholder, purple accent (#7C3AED).
- After flip: destination card showing:
  - Destination name (Chinese)
  - Station name (Chinese)
  - Description (1-sentence Chinese)
  - Discount preview text
- Re-roll button:
  - Label: "再來一次" (Re-roll)
  - Cost: 10 points
  - Max 1 re-roll per box
  - Disabled if `rerollCount >= 1` or wallet balance < 10
  - Calls `useBlindBoxStore().rerollBox()`, re-animates card flip
- "開始旅程" (Start Journey) button → navigates to `/blind-box/station`.

**Design:**
- Glassmorphism card: `rgba(255,255,255,0.15)` + `backdrop-filter: blur(12px)`.
- Gold accent (#FFB300) for reward/destination reveal.
- Staggered `fadeSlideUp` entrance animation for title and buttons.

### BlindBoxStationView.vue

**Purpose:** Simulated QR scan for station verification.

**Features:**
- Display destination station name and map/image.
- "Scan at Station" button (simulates QR scan for hackathon).
- On tap: calls `useBlindBoxStore().verifyStation(destination.station)`.
- Success animation: green checkmark (accent #00A86B), 1–2 second display.
- After success: "Continue to Merchant" button → navigates to `/blind-box/merchant`.
- Failed scan: error message, retry option.

**Design:**
- Green accent (#00A86B) for verification success.
- Entrance animation: `fadeSlideUp`.

### BlindBoxMerchantView.vue

**Purpose:** Simulated merchant QR scan and reward claim.

**Features:**
- Display merchant name/code and location.
- "Scan Merchant QR" button (simulates QR scan).
- On tap: calls `useBlindBoxStore().verifyMerchant(destination.merchantCode)`.
- On success:
  - Show reward card with:
    - Discount text (Chinese)
    - Bonus points (from `reward.bonusPoints`)
    - "Claim Reward" button
  - Claim action: calls `useBlindBoxStore().claimReward()`, credits wallet, shows completion animation (confetti or particle burst).
- "Back to Home" button: calls `useBlindBoxStore().resetBox()`, navigates to `/blind-box`.

**Design:**
- Gold accent (#FFB300) for reward card.
- Green (#00A86B) for verification checkmark.
- Glassmorphism card: `rgba(255,255,255,0.15)` + `backdrop-filter: blur(12px)`.

---

## Navigation Entry Point

Add a card/button on the main app home view (`src/views/HomeView.vue` or equivalent root home component) linking to `/blind-box` with:
- **Label:** "盲盒旅行" (Blind Box Travel)
- **Subtitle:** "探索台北秘境，集點享折扣" (Explore Taipei hidden gems, earn discounts)
- **Icon/Visual:** Mystery box icon or sealed box emoji.
- Same glassmorphism card styling as other module cards.

---

## Design Tokens Referenced

### Colors

- **Purple (#7C3AED):** Sealed/mystery state (blind box card).
- **Gold (#FFB300):** Reward and destination reveal states.
- **Green (#00A86B):** Verification success (station, merchant, checkmarks).
- **Background Gradient:** Fixed diagonal, `#0070BD` (top-left) → `#00A86B` (bottom-right).

### Card & Glass Effect

- **Glassmorphism:** `background: rgba(255,255,255,0.15)` + `backdrop-filter: blur(12px)`.
- Border: optional `1px solid rgba(255,255,255,0.2)`.

### Animations

- **Entrance:** Staggered `fadeSlideUp` on component load (fade in + slide up 20px).
- **Card Flip:** CSS 3D transform:
  ```css
  transform: perspective(1000px) rotateY(180deg);
  transition: transform 600ms ease-in-out;
  ```
- **Success Checkmark:** Fade in, 1–2 second hold.
- **Claim Confetti:** Optional particle burst on reward claim (decorative only, no looping).

### Typography

- **System fonts only** (no custom typefaces).
- Bold/heavy weights for titles.
- 1.2–1.4 line-height for readability.

---

## File Checklist

**Files to create or modify** (all paths relative to `frontend/src/`):

### Stores

- [ ] `stores/wallet.ts` — **New.** Shared wallet state.
- [ ] `stores/blindBox.ts` — **New.** Blind box purchase and verification state.
- [ ] `stores/offPeak.ts` — **Modify.** Remove `balance` field, delegate to wallet store.

### API

- [ ] `api/types.ts` — **New or modify.** Add `Destination`, `PurchaseBoxResponse`, `RerollBoxResponse`, `ScanStationResponse`, `ScanMerchantResponse`.
- [ ] `api/mockData.ts` — **Modify.** Add `DESTINATIONS` array (8 entries).
- [ ] `api/mockApi.ts` — **Modify.** Add 4 functions: `purchaseBox`, `rerollBox`, `scanStation`, `scanMerchant`.

### Router

- [ ] `router/index.ts` — **Modify.** Add 4 routes: `/blind-box`, `/blind-box/reveal`, `/blind-box/station`, `/blind-box/merchant`.

### Views

- [ ] `views/BlindBoxHomeView.vue` — **New.** Purchase and home screen.
- [ ] `views/BlindBoxRevealView.vue` — **New.** Card-flip destination reveal.
- [ ] `views/BlindBoxStationView.vue` — **New.** Station QR scan simulation.
- [ ] `views/BlindBoxMerchantView.vue` — **New.** Merchant QR scan and reward claim.
- [ ] `views/HomeView.vue` — **Modify.** Add navigation card/button for "盲盒旅行".

---

## ADR References

- **ADR-0002:** Pinia state management (blind box and wallet stores).
- **ADR-0003:** Mock async API design (4 new functions, simulated delays).
- **ADR-0004:** LocalStorage persistence (wallet and blind box state saved automatically).
- **ADR-0006:** Wallet state extraction (shared across modules).

---

## Summary

This implementation detail specifies all store structures, API contracts, routes, and UI component requirements for Module 2. The blind box workflow is modular and integrates with the shared wallet store. All API calls are mocked with realistic delays. The design follows the established glassmorphism and color accent system, with entrance animations and 3D card-flip effects for immersive UX.

