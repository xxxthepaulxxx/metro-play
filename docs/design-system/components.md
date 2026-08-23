# Component Inventory — metro-off-peak-prediction

All reusable components for the metro-off-peak-prediction design system, with token references and implementation notes.

---

## Core Components

### GlassCard

**Description:** Standard glassmorphism card — the foundation for all content surfaces.

| Property | Token / Value |
|----------|---------------|
| Background | `var(--color-glass-card)` |
| Backdrop filter | `var(--blur-card)` (blur 12px) |
| Border | `1px solid var(--color-glass-border)` |
| Border-radius | `var(--radius-card)` (16px) |
| Padding | `var(--spacing-lg)` (16px) |
| Entrance animation | `fadeSlideUp` (0.35s ease, staggered 50ms) |

**Token references:**
- `--color-glass-card`: `rgba(255, 255, 255, 0.15)`
- `--color-glass-border`: `rgba(255, 255, 255, 0.3)`
- `--radius-card`: `16px`
- `--spacing-lg`: `16px`
- `--blur-card`: `blur(12px)`

**Usage:** Primary container for all game cards, mission cards, forecast cards, and info panels.

---

### ComboCard

**Description:** Specialized GlassCard with inner dark background for enhanced gold text contrast.

| Property | Token / Value |
|----------|---------------|
| Outer container | GlassCard base |
| Outer border | `1.5px solid` gold gradient (`#FFB300` → `#FF8C00`) |
| Inner background | `var(--color-glass-combo)` |
| Inner padding | `var(--spacing-lg)` (16px) |
| Border-radius | `var(--radius-card)` (16px) |
| Entrance animation | `fadeSlideUp` (0.35s ease, staggered 50ms) |

**Token references:**
- `--color-glass-combo`: `rgba(0, 20, 40, 0.55)` — ensures white and gold text contrast
- `--color-gold`: `#FFB300` (start of gradient)
- `--color-gold-dark`: `#FF8C00` (end of gradient)

**Usage:** High-priority mission cards, reward previews, combo multiplier displays. The dark inner ensures gold accent text passes WCAG AA contrast.

---

### MissionBadge

**Description:** Pill-shaped badge for mission type indication.

**Gold variant (Mission A):**
| Property | Token / Value |
|----------|---------------|
| Background | `rgba(255, 179, 0, 0.25)` |
| Border | `1px solid var(--color-gold)` |
| Border-radius | `var(--radius-pill)` (20px) or 24px |
| Text | `var(--color-gold)` |
| Font-size | `var(--font-size-xs)` (11px) or `--font-size-sm` (12px) |
| Font-weight | `var(--font-weight-bold)` to `--font-weight-black` (700–900) |

**Purple variant (Mission B):**
| Property | Token / Value |
|----------|---------------|
| Background | `rgba(124, 58, 237, 0.25)` |
| Border | `1px solid var(--color-purple)` |
| Border-radius | `var(--radius-pill)` (20px) or 24px |
| Text | `var(--color-purple)` |
| Font-size | `var(--font-size-xs)` to `--font-size-sm` |
| Font-weight | `var(--font-weight-bold)` to `--font-weight-black` |

**Usage:** Labeling mission type on mission cards. Gold for Commitment Pledge (Mission A), purple for Ridership Prediction (Mission B).

---

### RewardBadge

**Description:** Smaller pill badge for reward indicators and secondary labels.

| Property | Token / Value |
|----------|---------------|
| Background | `rgba(255, 179, 0, 0.18)` (gold) or `rgba(124, 58, 237, 0.18)` (purple) |
| Border | `1px solid var(--color-gold)` or `--color-purple` |
| Border-radius | `20px` (more pill-like) |
| Text | `var(--color-gold)` or `--color-purple` |
| Font-size | `var(--font-size-xs)` (11px) |
| Font-weight | `var(--font-weight-bold)` to `--font-weight-extra-bold` (700–800) |

**Usage:** Smaller badge variants in card footers, reward type labels, secondary status indicators.

---

## Interactive Components

### CTAButton

**Description:** Full-width or inline call-to-action button with gradient and press animation.

