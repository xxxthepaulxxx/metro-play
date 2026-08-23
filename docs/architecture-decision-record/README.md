# Architecture Decision Records (ADRs)

This directory contains architecture decisions for the **metro-off-peak-prediction** project (Metro Go Pass Module 1 — Off-Peak Prediction Game).

## Decision Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-0001](./ADR-0001-vue3-vite-framework.md) | Vue 3 + Vite as frontend framework | Accepted |
| [ADR-0002](./ADR-0002-pinia-state-management.md) | Pinia for state management | Accepted |
| [ADR-0003](./ADR-0003-mock-async-api.md) | Mock async API over real backend | Accepted |
| [ADR-0004](./ADR-0004-localstorage-persistence.md) | localStorage for client-side persistence | Accepted |
| [ADR-0005](./ADR-0005-rule-based-prediction-model.md) | Rule-based prediction model for off-peak window | Accepted |
| [ADR-0006](./ADR-0006-shared-wallet-store.md) | Extract shared wallet store for multi-module point balance | Accepted |
| [ADR-0007](./ADR-0007-derived-district-state.md) | Derived district state from visited-station set | Accepted |*

*Module 3 (Loyalty Tier) follows the same cross-store sibling dependency pattern: `loyaltyTierStore` imports `useWalletStore` for multiplier-adjusted point rewards.

## How to Use This Directory

1. **Reviewing a decision?** Start with the Status. All decisions here are **Accepted** — they are in active use.
2. **Understanding rationale?** Read the "Context" and "Decision" sections.
3. **Considering an alternative?** Check "Alternatives Considered" to see what was already debated.
4. **Worried about consequences?** See "Consequences" for tradeoffs.

## ADR Format

Each ADR follows this template:

```markdown
# ADR-NNNN: Short title

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]
**Decision Date:** YYYY-MM-DD

## Context
[Problem statement and constraints]

## Decision
[The decision made and why]

## Alternatives Considered
[What else was considered and why it was rejected]

## Consequences
[Positive and negative outcomes]

## Implementation Notes
[Code examples, file structure, etc.]

## References
[Links to docs, other ADRs, external resources]
```

## Related Documentation

- **Product Requirement Document:** `docs/product-requirement-document/metro-off-peak-prediction/requirement.md`
- **Design System:** `docs/design-system/`
- **Stack Overview:** `docs/stack.yaml`
- **Architecture Diagrams (C4):** `docs/architecture/`

## Decision Themes

### Frontend Stack (ADR-0001)
Vue 3 + Vite was chosen for rapid developer onboarding in a hackathon setting. Low learning curve, no configuration overhead.

### State Management (ADR-0002)
Pinia provides structured state for the game (pledge, prediction, settlement, balance, carbon pool). Type-safe, testable, and familiar migration path from the prototype's hand-rolled store.

### Mock Data & APIs (ADR-0003, ADR-0005)
All "backend" operations are simulated locally. No real API integration in the demo. This ensures offline-capability, determinism, and zero risk of demo failure due to network issues. Future production integration will swap the mock layer with real endpoints.

### Persistence (ADR-0004)
Browser localStorage preserves game state across refreshes, enabling judges to walk away and return to the demo mid-play.

## Planned Follow-ups

After the hackathon, expect:
- **Real backend integration:** ADR-0003 mock API swapped for real REST endpoints.
- **Authentication:** New ADR for session/token management.
- **Mobile app:** Ionic/Capacitor wrapper around the Vue app (not React Native).
- **ML model:** If predictive off-peak forecasting is desired, a new ADR for the ML pipeline.
