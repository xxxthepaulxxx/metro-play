---
status: sliced
sliced_at: 2026-08-21
---

> **Archived (sliced 2026-08-21).** Build input only — not a live reference. Durable facts live in ADR / data-model / api-contract / runbooks.

# Implementation Detail — metro-loyalty-tier Module 3

**Document Version:** 1.0
**Status:** Architecture Locked
**Last Updated:** 2026-08-21

---

## Overview

Module 3: 夢幻特權 (Loyalty Tier Privileges) implements a gamified reward tier system that incentivizes continued engagement across all modules. Users progress through four tiers (Bronze, Silver, Gold, Platinum) based on cumulative points earned from off-peak predictions and blind box activities. Higher tiers unlock point-earning multipliers (1.0x → 2.0x), exclusive perks, and exclusive visual status. Tier advancement triggers a fullscreen celebration overlay. The system integrates seamlessly with existing wallet and off-peak stores.

**Stack:** Vue 3 + Vite + Pinia + Vue Router (TypeScript)
**API Strategy:** No backend; all tier progression logic computed from store state
**Persistence:** LocalStorage (per ADR-0004)

---

## Tier System Constants

### Tier Table

Export as `const TIER_TABLE` array inside `src/stores/loyaltyTier.ts`.

```typescript
interface Tier {
  name: string; // English name, used as key
  displayName: string; // Chinese display name
  threshold: number; // cumulative points to unlock this tier
  multiplier: number; // earning multiplier (1.0x–2.0x)
  unlockEmoji?: string; // optional emoji for tier icon
}

const TIER_TABLE: Tier[] = [
  {
    name: "bronze",
    displayName: "青銅",
    threshold: 0,
    multiplier: 1.0,
    unlockEmoji: "🥉",
  },
  {
    name: "silver",
    displayName: "白銀",
    threshold: 200,
    multiplier: 1.2,
    unlockEmoji: "🥈",
  },
  {
    name: "gold",
    displayName: "黃金",
    threshold: 500,
    multiplier: 1.5,
    unlockEmoji: "🏆",
  },
  {
    name: "platinum",
    displayName: "鉑金",
    threshold: 1000,
    multiplier: 2.0,
    unlockEmoji: "👑",
  },
];
```

---

## Store: `src/stores/loyaltyTier.ts`

Pinia store using Composition API style (matching `wallet.ts` pattern). Store name: `useLoyaltyTierStore`.

### State Shape

```typescript
interface LoyaltyTierState {
  cumulativePoints: number;
  unlockPending: boolean;
}
```

### Initial State

```typescript
{
  cumulativePoints: 450, // Demo seed: starts mid-Silver (at 200–499)
  unlockPending: false,
}
```

**Reasoning for 450 seed:** During a 3-minute hackathon demo, judges start mid-Silver and after one complete game in Module 1 (settlement awards ~150–200 points with multiplier), they will cross the 500-point threshold and trigger a visible tier-up animation.

### Computed Getters

#### `currentTier: Tier`

Returns the highest entry in `TIER_TABLE` where `threshold <= cumulativePoints`.

Example:
- Points = 150 → Bronze (threshold 0)
- Points = 450 → Silver (threshold 200)
- Points = 550 → Gold (threshold 500)
- Points = 1200 → Platinum (threshold 1000)

#### `multiplier: number`

Returns `currentTier.multiplier` (1.0, 1.2, 1.5, or 2.0).

#### `nextTierThreshold: number | null`

Returns the threshold of the next tier above `currentTier`, or `null` if at Platinum.

Example:
- Current tier Silver (threshold 200) → next threshold = 500 (Gold)
- Current tier Platinum (threshold 1000) → next threshold = null

#### `progress: number`

Integer 0–100 representing percent of progress from current tier to next tier.

Formula:
```typescript
if (nextTierThreshold === null) {
  // Platinum: 100%
  return 100;
}
const rangeSize = nextTierThreshold - currentTier.threshold;
const currentProgress = cumulativePoints - currentTier.threshold;
return Math.round((currentProgress / rangeSize) * 100);
```

