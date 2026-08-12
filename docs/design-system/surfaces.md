# Surface & Navigation Inventory — metro-off-peak-prediction

Complete inventory of all screens, surfaces, and navigation patterns for the metro-off-peak-prediction design system.

---

## Global Navigation Model

**Navigation pattern:** Fixed top tab bar with 4 tabs, always sticky.

| Property | Value |
|----------|-------|
| Position | `position: sticky; top: 0;` |
| Background | `var(--color-tab-bg)` with `backdrop-filter: blur(20px)` |
| Height | ~56px (48px content + padding) |
| Tabs | 4 total |
| Active indicator | Gold (`var(--color-gold)`) underline (2–3px) + gold text |
| Inactive state | `var(--color-text-muted)` text, no underline |
| Transition | 0.2s color transition on tab switch |

**Tabs:**
1. **⚔️ 離峰大作戰** — Module 1 Home (always accessible, no auth required initially)
2. **🎁 盲盒旅行** — Module 2 Mystery Box Travel (out of scope for PRD v1)
3. **👑 夢幻特權** — Module 3 Dream Privileges (out of scope for PRD v1)
4. **🗺️ 城市RPG** — Module 4 City RPG (out of scope for PRD v1)

---

## Surface Inventory

### Module 1 — 離峰大作戰 (Off-Peak Prediction Game)

#### **P1-1: Module 1 Home Screen**

**Trigger:** App load, tab 1 active (`⚔️ 離峰大作戰`)

