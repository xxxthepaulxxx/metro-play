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