Example:
- Cumulativepoints = 300, Silver threshold = 200, Gold threshold = 500
  - Range = 300, Progress = 100 → 33%
- Cumulativepoints = 450, Silver threshold = 200, Gold threshold = 500
  - Range = 300, Progress = 250 → 83%

### Actions

#### `addPoints(n: number): void`

- Increments `cumulativePoints` by `n` (positive integer).
- **Tier-up detection:** After incrementing, check if `currentTier` changed from before to after:
  - If `currentTier` advanced to a higher tier, set `unlockPending = true`.
  - Do NOT set `unlockPending = true` if points increased but tier remained the same.
  - Do NOT trigger unlock if the user started at a higher tier (impossible on first call, but guard against edge cases).

Pseudocode:
```typescript
const oldTier = this.currentTier; // computed before increment
this.cumulativePoints += n;
const newTier = this.currentTier; // computed after increment
if (newTier.threshold > oldTier.threshold) {
  this.unlockPending = true; // tier advanced
}
```

#### `clearUnlock(): void`

Sets `unlockPending = false`. Called by the `UnlockAnimation` component after animation completes or user dismisses.

### Persistence

Enable pinia-plugin-persistedstate with key `"loyalty-tier-store"`. Both `cumulativePoints` and `unlockPending` are persisted.

**Edge case:** On app reload, if `unlockPending === true` from a previous session, the `UnlockAnimation` will fire automatically on mount in `PrivilegesHomeView`.

---

## Store: Modification to `src/stores/offPeak.ts`

### Cross-Store Integration in `settle()` Action

The existing `settle()` action in `offPeak.ts` must be refactored to apply the loyalty tier multiplier:

1. **Import the loyalty tier store** inside the `settle()` action:
   ```typescript
   const loyaltyTierStore = useLoyaltyTierStore();
   ```

2. **Read the multiplier** after settlement but before crediting wallet:
   ```typescript
   const multiplier = loyaltyTierStore.multiplier;
   ```

3. **Compute adjusted reward** by applying multiplier to the base reward:
   ```typescript
   const adjustedReward = Math.round(response.totalReward * multiplier);
   ```

4. **Update wallet credit** to use the adjusted reward:
   ```typescript
   wallet.credit(adjustedReward); // instead of wallet.credit(response.totalReward)
   ```

5. **Update loyalty tier store** with the adjusted reward:
   ```typescript
   loyaltyTierStore.addPoints(adjustedReward);
   ```

6. **Store multiplier metadata** for UI display:
   ```typescript
   this.settlement.multiplier = multiplier; // NEW field
   this.settlement.adjustedReward = adjustedReward; // NEW field (optional, for debug)
   ```

### State Shape Update

Add two new fields to the `settlement` object in `offPeak.ts`:

```typescript
interface SettlementState {
  done: boolean;
  combo: boolean;
  totalReward: number; // base reward before multiplier
  adjustedReward: number; // reward after multiplier (NEW)
  multiplier: number; // the tier multiplier applied (NEW), e.g., 1.2
  pledgeReward: number;
  guessReward: number;
  badge: string | null;
}
```

### Initial State Update

```typescript
settlement: {
  done: false,
  combo: false,
  totalReward: 0,
  adjustedReward: 0, // NEW
  multiplier: 1.0, // NEW
  pledgeReward: 0,
  guessReward: 0,
  badge: null,
}
```

---

## Router: `src/router/index.ts`

Replace the existing `/module3` route with `/privileges`:

**OLD:**
```typescript
{
  path: "/module3",
  component: () => import("../views/Module3Placeholder.vue"),
}
```

**NEW:**
```typescript
{
  path: "/privileges",
  component: () => import("../views/privileges/PrivilegesHomeView.vue"),
}
```

Keep `/module4` unchanged.

---

## App Shell: Modify `src/App.vue`