| Property | Value |
|----------|-------|
| **Kind** | Primary screen |
| **Tab** | ⚔️ 離峰大作戰 |
| **Auth required** | None (public) |
| **Content sections** | Peak forecast, off-peak window, Game A+B entry, combo preview, carbon fund |
| **Primary CTA** | Mission A (gold) and Mission B (purple) entry buttons |
| **Background** | Fixed diagonal gradient (#0070BD → #00A86B) |
| **Components** | GlassCards, MissionBadges, PtsBadge, LevelBadge, CTAButton (gold/purple), EXPBar (carbon), FloatingParticles |

**Key cards:**
- **Point Balance strip:** Hero header with `💰 X,XXX pts` (PtsBadge) + Level badge
- **Forecast Card:** Today's peak/off-peak times, visual indicator
- **Game A Card:** Mission A intro, "Commit to reduce" CTA
- **Game B Card:** Mission B intro, "Predict ridership" CTA
- **Combo Preview Card:** Shows how Game A + B multiplier works
- **Carbon Fund Card:** Progress bar (EXPBar) showing points toward carbon offset

**Navigation:**
- Tab 1 always active
- CTA buttons lead to P1-2a (Mission A) or P1-2b (Mission B)
- Logged-in users see full interface; unauthenticated users see preview with login prompt

---

#### **P1-2a: Game A — Commitment Pledge Screen**

**Trigger:** User taps "Play Mission A" CTA on Module 1 Home

| Property | Value |
|----------|-------|
| **Kind** | Game screen (commitment flow) |
| **Tab** | ⚔️ 離峰大作戰 (tab 1 active) |
| **Auth required** | Logged in |
| **Content sections** | Pledge mission intro, stake selector, off-peak window highlight, commitment deadline, submit CTA |
| **Primary CTA** | Submit Pledge (gold gradient button) |
| **Back navigation** | Back arrow or "Cancel" to Module 1 Home |
| **Components** | ComboCard (mission intro), GlassCard (stake options), GlassCard (countdown timer), CTAButton (gold) |

**Key cards:**
- **Mission Header:** Mission A title, gold badge, gamification framing
- **Stake Selector:** Radio buttons or segmented control for pledge amount (GlassCard container)
- **Off-peak Window:** Shows exact hours when off-peak applies (e.g., "22:00–06:00")
- **Commitment Deadline:** Countdown to gate closure (visual timer)
- **Submit Button:** Gold gradient CTA, full-width

**Behavior:**
- Submit triggers gate simulation
- Success/failure determined by backend
- Navigation to P1-3 (Settlement Overlay)

---

#### **P1-2b: Game B — Ridership Prediction Screen**

**Trigger:** User taps "Play Mission B" CTA on Module 1 Home

| Property | Value |
|----------|-------|
| **Kind** | Game screen (prediction flow) |
| **Tab** | ⚔️ 離峰大作戰 (tab 1 active) |
| **Auth required** | Logged in |
| **Content sections** | Prediction mission intro, ridership slider, reference forecast data, submit CTA |
| **Primary CTA** | Submit Prediction (purple gradient button) |
| **Back navigation** | Back arrow or "Cancel" to Module 1 Home |
| **Components** | ComboCard (mission intro), GlassCard (slider container), GlassCard (reference data), CTAButton (purple) |

**Key cards:**
- **Mission Header:** Mission B title, purple badge, gamification framing
- **Ridership Slider:** Range slider to enter predicted passenger count (GlassCard container)
- **Reference Data:** Historical average, today's forecast, confidence range (GlassCard)
- **Time Window:** Specifies which off-peak slot prediction applies to
- **Submit Button:** Purple gradient CTA, full-width

**Behavior:**
- Submit triggers prediction evaluation
- Backend compares prediction to actual or forecast
- Navigation to P1-3 (Settlement Overlay)

---

#### **P1-3: Settlement Overlay**

**Trigger:** Auto-displayed after user submits P1-2a or P1-2b

| Property | Value |
|----------|-------|
| **Kind** | Full-screen overlay, modal |
| **Tab** | None (overlays tab bar) |
| **Auth required** | Logged in |
| **Content sections** | Result animation, reward/forfeit display, breakdown, continue CTA |
| **Primary CTA** | "Continue" or "OK" button (gold) |
| **Background** | Darkened backdrop (semi-transparent dark overlay) |
| **Components** | ComboCard (result card), RewardBadges, AnimatedCounter (for points), CTAButton (gold) |

**Key card:**
- **Result Announcement:** Large text + animation showing "Win!" or "Forfeit" with emoji/effect
- **Reward Display:** Points earned/lost, breakdown by mission type (A points + B points ± multiplier)
- **Reward Badges:** Show reward type (gold, combo multiplier, etc.)
- **Bonus info:** If applicable, show combo multiplier applied
- **Continue Button:** Gold CTA, closes overlay and returns to Module 1 Home

**Behavior:**
- Animated result (entrance + scale animation)
- Dismissible by tap/click outside (optional) or button
- Auto-closes after 3–5 seconds (optional, designer discretion)

---

### Point Balance Strip (Persistent Component)

**Display:** Hero header area of Module 1 Home, always visible when logged in

| Property | Value |
|----------|-------|
| **Components** | PtsBadge (`💰 X,XXX pts`), LevelBadge |
| **Position** | Top-left/center, under tab bar, above main cards |
| **Background** | Part of gradient page background; may use faint GlassCard for emphasis |
| **Updates** | Real-time on reward/forfeit |

**Never hidden** — shows current game progress at all times.

---

### Floating Particles (Global Decorative)

**Display:** Behind all content, on every screen within Module 1

| Property | Value |
|----------|-------|
| **Elements** | 3 emoji: ✨ ⭐ 💫 |
| **Position** | `position: fixed`, viewport-relative |
| **Animation** | Float from bottom to top over 6s, staggered 2s |
| **Pointer events** | `pointer-events: none` (does not block clicks) |

**Purpose:** Ambient gamification aesthetic.

---

## Out-of-Scope Surfaces (For Future Sprints)

| Surface | Module | Tab | Status |
|---------|--------|-----|--------|
| 盲盒旅行 (Mystery Box) | Module 2 | 🎁 | Design TBD |
| 夢幻特權 (Dream Privileges) | Module 3 | 👑 | Design TBD |
| 城市RPG (City RPG) | Module 4 | 🗺️ | Design TBD |

---

## Navigation Flow Diagram

```
App loads
  ↓
Module 1 Home (P1-1)
├─ Point Balance + Level visible
├─ Forecast card displayed
├─ Mission A CTA ──→ P1-2a (Commitment)
│                      ↓
│                   Submit ──→ P1-3 (Settlement Overlay)
│                                    ↓
│                            Continue ──→ back to P1-1
│
└─ Mission B CTA ──→ P1-2b (Prediction)
                       ↓
                    Submit ──→ P1-3 (Settlement Overlay)
                                    ↓
                            Continue ──→ back to P1-1

[Tabs 2–4 visible but out-of-scope for v1]
```

---

## Component Usage by Surface

### Module 1 Home (P1-1)

| Component | Count | Usage |
|-----------|-------|-------|
| GlassCard | 4–6 | Forecast, Game A intro, Game B intro, Combo, Carbon fund |
| ComboCard | 1 | Combo preview (high-emphasis) |
| MissionBadge | 2 | Mission A (gold) + Mission B (purple) labels |
| CTAButton | 2 | Mission A (gold) + Mission B (purple) entry |
| PtsBadge | 1 | Point balance hero |
| LevelBadge | 1 | User level |
| EXPBar | 1 | Carbon fund progress |
| FloatingParticles | 3 | Background ambiance |

### P1-2a (Commitment)

| Component | Count | Usage |
|-----------|-------|-------|
| ComboCard | 1 | Mission intro |
| GlassCard | 2 | Stake selector, countdown |
| CTAButton | 1 | Submit Pledge (gold) |

### P1-2b (Prediction)

| Component | Count | Usage |
|-----------|-------|-------|
| ComboCard | 1 | Mission intro |
| GlassCard | 2 | Slider, reference data |
| CTAButton | 1 | Submit Prediction (purple) |

### P1-3 (Settlement Overlay)

| Component | Count | Usage |
|-----------|-------|-------|
| ComboCard | 1 | Result card |
| RewardBadge | 2–3 | Reward type labels |
| CTAButton | 1 | Continue (gold) |

---

## Responsive Behavior

**Mobile-first design (375px max-width centered):**

- All cards stack vertically
- Horizontal padding: 14px (page margins)
- Card gap: 12px
- CTA buttons: full-width
- Tab bar: fixed at top, never hidden
- Overlay: covers full viewport, centered card inside

**No native app:** Web-only, responsive to mobile viewport.

---

## Key Principles

1. **Tab bar always visible** — users can switch modules anytime
2. **Mission entry is always a CTA** — never direct navigation via tab
3. **Settlement overlay is modal** — blocks other interaction until dismissed
4. **Point balance is always visible** — shows live game progress
5. **Floating particles are decorative** — never block interaction
6. **No looping animations on cards** — only entrance + CTAs
7. **Glass + gradient background** — creates cohesive, gamified aesthetic

---

## Design System References

- See **[overview.md](./overview.md)** for visual language
- See **[tokens.md](./tokens.md)** for all CSS custom properties
- See **[components.md](./components.md)** for component specifications
- See **[accessibility.md](./accessibility.md)** for contrast and touch target guidance
- See **[samples/](./samples/)** for reference implementation
