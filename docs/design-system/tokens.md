# Design Tokens — metro-off-peak-prediction

All design tokens for the metro-off-peak-prediction design system. These CSS custom properties define the complete visual language.

---

## Color Tokens

### Background & Gradient

```css
--color-bg-gradient-start: #0070BD;  /* MRT blue, gradient start (top-left) */
--color-bg-gradient-end: #00A86B;    /* Off-peak green, gradient end (bottom-right) */
```

**Usage:** Fixed page background as diagonal linear gradient.

---

### Accent Colors

```css
--color-gold: #FFB300;              /* Rewards, points, Mission A, active tab */
--color-gold-dark: #FF8C00;         /* Gold gradient end, button gradient */
--color-purple: #7C3AED;            /* Mission B badge, purple CTA */
--color-purple-dark: #4F46E5;       /* Purple gradient end */
```

**Usage:**
- Gold: Primary reward accent, active states, level badges
- Gold-dark: Gradient pairs for buttons and highlights
- Purple: Secondary accent for Mission B, alternative CTAs
- Purple-dark: Gradient pairs

---

### Glass & Surface

```css
--color-glass-card: rgba(255, 255, 255, 0.15);    /* Standard card bg */
--color-glass-combo: rgba(0, 20, 40, 0.55);       /* Combo card inner — dark for contrast */
--color-glass-border: rgba(255, 255, 255, 0.3);   /* Card border */
--color-tab-bg: rgba(0, 0, 0, 0.3);               /* Tab bar backdrop */
```

**Usage:**
- `--color-glass-card`: Primary card backgrounds with `backdrop-filter: blur(12px)`
- `--color-glass-combo`: Inner background for combo cards — ensures gold text contrast
- `--color-glass-border`: 1px borders on glassmorphism cards
- `--color-tab-bg`: Tab bar background, supports `backdrop-filter: blur(20px)`

---

### Text Colors

```css
--color-text-primary: #FFFFFF;                   /* Primary text on cards */
--color-text-secondary: rgba(255, 255, 255, 0.8);  /* Subtitle, secondary info */
--color-text-muted: rgba(255, 255, 255, 0.6);      /* Labels, inactive states */
```

**Usage:**
- `--color-text-primary`: Headings, main content text
- `--color-text-secondary`: Subtitles, descriptive text
- `--color-text-muted`: Labels, disabled text, tab inactive

---

## Spacing Tokens

```css
--spacing-base: 4px;              /* Base unit */
--spacing-xs: 4px;                /* 1x base */
--spacing-sm: 8px;                /* 2x base */
--spacing-md: 12px;               /* 3x base */
--spacing-lg: 16px;               /* 4x base */
--spacing-xl: 20px;               /* 5x base */
--spacing-2xl: 24px;              /* 6x base */
```

**Usage:**
- Card padding: `--spacing-lg` (16px)
- Card gap: `--spacing-md` (12px)
- Page horizontal padding: `--spacing-sm` + 6px = 14px
- Border-radius (card): 16px
- Border-radius (pill): 20–24px
- Border-radius (button): 24px

---

## Typography Tokens

### Font Family

```css
--font-system: system-ui, -apple-system, 'Segoe UI', sans-serif;
```

**Usage:** All text elements. No custom typefaces.

---

### Font Size & Weight

```css
--font-size-xs: 11px;      /* Badge, label */
--font-size-sm: 12px;      /* Badge, label */
--font-size-body: 13px;    /* Body text, button */
--font-size-subtitle: 13px;  /* Subtitle */
--font-size-section: 20px; /* Section title */
--font-size-hero: 28px;    /* Hero title */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
--font-weight-extra-bold: 800;
--font-weight-black: 900;
```

**Recommended combinations:**
- Title (hero): 28px / 900
- Section title: 20px / 900
- Body / subtitle: 13px / 400–500
- Badge / label: 11–12px / 700–800
- CTA button: 13px / 800

---

## Motion Tokens

```css
--duration-fast: 0.15s;      /* Interactive (press) */
--duration-normal: 0.2s;     /* Tab underline, transitions */
--duration-slow: 0.35s;      /* Entrance animation */
--duration-float: 6s;        /* Floating particles */

--timing-ease: ease;
--timing-ease-out: ease-out;
```

**Usage:**
- Entrance: `fadeSlideUp` over `--duration-slow` with stagger 50ms
- Button press: `scale(0.96)` over `--duration-fast`
- Tab underline: color transition over `--duration-normal`
- Particles: float cycle over `--duration-float`, staggered 2s each

---

## Border Radius Tokens

```css
--radius-card: 16px;       /* Card corners */
--radius-pill: 20px;       /* Badge pill, smaller */
--radius-button: 24px;     /* CTA button */
```

**Usage:**
- Cards: `--radius-card`
- Badges, pills: `--radius-pill` to `24px`
- Buttons: `--radius-button`

---

## Filter & Backdrop Tokens

```css
--blur-card: blur(12px);   /* Card backdrop filter */
--blur-tab: blur(20px);    /* Tab bar backdrop filter */
```

**Usage:**
- Card glassmorphism: `backdrop-filter: --blur-card`
- Tab bar glassmorphism: `backdrop-filter: --blur-tab`

