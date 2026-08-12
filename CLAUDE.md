# CLAUDE.md — metro-off-peak-prediction Worktree

## Product Context

**Project:** 捷點生活 Metro Go Pass — hackathon prototype
**Active module:** Module 1 — 離峰減碳大作戰 (Off-Peak Prediction Game)
**PRD:** docs/product-requirement-document/metro-off-peak-prediction/requirement.md
**Stack:** Pure HTML/CSS/JS, no build toolchain, single-page prototype
**Demo target:** Hackathon judges; full flow walkable in <3 min

## Design Taste

**Direction:** Gamified RPG adventure — not corporate MRT, not pure fintech. Feels like opening a game.
**Background:** Fixed diagonal gradient #0070BD → #00A86B. Never solid white or dark.
**Cards:** Glassmorphism — rgba(255,255,255,0.15) + blur(12px). Combo card uses dark inner for contrast.
**Accent:** Gold (#FFB300) for rewards/points. Purple (#7C3AED) for prediction. Green (#00A86B) for off-peak/carbon.
**Motion:** Entrance-only animations (fadeSlideUp staggered). No looping glow on content. Particles are decorative.
**Typography:** System fonts only. Bold/heavy weights for titles. Never custom typefaces.
**Winner sample:** docs/design-system/samples/index.html (variant-c — Metro Adventurer direction)

## Architecture Context

**Stack:** Vue 3 + Vite + Pinia + Vue Router (TypeScript)
**App root:** `metro-play-vue/` (separate from existing HTML prototype)
**State:** `src/stores/offPeak.ts` — Pinia store for all Module 1 game state
**Mock API:** `src/api/mockApi.ts` — async functions, no real network calls
**ADRs:** docs/architecture-decision-record/ADR-0001 through ADR-0005
**C4:** docs/architecture/c4-system-context.puml, c4-container.puml