Update the Tab 3 configuration in the `tabs` array:

**OLD:**
```typescript
{ label: "👑 夢幻特權", to: "/module3", activePaths: ["/module3"] }
```

**NEW:**
```typescript
{ label: "👑 會員等級", to: "/privileges", activePaths: ["/privileges"] }
```

Alternative labels (pick one):
- "👑 會員等級" (Membership Tier — formal)
- "👑 我的特權" (My Privileges — personal)
- "👑 等級特權" (Tier Privileges — descriptive)

Update `isTabActive` logic to correctly recognize `/privileges` as the active tab.

---

## Views and Components

All components live in `src/views/privileges/` (new directory). All follow glassmorphism design (ref: `CLAUDE.md` design tokens, Module 2 examples).

### PrivilegesHomeView.vue

**Purpose:** Main page layout for the loyalty tier privileges module. Orchestrates sub-components and manages unlock animation trigger.

**Features:**
- Imports and renders sub-components:
  - `TierShieldCard` (current tier status, multiplier, progress bar)
  - `CurrentPerksCard` (active tier perks)
  - `NextTierCard` (next tier unlock info, locked perks)
  - `UnlockAnimation` (if `unlockPending === true`)
- Reads from `useLoyaltyTierStore()`.
- Layout: vertical stack with staggered `fadeSlideUp` entrance animations.
- "Return to Module" button at bottom links back to `/off-peak`.

