# Design System Overview — metro-off-peak-prediction

## Personality & Direction

**Gamified adventure app** — playful, competitive, reward-driven. RPG mission-card aesthetic layered on Taipei MRT brand identity. Approachable enough for first-time judges, exciting enough to feel like a game.

This is not a corporate MRT app. It feels like opening a game.

---

## Visual Language

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-gradient-start` | `#0070BD` | Background gradient start (top-left), MRT blue |
| `--color-bg-gradient-end` | `#00A86B` | Background gradient end (bottom-right), off-peak green |
| `--color-gold` | `#FFB300` | Points, rewards, Mission A, active tab underline, level badge |
| `--color-gold-dark` | `#FF8C00` | Gold gradient end, CTA button gradient |
| `--color-purple` | `#7C3AED` | Mission B badge and CTA |
| `--color-purple-dark` | `#4F46E5` | Purple CTA gradient end |
| `--color-glass-card` | `rgba(255,255,255,0.15)` | Standard glassmorphism card background |
| `--color-glass-combo` | `rgba(0,20,40,0.55)` | Combo card inner — dark for gold text contrast |
| `--color-glass-border` | `rgba(255,255,255,0.3)` | Card border |
| `--color-tab-bg` | `rgba(0,0,0,0.3)` | Tab bar backdrop |
| `--color-text-primary` | `#FFFFFF` | Primary text on glass cards |
| `--color-text-secondary` | `rgba(255,255,255,0.8)` | Secondary/subtitle text |
| `--color-text-muted` | `rgba(255,255,255,0.6)` | Muted labels, tab inactive |

**Background:** Fixed diagonal gradient from `#0070BD` (top-left) to `#00A86B` (bottom-right). Never solid white or dark.

---

### Typography

| Element | Size | Weight | Font Family |
|---------|------|--------|-------------|
| Title (hero) | 28px | 900 | `system-ui, -apple-system, 'Segoe UI', sans-serif` |
| Section title | 20px | 900 | Same |
| Body / subtitle | 13px | 400–500 | Same |
| Badge / label | 11–12px | 700–800 | Same |
| CTA button | 13px | 800 | Same |

**Font family:** System fonts only — `system-ui, -apple-system, 'Segoe UI', sans-serif`. No custom typefaces.

---

### Spatial Rhythm

All spacing built on a 4px base unit:

| Element | Value |
|---------|-------|
| Base unit | 4px |
| Card padding | 16px |
| Card gap | 12px |
| Page horizontal padding | 14px |
| Border-radius (card) | 16px |
| Border-radius (pill/badge) | 20–24px |
| Border-radius (CTA button) | 24px |

---

### Motion & Animation

**Entrance animation:**
- Animation name: `fadeSlideUp`
- Properties: `opacity 0→1`, `translateY 14px→0`
- Duration: 0.35s `ease` timing
- Stagger: 50ms per card

**Interactive animation:**
- CTA button press: `scale(0.96)` on `:active`
- Duration: 0.15s
- Tab underline color transition: 0.2s

**Decorative floating particles:**
- 3 emoji particles: `✨ ⭐ 💫`
- Animation: float from bottom to top
- Duration: 6s cycle, staggered 2s each
- Positioning: `position: fixed`, `pointer-events: none`
- Purpose: Purely decorative, does not interfere with interactions

**Important:** No looping glow or shimmer animations on content cards. Motion is reserved for entrance and interaction only.

---

### Platform & Responsive Design

**Platform:** Mobile web first, 375px max-width centered. No native app.

Designed primarily for mobile phones with considerations for accessibility and readability on small screens.

---

---

## Module 3 — 夢幻特權 (Dream Privilege / Metro Loyalty Tier)

**Accent color:** Rose (#E91E63) — used for tier badges, shield glow, EXP bar fill, unlock animation

**Visual approach:** Aspirational achievement — feels like unlocking a VIP status, not a corporate loyalty card. Warm prestige.

**Brand personality:** The loyalty tier system uses rose accents to signal "exclusive achievement / earned status." The tier shield hero card (dark glassmorphism, ComboCard style) displays the rider's current tier with an EXP bar filled in rose. Tier-up triggers a one-shot unlock animation: scale-bounce (400ms) + rose glow pulse (600ms).

**Token set:** Rose (#E91E63) drives all tier-specific accents. Analogous to Module 2's teal tokens:
- `--color-tier-accent: #E91E63`
- `--color-tier-accent-dim: rgba(233, 30, 99, 0.12)`
- `--color-tier-accent-border: rgba(233, 30, 99, 0.35)`
- `--color-tier-accent-glow: rgba(233, 30, 99, 0.5)`

**Components:** TierShieldCard (hero, dark glass with shield icon and rose EXP bar), CurrentPerksCard (glass with solid rose border), NextTierCard (glass with dashed dim border, locked state), UnlockAnimation (one-shot fullscreen overlay).

**Motion posture:** One-shot unlock animation only (scale-bounce 400ms + rose glow pulse 600ms). No looping content animations. `prefers-reduced-motion` respected: reduce to opacity fade.

---

## Module 4 — 城市RPG (City RPG Unlock)

**Accent color:** Amber (#FF8F00) — used for district borders, unlock glow, progress bar fill, unlock animation burst

**Visual approach:** Collectible map exploration — feels like uncovering a city one district at a time. Warm amber evokes treasure discovery and earned mastery.

**Brand personality:** The city RPG uses amber accents to signal "exploration achievement / territory claimed." Districts appear as DistrictCards in a vertical scrolling list on `/rpg`. Locked districts show a dashed amber border and lock icon; unlocked districts show a solid amber border, checkmark badge, and filled progress bar. Unlocking triggers a one-shot animation: scale-bounce (0 to 1.08 to 1.0, 400ms) + radial amber glow expanding outward (600ms).

**Token set:** Amber (#FF8F00) drives all RPG-specific accents. Analogous to Module 3's rose tokens:
- `--color-rpg-accent: #FF8F00`
- `--color-rpg-accent-dim: rgba(255, 143, 0, 0.12)`
- `--color-rpg-accent-border: rgba(255, 143, 0, 0.35)`
- `--color-rpg-accent-glow: rgba(255, 143, 0, 0.5)`

**Components:** DistrictCard (locked/unlocked states), DistrictDetailCard (detail view hero), UnlockBurstAnimation (one-shot fullscreen overlay on district unlock).

**Motion posture:** One-shot unlock animation only (scale-bounce 400ms + amber glow burst 600ms). No looping content animations. `prefers-reduced-motion` respected: reduce to opacity fade.

---

## Next Steps

- See **[tokens.md](./tokens.md)** for complete CSS custom property definitions
- See **[components.md](./components.md)** for component inventory with token references
- See **[accessibility.md](./accessibility.md)** for contrast ratios and touch target guidance
- See **[surfaces.md](./surfaces.md)** for the full surface and navigation inventory
- See **[samples/](./samples/)** for reference implementations