**Gold variant:**
| Property | Token / Value |
|----------|---------------|
| Background | Linear gradient `var(--color-gold)` to `var(--color-gold-dark)` (`#FFB300` → `#FF8C00`) |
| Border-radius | `var(--radius-button)` (24px) |
| Padding | `var(--spacing-sm)` vertical, `var(--spacing-lg)` horizontal (8px / 16px) |
| Text | `var(--color-text-primary)` (#FFFFFF), bold |
| Font-size | `var(--font-size-body)` (13px) |
| Font-weight | `var(--font-weight-extra-bold)` (800) |
| Press state | `scale(0.96)` over `var(--duration-fast)` (0.15s) |
| Cursor | `pointer` |

**Purple variant:**
| Property | Token / Value |
|----------|---------------|
| Background | Linear gradient `var(--color-purple)` to `var(--color-purple-dark)` (`#7C3AED` → `#4F46E5`) |
| Other properties | Same as gold variant |

**Usage:** Primary game CTAs (Play, Submit, Confirm), mission entry points. Gold for Mission A and positive actions, purple for Mission B and alternative actions.

---

## Navigation Components

### TabBar

**Description:** Sticky global navigation bar at page top.

| Property | Token / Value |
|----------|---------------|
| Position | `sticky` top |
| Background | `var(--color-tab-bg)` with `backdrop-filter: var(--blur-tab)` (blur 20px) |
| Tab text (active) | `var(--color-gold)` (#FFB300) |
| Tab text (inactive) | `var(--color-text-muted)` (`rgba(255, 255, 255, 0.6)`) |
| Underline (active) | `var(--color-gold)` with subtle glow, 2–3px height |
| Underline transition | `var(--duration-normal)` (0.2s) |
| Tabs | 4 total (⚔️, 🎁, 👑, 🗺️) |

**Token references:**
- `--color-tab-bg`: `rgba(0, 0, 0, 0.3)`
- `--blur-tab`: `blur(20px)`
- `--color-gold`: `#FFB300`
- `--color-text-muted`: `rgba(255, 255, 255, 0.6)`
- `--duration-normal`: `0.2s`

**Usage:** Global app navigation. Always sticky at top. Active tab shows gold underline and gold text. Inactive tabs use muted text color.

---

## Progress & Status Components

### EXPBar

**Description:** Linear progress bar for carbon fund or experience tracking.

| Property | Token / Value |
|----------|---------------|
| Border | `1px solid var(--color-gold)` |
| Fill color | `var(--color-bg-gradient-end)` (#00A86B, off-peak green) |
| Height | 14px |
| Border-radius | 10px |
| Width | Full container width |

**Usage:** Carbon fund progress visualization, level progression display.

---

### LevelBadge

**Description:** Pill badge displaying user level or rank.

| Property | Token / Value |
|----------|---------------|
| Background | `rgba(255, 179, 0, 0.12)` |
| Border | `1px solid var(--color-gold)` |
| Border-radius | `var(--radius-pill)` (20px) |
| Text | `var(--color-gold)` |
| Font-size | `var(--font-size-sm)` (12px) |
| Font-weight | `var(--font-weight-extra-bold)` (800) |

**Usage:** Always-visible level indicator in hero header (Module 1 Home). Shows player progression and gamification status.

---

### PtsBadge

**Description:** Pill badge displaying user point balance.

| Property | Token / Value |
|----------|---------------|
| Background | `rgba(255, 179, 0, 0.18)` |
| Border | `1px solid var(--color-gold)` |
| Border-radius | `var(--radius-pill)` (20px) |
| Text | `var(--color-gold)` |
| Font-size | `var(--font-size-body)` (13px) |
| Font-weight | `var(--font-weight-extra-bold)` (800) |
| Format | `💰 X,XXX pts` |

**Usage:** Point balance display in hero header (Module 1 Home). Always visible and updated in real-time.

---

## Decorative Components

### FloatingParticles

**Description:** Non-interactive decorative particles that float in the background.

| Property | Value |
|----------|-------|
| Elements | 3 emoji: `✨ ⭐ 💫` |
| Animation | Float from bottom to top |
| Duration | `var(--duration-float)` (6s) cycle |
| Stagger | 2s between particle starts |
| Positioning | `position: fixed` |
| Pointer events | `pointer-events: none` — does not block interaction |
| Opacity | Fade in/out smoothly |

**Token references:**
- `--duration-float`: `6s`

**Important:** Purely decorative. Must not interfere with card interaction or tab navigation.

**Usage:** Background ambiance only. Adds playful energy to the gamified aesthetic without distraction.

---

## Component Spacing & Layout

All components respect the spatial rhythm:

| Relation | Spacing |
|----------|---------|
| Card to card (vertical/horizontal) | `var(--spacing-md)` (12px) |
| Card padding | `var(--spacing-lg)` (16px) |
| Page edge padding | 14px (custom: `--spacing-sm` + 6px) |
| Gap within card (title to content) | `var(--spacing-md)` (12px) |
| Gap within card (content to footer) | `var(--spacing-sm)` (8px) |

---

## Motion & Entrance Summary

All GlassCard and ComboCard components use:
- **Entrance animation:** `fadeSlideUp`
  - `opacity: 0 → 1`
  - `transform: translateY(14px) → 0`
  - Duration: 0.35s `ease` timing
  - Stagger: 50ms per card (first card at 0ms, second at 50ms, etc.)
- **No looping animations** on cards themselves — motion is reserved for entrance and CTAs only.

---

## Implementation Quick Start

All components are CSS-only or minimal HTML/JS. No build toolchain required. Reference design tokens directly in stylesheets:

```css
.glass-card {
  background-color: var(--color-glass-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  padding: var(--spacing-lg);
  backdrop-filter: var(--blur-card);
  animation: fadeSlideUp var(--duration-slow) ease forwards;
}

.cta-button-gold {
  background: linear-gradient(to right, var(--color-gold), var(--color-gold-dark));
  border-radius: var(--radius-button);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-extra-bold);
  transition: transform var(--duration-fast);
}

.cta-button-gold:active {
  transform: scale(0.96);
}
```

For reference implementations, see `docs/design-system/samples/index.html`.

---

## Module 2 Components

### MysteryBox

CSS 3D cube with two visible faces (front and top), teal gradient fill, large "?" on front face. Idle: pulsing outer glow using `--color-box-glow` (affordance cue, not decorative looping). On tap: triggers flip reveal to `BoxRevealCard`.

- **Props:** `size` (default `160px`), `disabled`
- **Tokens:** `--color-box-accent`, `--color-box-glow`, `--color-box-accent-dim`
- **Accessibility:** `role="button"`, `aria-label="Open blind box"`, focus-visible ring uses `--color-box-accent`

### BoxRevealCard

Destination card revealed after the 180° Y-axis flip. Glassmorphism base with `--color-box-accent-border` border and `--color-box-accent-dim` background tint.

Content regions: station name (bold), hidden spot name (secondary), discount description (badge with `--color-box-accent`), re-roll button (shows point cost, triggers shake + re-flip), "Let's Go!" CTA (navigates to `/module2/destination`).

- **Tokens:** `--color-box-accent-border`, `--color-box-accent-dim`, `--color-box-accent`, `--duration-box-flip`, `--duration-box-shake`, `--timing-flip`
- **Accessibility:** re-roll `aria-label` includes cost, CTA is a standard labelled button

### ScanSimulator

Full-width button simulating a QR scan. On tap: concentric teal pulse rings animation, then success state (checkmark + scale-up).

- **Props:** `label`, `onScan`
- **Tokens:** `--color-box-accent`, `--color-box-glow`
- **Accessibility:** `role="button"`, `aria-label` from `label` prop, success announced via `aria-live="polite"`

### RewardSummary

Settlement card after full journey. Glassmorphism base.

Content: discount-activated badge (`--color-box-accent` background), bonus-points display (`--color-gold`, entrance scale-bounce, no loop), updated point balance.

- **Tokens:** `--color-box-accent`, `--color-gold`
- **Accessibility:** wrapped in `aria-live="polite"`

---

## Module 3 — 夢幻特權 (Loyalty Tier) Components

### TierShieldCard

**Description:** Hero card displaying current loyalty tier and EXP progress to next tier.

**Layout:**
- Shield icon (🛡️) centered at top
- Tier name (Bronze/Silver/Gold/Platinum) below shield, bold
- EXP bar (rose fill) showing progress to next tier
- Cumulative points label below bar

**Tier badge colors:**
- Bronze: `#CD7F32`
- Silver: `#C0C0C0`
- Gold: `#FFD700`
- Platinum: `#E5E4E2`

| Property | Token / Value |
|----------|---------------|
| Container | ComboCard (dark glass inner for contrast) |
| Outer border | `1.5px solid var(--color-tier-accent)` (rose) |
| Inner background | `var(--color-glass-combo)` |
| EXP bar fill | `var(--color-tier-accent)` (#E91E63) |
| EXP bar border | `1px solid var(--color-tier-accent)` |
| Tier badge background | Tier-specific color (Bronze/Silver/Gold/Platinum) |
| Text | `var(--color-text-primary)` (white) |
| Entrance animation | `fadeSlideUp` (0.35s ease) |

**Token references:**
- `--color-tier-accent`: `#E91E63`
- `--color-glass-combo`: `rgba(0, 20, 40, 0.55)`
- `--color-text-primary`: `#FFFFFF`

**Usage:** Always-visible hero card on `/privileges` route. Shows current tier and progress.

---

### CurrentPerksCard

**Description:** Glass card displaying active perks for the current tier.

| Property | Token / Value |
|----------|---------------|
| Container | GlassCard |
| Border | `1px solid var(--color-tier-accent-border)` (solid rose border) |
| Background | `var(--color-glass-card)` |
| Perk badge background | `var(--color-tier-accent-dim)` |
| Perk badge border | `1px solid var(--color-tier-accent)` |
| Perk text | `var(--color-text-primary)` |
| Entrance animation | `fadeSlideUp` (0.35s ease, staggered) |

**Token references:**
- `--color-tier-accent-border`: `rgba(233, 30, 99, 0.35)`
- `--color-tier-accent-dim`: `rgba(233, 30, 99, 0.12)`
- `--color-glass-card`: `rgba(255, 255, 255, 0.15)`

**Content regions:**
- Title: "アクティブなパーク" (Active Perks)
- Passive multiplier badge (e.g., "+10% points on off-peak rides")
- Privilege list (e.g., "Early access to events", "Exclusive discounts")

**Usage:** Displayed below TierShieldCard on `/privileges`. Shows what the rider has earned at current tier.

---

### NextTierCard

**Description:** Glass card displaying locked perks for the next tier. Shows dashed border to indicate locked state.

| Property | Token / Value |
|----------|---------------|
| Container | GlassCard |
| Border | `2px dashed var(--color-tier-accent-border)` (dashed, dim rose) |
| Background | `var(--color-glass-card)` with reduced opacity (semi-transparent dim) |
| Locked icon overlay | `🔒` or lock icon, positioned top-right |
| Points needed | Bold rose text (`var(--color-tier-accent)`) |
| Perk list text | `var(--color-text-muted)` (reduced opacity) |
| Entrance animation | `fadeSlideUp` (0.35s ease, staggered) |

**Token references:**
- `--color-tier-accent-border`: `rgba(233, 30, 99, 0.35)`
- `--color-tier-accent`: `#E91E63`
- `--color-text-muted`: `rgba(255, 255, 255, 0.6)`

**Content regions:**
- Locked icon (🔒)
- Next tier name (e.g., "シルバー" / Silver)
- Points required (e.g., "需要 500 個 pts 達成")
- Perks that will unlock (list, muted)

**Behavior:** Hidden when rider reaches Platinum tier (max tier).

**Usage:** Displayed below CurrentPerksCard on `/privileges`. Shows goal for next achievement.

---

### UnlockAnimation

**Description:** Full-screen overlay displayed when rider tier-ups. One-shot animation, no loop.

| Property | Token / Value |
|----------|---------------|
| Background | Semi-transparent dark overlay (e.g., `rgba(0, 0, 0, 0.6)`) |
| Card container | Centered ComboCard |
| Animation | Scale-bounce (400ms) + rose glow pulse (600ms) |
| Glow color | `var(--color-tier-accent-glow)` |
| Reduced motion | Opacity fade only (no scale, no glow) |

**Token references:**
- `--color-tier-accent-glow`: `rgba(233, 30, 99, 0.5)`
- `--duration-tier-unlock-bounce`: `400ms`
- `--duration-tier-glow-pulse`: `600ms`

**Content:**
- "👑 Tier Up!" (or celebratory emoji/text)
- New tier name and badge
- Unlock message (e.g., "新しい特権を解除しました！" / "New privileges unlocked!")

**Behavior:**
- Appears on-screen with scale-bounce + glow pulse
- Dismissible by tap/click, or auto-closes after animation completes (1s+)
- Respects `prefers-reduced-motion: reduce` — reduces to opacity fade only

**CSS pattern for unlock animation:**
```css
@keyframes tierUnlockBounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes tierGlowPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--color-tier-accent-glow); }
  50% { box-shadow: 0 0 0 20px transparent; }
}

.unlock-animation {
  animation: tierUnlockBounce var(--duration-tier-unlock-bounce) ease-out,
            tierGlowPulse var(--duration-tier-glow-pulse) ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .unlock-animation {
    animation: fadeIn 0.3s ease-out;
  }
}
```

**Usage:** Displayed on tier-up event in `/privileges` view. One-shot celebration, then dismissed.

---

## Module 4 — City RPG Unlock Components

### DistrictCard

Glass card for a single city district in the vertical scrolling list on `/rpg`. Two visual states:

**Locked state:**

| Property | Token / Value |
|----------|---------------|
| Container | GlassCard |
| Border | `2px dashed var(--color-rpg-accent-border)` |
| Background | `var(--color-glass-card)` |
| Lock icon | 🔒, positioned top-right |
| District name text | `var(--color-text-muted)` |
| Progress bar | Empty / zero-fill |
| Entrance animation | `fadeSlideUp` (0.35s ease, staggered) |

**Unlocked state:**

| Property | Token / Value |
|----------|---------------|
| Container | GlassCard |
| Border | `1px solid var(--color-rpg-accent)` |
| Background | `var(--color-glass-card)` |
| Badge | Checkmark + "已解鎖" pill, `var(--color-rpg-accent)` text on `var(--color-rpg-accent-dim)` bg |
| District name text | `var(--color-text-primary)` |
| Progress bar fill | `var(--color-rpg-accent)` |
| Entrance animation | `fadeSlideUp` (0.35s ease, staggered) |

**Accessibility:** `role="link"`, `aria-label` includes district name and locked/unlocked status. Focus-visible ring uses `var(--color-rpg-accent)`. Minimum 44px touch target.

**Usage:** Vertical list on `/rpg`. Tap navigates to `/rpg/district/:id`.

---

### DistrictDetailCard

Hero card on `/rpg/district/:id`. ComboCard style with amber border.

| Property | Token / Value |
|----------|---------------|
| Container | ComboCard (dark glass inner) |
| Outer border | `1.5px solid var(--color-rpg-accent)` |
| Inner background | `var(--color-glass-combo)` |
| District name text | `var(--color-text-primary)` (bold) |
| Progress bar fill | `var(--color-rpg-accent)` |
| Task list item text | `var(--color-text-secondary)` |
| Entrance animation | `fadeSlideUp` (0.35s ease) |

**Content regions:** District name (hero), progress bar with fraction label, task checklist, back navigation link.

---

### UnlockBurstAnimation

Full-screen overlay on district unlock. One-shot, no loop. Pattern mirrors Module 3's UnlockAnimation.

| Property | Token / Value |
|----------|---------------|
| Background | `rgba(0, 0, 0, 0.6)` |
| Card | Centered ComboCard |
| Animation | Scale-bounce (0→1.08→1.0, 400ms) + radial amber glow (600ms) |
| Glow color | `var(--color-rpg-accent-glow)` |
| Reduced motion | Opacity fade only |

**CSS keyframes:**

```css
@keyframes rpgUnlockBounce {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes rpgGlowBurst {
  0%   { box-shadow: 0 0 0 0 var(--color-rpg-accent-glow); }
  100% { box-shadow: 0 0 0 30px transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .rpg-unlock-animation { animation: fadeIn 0.3s ease-out; }
}
```

**Content:** celebratory emoji, district name, "已完成！" message.
**Behavior:** Auto-closes after animation completes (~1s) or on tap.

---