**Styling:**
- Glassmorphism cards with blur and transparency.
- Gold accent (#FFB300) for highlights (consistent with Module 2).
- Rose/magenta accent (#E91E63) for tier unlock visual emphasis.
- Background: fixed diagonal gradient (inherited from App.vue).

**Data Flow:**
```
PrivilegesHomeView
├─ TierShieldCard (reads: currentTier, multiplier, progress)
├─ CurrentPerksCard (reads: currentTier)
├─ NextTierCard (reads: currentTier, nextTierThreshold, cumulativePoints)
└─ UnlockAnimation (reads: unlockPending, calls: clearUnlock())
```

### TierShieldCard.vue

**Purpose:** Hero card displaying the user's current tier, shield icon, multiplier badge, and EXP progress bar.

**Features:**
- **Tier Display:**
  - Tier emoji from `TIER_TABLE[currentTier].unlockEmoji` (🥉 🥈 🏆 👑)
  - Tier Chinese name (`displayName`)
  - Example: "🏆 黃金" (Gold)

- **Multiplier Badge:**
  - Displays current multiplier, e.g., "1.5x 加成" (1.5x Bonus)
  - Gold accent color (#FFB300)
  - Font weight: bold

- **EXP Progress Bar:**
  - Shows progress from current tier to next tier (0–100%)
  - Progress label: "{progress}% → 下一等級" (Next Tier)
  - At Platinum (100%): "滿級" (Max Level)
  - Bar fill color: rose/magenta (#E91E63) with 0.5 alpha glow effect
  - Height: 8–12px, border-radius: 4px
  - Background: subtle glass border

- **Static State:** No animation on initial load. Progress bar is visual reference only.

**Styling:**
- Glassmorphism: `rgba(255,255,255,0.15)` + `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(255,255,255,0.2)`
- Padding: `var(--spacing-lg)` all sides
- Text shadow (optional): very subtle, for readability over gradient
- Entrance animation: `fadeSlideUp` (staggered with parent)

**Accessibility:**
- Semantic heading: `<h2>會員等級</h2>`
- ARIA labels for progress: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Multiplier explanation in tooltip (optional).

### CurrentPerksCard.vue

**Purpose:** Lists the active perks for the current tier in a clean card layout.

**Features:**
- **Perk List (hardcoded per tier):**
  - Each tier has 2–3 perks (Chinese text).
  - Perks are **static**, not earned dynamically.

- **Example Perks by Tier:**

  **Bronze (threshold 0):**
  - 基礎賺點 (Basic Point Earning)
  - 進入會員圈 (Member Circle Access)

  **Silver (threshold 200):**
  - 所有青銅特權 (All Bronze Perks)
  - 1.2x 賺點加成 (1.2x Earning Bonus)
  - 會員限定商品 (Exclusive Membership Items)

  **Gold (threshold 500):**
  - 所有白銀特權 (All Silver Perks)
  - 1.5x 賺點加成 (1.5x Earning Bonus)
  - VIP 優先享樂 (VIP Priority Access)
  - 生日月份加碼 (Birthday Month Bonus)

  **Platinum (threshold 1000):**
  - 所有黃金特權 (All Gold Perks)
  - 2.0x 賺點加成 (2.0x Earning Bonus)
  - 專屬客服支持 (Dedicated Support)
  - 年度特別獎勵 (Annual Special Reward)

- **Visual Indicator:** Checkmark (✓) or icon next to each perk.
- **Text color:** bright white or gold accent.

**Styling:**
- Glassmorphism card with same pattern as TierShieldCard.
- List items: `display: flex` with icon + text.
- Icon color: gold (#FFB300) for active perks.
- Entrance animation: `fadeSlideUp` (staggered).

**Accessibility:**
- `<h3>現有特權</h3>` heading.
- Unordered list `<ul>` with proper `<li>` structure.
- Screen reader: "Current tier has 3 perks: Basic Point Earning, 1.2x Earning Bonus, Exclusive Membership Items"

### NextTierCard.vue

**Purpose:** Shows the next tier unlock condition and locked perks (hidden if at Platinum).

**Features:**
- **If not Platinum:**
  - Display next tier name (emoji + Chinese name)
  - Show points remaining: "{nextTierThreshold - cumulativePoints} 點數" (e.g., "150 points needed")
  - Progress text: e.g., "再賺 150 點就能升級到黃金" (Earn 150 more points to reach Gold)
  - List 2–3 locked perks for the next tier (sample/preview).
  - Unlock perks marked as "🔒 {perk name}" (locked icon).

- **If Platinum:**
  - Message: "🎉 您已達最高等級！" (Congratulations! You've reached max level!)
  - Show total cumulative points: "已累積 {cumulativePoints} 點數"
  - Hide the locked perks list.
  - Offer optional action: "分享成就" (Share Achievement) button (non-functional for hackathon).

**Styling:**
- Glassmorphism card.
- Text color: Gold (#FFB300) for "points remaining" and unlock thresholds.
- Locked perk icons: dark gray or muted color (✓ not yet earned).
- Entrance animation: `fadeSlideUp` (staggered).

**Accessibility:**
- `<h3>下一個等級</h3>` heading (or "最高等級達成！" if Platinum).
- Localize points remaining as `aria-label`: "150 points remaining to reach Gold tier".

### UnlockAnimation.vue

**Purpose:** Fullscreen overlay that plays when a user advances to a new tier. Shows celebratory animation and calls `clearUnlock()` to dismiss.

**Features:**
- **Trigger:** Renders only when `unlockPending === true` (reactively).
- **Content:**
  - Fullscreen semi-transparent dark overlay (backdrop).
  - Center card showing:
    - "🎉 升級成功！" (Tier Up Success!)
    - Previous tier emoji + "→" + New tier emoji + Chinese name.
    - Example: "🥈 白銀 → 🏆 黃金" (Silver → Gold)
    - New multiplier display: "新的加成倍數：{newMultiplier}x"
    - Unlock first perk from new tier (sample): "解鎖新特權：{perkName}"

- **Animation:**
  - Overlay fade-in: 300ms ease-out.
  - Center card: scale-up bounce (0 → 1.1 → 1.0, 500ms `cubic-bezier(0.34, 1.56, 0.64, 1)`).
  - Confetti or particle burst (optional, decorative): small emoji particles (✨ 💫 ⭐) falling from top-center for 1.5s, then fade out.
  - **Accessibility:** Respect `prefers-reduced-motion`:
    - If reduced-motion enabled: no scale bounce, no confetti. Just fade-in overlay + instant card display.

- **Dismissal:**
  - "確認" (Confirm) button at bottom of card, or
  - Auto-dismiss after 3 seconds (configurable).
  - On dismiss: call `loyaltyTierStore.clearUnlock()`, then fade-out overlay.

- **Stacking:** Always rendered at highest z-index (e.g., `z-index: 1000`), appears above all other content.

**Styling:**
- Overlay: `background: rgba(0, 0, 0, 0.7)`, `backdrop-filter: blur(4px)`.
- Center card: glassmorphism + rose accent (#E91E63) border glow.
- Text: large, bold, centered. Tier emoji: 3–4x normal size.
- Animation easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` for bounce (OvershootOut).

**Non-Animation Fallback:**
- If animations disabled, show a simple static card for 2 seconds with confetti disabled.
- Auto-dismiss still applies.

---

## Design Tokens

New CSS custom properties (add to `src/styles/design-tokens.css` or component scoped styles):

```css
:root {
  /* Tier-specific colors (rose/magenta accent) */
  --color-tier-accent: #E91E63;
  --color-tier-accent-dim: rgba(233, 30, 99, 0.12);
  --color-tier-accent-border: rgba(233, 30, 99, 0.35);
  --color-tier-accent-glow: rgba(233, 30, 99, 0.5);

  /* Animation durations */
  --duration-tier-unlock-bounce: 400ms;
  --duration-tier-glow-pulse: 600ms;
}
```

**Reference from existing tokens:**
- `--color-gold: #FFB300` (from Module 2, for multiplier and perk checks)
- `--font-weight-bold: 700` (for tier names and badges)
- `--spacing-lg: 2rem` (for card padding)
- `--blur-glass: blur(12px)` (for glassmorphism)

---

## Implementation Slices

The following slices represent atomic units of work to be converted into GitHub issues:

### Slice 1: Loyalty Tier Store + Router + Shell

**Files to create/modify:**
- `src/stores/loyaltyTier.ts` (NEW) — Pinia store with tier progression logic, state, computed, actions
- `src/router/index.ts` (MODIFY) — Replace `/module3` route with `/privileges`
- `src/App.vue` (MODIFY) — Update Tab 3 label and path to `/privileges`

**Deliverables:**
- Store fully typed with Tier interface
- TIER_TABLE constant with all four tiers
- State initialized: `cumulativePoints = 450`, `unlockPending = false`
- All computed getters (`currentTier`, `multiplier`, `nextTierThreshold`, `progress`) passing unit tests
- Actions `addPoints()` and `clearUnlock()` with tier-up detection
- Persistence via pinia-plugin-persistedstate
- Unit tests for store state, actions, computed, tier-up edge cases

**Acceptance Criteria:**
- Store is injectable via `useLoyaltyTierStore()`
- No console errors or TypeScript warnings
- Route `/privileges` loads successfully
- App.vue Tab 3 label visible and clickable

---

### Slice 2: PrivilegesHomeView + TierShieldCard

**Files to create:**
- `src/views/privileges/PrivilegesHomeView.vue` (NEW) — Layout, sub-component imports, unlock animation trigger
- `src/views/privileges/TierShieldCard.vue` (NEW) — Current tier display with EXP bar

**Deliverables:**
- PrivilegesHomeView renders full vertical layout with staggered entrance animations
- TierShieldCard displays:
  - Tier emoji + Chinese name (e.g., "🏆 黃金")
  - Multiplier badge (e.g., "1.5x 加成")
  - EXP progress bar (0–100%) with label
  - Glassmorphism styling with rose accent
- View responds to tier changes in store (reactive)
- Entrance animations fire once on component mount
- Unit and visual regression tests

**Acceptance Criteria:**
- Route `/privileges` displays PrivilegesHomeView
- TierShieldCard visible with all elements (emoji, name, multiplier, progress bar)
- Progress bar updates when store `cumulativePoints` changes
- No animation loops (entrance only)
- Accessible: proper heading hierarchy, ARIA labels for progress

---

### Slice 3: CurrentPerksCard + NextTierCard

**Files to create:**
- `src/views/privileges/CurrentPerksCard.vue` (NEW) — Active perk list for current tier
- `src/views/privileges/NextTierCard.vue` (NEW) — Next tier unlock condition and locked perks (or Platinum message)

**Deliverables:**
- CurrentPerksCard renders hardcoded perk list for current tier
  - Perks include inheritance (all lower-tier perks included)
  - Checkmark icons next to each perk
- NextTierCard shows:
  - Next tier info (name, emoji) or Platinum completion message
  - Points remaining calculation
  - 2–3 locked perk previews (if not Platinum)
  - Optional "Share" button for Platinum
- Both cards responsive to tier changes
- Glassmorphism styling, gold accents, staggered entrance animations
- Unit and visual tests

**Acceptance Criteria:**
- Both cards render in PrivilegesHomeView (below TierShieldCard)
- CurrentPerksCard perk list matches tier spec
- NextTierCard correctly calculates points remaining and displays locked perks
- Platinum case handled (no locked perks, completion message)
- All text in Chinese, properly localized

---

### Slice 4: Cross-Store Integration (Multiplier in settle())

**Files to modify:**
- `src/stores/offPeak.ts` (MODIFY) — Add multiplier logic to `settle()` action, update settlement state shape
- `src/views/Settlement.vue` (MODIFY) — Display multiplier in UI ("1.2x 加成")

**Deliverables:**
- `offPeak.ts` settle() action:
  - Imports `useLoyaltyTierStore()`
  - Reads multiplier after base settlement
  - Computes `adjustedReward = Math.round(totalReward * multiplier)`
  - Credits wallet with adjusted reward
  - Calls `loyaltyTierStore.addPoints(adjustedReward)`
  - Stores multiplier and adjusted reward in settlement state
- Settlement state includes new fields: `multiplier`, `adjustedReward`
- Settlement.vue displays:
  - Base reward: "基礎獎勵：{totalReward} 點"
  - Multiplier badge: "加成倍數：{multiplier}x"
  - Adjusted reward: "實際獲得：{adjustedReward} 點"
  - Visual highlight on adjusted amount (gold accent)
- Integration tests verify:
  - Starting with 450 points (Silver, 1.2x) + settling for 100 points = adjusted 120 points, tier unchanged
  - Settling for 200 points triggers tier-up to Gold (1.5x), adjusted reward = 300, unlockPending = true
  - Platinum (2.0x) multiplier applied correctly
  - Wallet balance updated with adjusted reward
- Unit tests for settle() action with mocked wallet + loyaltyTier stores

**Acceptance Criteria:**
- Settle game with a tier that has multiplier > 1.0 and verify adjusted reward is calculated
- Wallet receives adjusted reward (not base)
- Loyalty tier store receives adjusted reward in addPoints()
- Settlement UI shows all three reward values (base, multiplier, adjusted)
- No console errors

---

### Slice 5: UnlockAnimation (Tier-Up Celebration)

**Files to create:**
- `src/views/privileges/UnlockAnimation.vue` (NEW) — Fullscreen overlay with celebration animation

**Deliverables:**
- UnlockAnimation component:
  - Conditional render: only when `unlockPending === true`
  - Fullscreen overlay with backdrop blur and dark tint
  - Center card showing:
    - "🎉 升級成功！"
    - Tier transition emoji display (e.g., "🥈 → 🏆")
    - New tier Chinese name ("黃金")
    - New multiplier display ("新的加成倍數：1.5x")
    - Sample unlocked perk name
  - Animation sequence:
    - Overlay fade-in: 300ms ease-out
    - Card scale bounce: 0 → 1.1 → 1.0 over 500ms (bounce easing)
    - Confetti particles (optional): 5–8 emoji falling 1.5s
  - Dismissal:
    - "確認" button or 3-second auto-dismiss
    - Call `clearUnlock()` on dismiss
  - Accessibility:
    - Respects `prefers-reduced-motion`: no bounce, no confetti
    - Overlay remains non-interactive (pointer-events)
    - ARIA live region announcing tier up
- Animation tests:
  - Mock store with `unlockPending = true`
  - Verify overlay renders
  - Verify animations fire (if not mocked)
  - Verify button calls `clearUnlock()`
  - Verify reduced-motion fallback
- Visual regression test for animation frame snapshots (start, mid, end)

**Acceptance Criteria:**
- Tier-up animation plays when `unlockPending` becomes true
- No animation loops; plays once then dismisses
- Reduced motion respected (no-op animation)
- Button or timeout closes overlay correctly
- No z-index conflicts with other UI
- Accessible to screen readers

---

## File Checklist

**Files to create or modify** (all paths relative to `frontend/src/`):

### Stores
- [ ] `stores/loyaltyTier.ts` — **New.** Loyalty tier state and progression logic.
- [ ] `stores/offPeak.ts` — **Modify.** Add multiplier logic to settle() action, update settlement state.

### Router
- [ ] `router/index.ts` — **Modify.** Replace `/module3` with `/privileges` route.

### Views
- [ ] `views/privileges/PrivilegesHomeView.vue` — **New.** Main module page layout.
- [ ] `views/privileges/TierShieldCard.vue` — **New.** Current tier and progress display.
- [ ] `views/privileges/CurrentPerksCard.vue` — **New.** Active tier perks list.
- [ ] `views/privileges/NextTierCard.vue` — **New.** Next tier info and locked perks.
- [ ] `views/privileges/UnlockAnimation.vue` — **New.** Fullscreen tier-up celebration.
- [ ] `views/Settlement.vue` — **Modify.** Display multiplier and adjusted reward in settlement summary.

### App Shell
- [ ] `App.vue` — **Modify.** Update Tab 3 label and route to `/privileges`.

### Tests
- [ ] `stores/__tests__/loyaltyTier.spec.ts` — **New.** Unit tests for store.
- [ ] `stores/__tests__/offPeak.spec.ts` — **Modify.** Add integration tests for multiply logic in settle().
- [ ] `views/privileges/__tests__/*.spec.ts` — **New.** Unit tests for all view components.

---

## ADR References

- **ADR-0002:** Pinia state management (loyaltyTier store structure, Composition API pattern matching wallet.ts).
- **ADR-0006:** Cross-store integration pattern (offPeak store integrates with loyaltyTier and wallet stores).
- **ADR-0004:** Persistence (loyaltyTier state persisted to localStorage via pinia-plugin-persistedstate).

---

## Design System References

- **Glassmorphism:** `rgba(255,255,255,0.15)` + `backdrop-filter: blur(12px)` (ref: Module 2 blind box cards).
- **Gold Accent:** #FFB300 (ref: Module 2, for rewards and highlights).
- **Rose/Magenta Accent:** #E91E63 (new, tier-specific emphasis).
- **Entrance Animations:** `fadeSlideUp` staggered (ref: Module 2, no looping content animations).
- **Typography:** System fonts only, bold/heavy weights for titles (ref: Module 1 & 2 design taste).
- **Animations:** Entrance-only. UnlockAnimation is the only module-specific looping animation (bounded to tier-up event, respects reduced-motion).

---

## Summary

This implementation detail specifies all store structures, computed properties, tier progression logic, cross-store integration, routes, and UI component requirements for Module 3 (Loyalty Tier Privileges). The system seamlessly integrates with existing wallet and off-peak stores, applying a transparent multiplier to all earned rewards based on the user's current tier. Tier advancement triggers a joyful, accessible fullscreen celebration overlay. The design follows the established glassmorphism language and color system, with rose accent as the tier-specific visual identity. All API logic is store-based (no backend calls). The module is modular, testable, and ready for sliced delivery across five independent GitHub issues.
