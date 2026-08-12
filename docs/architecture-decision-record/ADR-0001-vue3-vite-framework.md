# ADR-0001: Vue 3 + Vite as frontend framework

**Status:** Accepted

**Decision Date:** 2026-08-11

## Context

The team has no prior frontend experience and is operating under a strict hackathon timeline that requires fast developer onboarding. An existing prototype built in pure HTML/CSS/JavaScript demonstrates the product flow but lacks structure for scaling to production-grade Module 1 implementation.

The primary constraint is learning curve: every hour spent understanding tooling is time lost building game features. The secondary constraint is deployment simplicity—the app must run in a browser with minimal setup friction.

## Decision

Adopt **Vue 3 + Vite** as the frontend framework and build toolchain.

- **Vue 3** provides component-based architecture with a template syntax that closely mirrors HTML, making it immediately intuitive for developers coming from plain HTML.
- **Vite** eliminates configuration complexity—dev server is instant, HMR is built-in, and production builds are optimized without manual tweaking.
- **Vue Router** for client-side navigation between Module 1 game screens.
- **Pinia** (Vue's official state management; see ADR-0002) for game state.
- **TypeScript** for type safety as the codebase grows.

## Alternatives Considered

### React + Vite
- **Why rejected:** React's JSX syntax and hooks model add conceptual overhead for beginners. JSX is not HTML-like; it requires understanding JavaScript expressions inside markup. Hooks (useState, useEffect) are powerful but demand mental overhead around dependency arrays and closure semantics.
- **Why not React Native:** React Native is not a natural fit if a mobile app is needed later. Vue has Ionic/Capacitor, making web-first development the smarter path.

### Next.js
- **Why rejected:** Overkill for a static game demo. Next.js introduces server-side rendering, API routes, and deployment assumptions that are unnecessary for a purely client-side game. Adds setup and learning complexity.

### Keep HTML/CSS/JS with hand-rolled module system
- **Why rejected:** No type safety, harder to test, and refactoring becomes brittle as state management gets complex.

## Consequences

- **Ecosystem locked in:** All tooling choices downstream (state management, routing, persistence) are tied to Vue 3 conventions. Switching off Vue in the future would require a rewrite.
- **React Native deferred:** If mobile app is needed post-hackathon, the path is Ionic/Capacitor wrapping the Vue web app, not native React Native.
- **Build step required:** The app now requires npm/yarn and a build step. Dev server is still instant, but CI/CD must run `vite build`.
- **Pinia is foundational:** See ADR-0002 for state management specifics.

## Implementation Notes

- App lives in `metro-play-vue/` directory, separate from the existing HTML prototype (kept for fallback / demo reference).
- Entry point: `src/main.ts`
- Router config: `src/router/index.ts`
- Store config: `src/stores/offPeak.ts` (Pinia, see ADR-0002)
- Styles use Tailwind CSS or CSS modules (decision deferred to component-level ADR).

## References

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) (ADR-0002)