---

## Complete CSS Custom Properties (Paste-Ready)

```css
:root {
  /* Background & Gradient */
  --color-bg-gradient-start: #0070BD;
  --color-bg-gradient-end: #00A86B;

  /* Accent Colors */
  --color-gold: #FFB300;
  --color-gold-dark: #FF8C00;
  --color-purple: #7C3AED;
  --color-purple-dark: #4F46E5;

  /* Glass & Surface */
  --color-glass-card: rgba(255, 255, 255, 0.15);
  --color-glass-combo: rgba(0, 20, 40, 0.55);
  --color-glass-border: rgba(255, 255, 255, 0.3);
  --color-tab-bg: rgba(0, 0, 0, 0.3);

  /* Text Colors */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.8);
  --color-text-muted: rgba(255, 255, 255, 0.6);

  /* Spacing */
  --spacing-base: 4px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;

  /* Typography */
  --font-system: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-body: 13px;
  --font-size-subtitle: 13px;
  --font-size-section: 20px;
  --font-size-hero: 28px;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 800;
  --font-weight-black: 900;

  /* Motion */
  --duration-fast: 0.15s;
  --duration-normal: 0.2s;
  --duration-slow: 0.35s;
  --duration-float: 6s;

  --timing-ease: ease;
  --timing-ease-out: ease-out;

  /* Radius */
  --radius-card: 16px;
  --radius-pill: 20px;
  --radius-button: 24px;

  /* Filters */
  --blur-card: blur(12px);
  --blur-tab: blur(20px);

  /* Module 2 — 盲盒旅行 (Blind Box Travel) */
  --color-box-accent:        #00BCD4;
  --color-box-accent-dim:    rgba(0, 188, 212, 0.15);
  --color-box-accent-border: rgba(0, 188, 212, 0.4);
  --color-box-glow:          rgba(0, 188, 212, 0.5);
  --duration-box-flip:       600ms;
  --duration-box-shake:      300ms;
  --timing-flip:             cubic-bezier(0.4, 0, 0.2, 1);

  /* Module 3 — 夢幻特權 (Loyalty Tier) */
  --color-tier-accent:        #E91E63;
  --color-tier-accent-dim:    rgba(233, 30, 99, 0.12);
  --color-tier-accent-border: rgba(233, 30, 99, 0.35);
  --color-tier-accent-glow:   rgba(233, 30, 99, 0.5);
  --duration-tier-unlock-bounce: 400ms;
  --duration-tier-glow-pulse:    600ms;

  /* Module 4 — City RPG */
  --color-rpg-accent:        #FF8F00;
  --color-rpg-accent-dim:    rgba(255, 143, 0, 0.12);
  --color-rpg-accent-border: rgba(255, 143, 0, 0.35);
  --color-rpg-accent-glow:   rgba(255, 143, 0, 0.5);
  --duration-rpg-unlock-bounce: 400ms;
  --duration-rpg-glow-burst:    600ms;
}
```

---

## Module 2 — 盲盒旅行 (Blind Box Travel)

```css
/* ===== Module 2 — 盲盒旅行 (Blind Box Travel) ===== */

/* Accent palette — teal for mystery/discovery */
--color-box-accent:        #00BCD4;
--color-box-accent-dim:    rgba(0, 188, 212, 0.15);
--color-box-accent-border: rgba(0, 188, 212, 0.4);
--color-box-glow:          rgba(0, 188, 212, 0.5);

/* Reveal animation timing */
--duration-box-flip:  600ms;
--duration-box-shake: 300ms;
--timing-flip:        cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Module 3 — 夢幻特權 (Dream Privilege / Loyalty Tier)

```css
/* ===== Module 3 — 夢幻特權 (Loyalty Tier) ===== */

/* Accent palette — rose for achievement/prestige */
--color-tier-accent:        #E91E63;
--color-tier-accent-dim:    rgba(233, 30, 99, 0.12);
--color-tier-accent-border: rgba(233, 30, 99, 0.35);
--color-tier-accent-glow:   rgba(233, 30, 99, 0.5);

/* Unlock animation timing */
--duration-tier-unlock-bounce: 400ms;
--duration-tier-glow-pulse:    600ms;
```

---

## Module 4 — 城市RPG (City RPG Unlock)

```css
/* ===== Module 4 — 城市RPG (City RPG Unlock) ===== */

/* Accent palette — amber for exploration/achievement */
--color-rpg-accent:        #FF8F00;
--color-rpg-accent-dim:    rgba(255, 143, 0, 0.12);
--color-rpg-accent-border: rgba(255, 143, 0, 0.35);
--color-rpg-accent-glow:   rgba(255, 143, 0, 0.5);

/* Unlock animation timing */
--duration-rpg-unlock-bounce: 400ms;
--duration-rpg-glow-burst:    600ms;
```

---

## Implementation Notes

All tokens are designed for use in a pure HTML/CSS/JS environment with no build toolchain. Reference them directly in `<style>` blocks or linked stylesheets.

Example:

```css
.glass-card {
  background-color: var(--color-glass-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  padding: var(--spacing-lg);
  backdrop-filter: var(--blur-card);
  color: var(--color-text-primary);
  font-family: var(--font-system);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-normal);
}
```
