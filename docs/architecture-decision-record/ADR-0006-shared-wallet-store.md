# ADR-0006: Extract shared wallet store for multi-module point balance

**Status:** Accepted

**Decision Date:** 2026-08-14

## Context

Module 1 (Off-Peak Prediction) currently owns the user's point balance inside `src/stores/offPeak.ts`. Module 2 (Blind Box Travel) also needs to deduct and credit points for box purchases, re-rolls, and reward claims. Duplicating balance state across two Pinia stores would create synchronization bugs and violate single-source-of-truth. The app is a hackathon prototype; the solution must be minimal — no event bus, no backend sync, no shared database.

## Decision

Extract a new `useWalletStore` (Pinia) in `src/stores/wallet.ts`.

- **State:** `balance: number` (initial 500).
- **Actions:**
  - `deduct(amount: number)` — throws if insufficient balance
  - `credit(amount: number)`
- **Refactoring:** Update `offPeak.ts` to import `useWalletStore` and delegate all balance reads (`wallet.balance`) and writes (`wallet.deduct()`, `wallet.credit()`) to it. Remove the `balance` field from offPeak state.
- **Module 2 integration:** The new `blindBox.ts` store similarly imports `useWalletStore` for all point transactions.
- **Sibling dependency:** Both module stores treat the wallet as a sibling dependency, not a parent. No store nesting or inheritance.

## Alternatives Considered

### 1. Keep balance in offPeak, let blindBox call offPeak.deduct()
- **Why rejected:** Creates semantic coupling where Module 2 depends on Module 1's store for a cross-cutting concern. This makes Module 1 a de-facto platform store, violating module isolation. Not acceptable as the architecture scales.

### 2. Global reactive ref (not Pinia)
- **Why rejected:** Lighter weight but loses Pinia devtools integration and persistence plugin compatibility. The app already commits to Pinia as the state primitive; introducing a parallel pattern adds cognitive overhead for no benefit at this scale.

### 3. Composition API composable (useBalance())
- **Why rejected:** Would work but Pinia stores are already the established state primitive. A parallel composable state pattern adds cognitive overhead without benefit. Keep the state abstraction uniform.

## Consequences

- **Breaking change in prototype:** `offPeak.ts` loses its `balance` field. Any component reading `offPeakStore.balance` must switch to `walletStore.balance`. This is a breaking change within the prototype but necessary for correctness.
- **Future module scalability:** Module 3 and beyond can import `useWalletStore` without touching existing module stores. Wallet becomes the established cross-module state boundary.
- **Intentional thinness:** The wallet store holds balance only. If additional shared state emerges later (e.g., transaction history, spend limits), evaluate whether to widen the wallet store or create a separate sibling store. Do not pre-build.

## Implementation Notes

### Wallet Store (`src/stores/wallet.ts`)
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(500)

  function deduct(amount: number) {
    if (balance.value < amount) {
      throw new Error(`Insufficient balance. Have ${balance.value}, need ${amount}.`)
    }
    balance.value -= amount
  }

  function credit(amount: number) {
    balance.value += amount
  }

  return { balance, deduct, credit }
})
```

### Refactored offPeak Store
Remove `balance` field. Replace all balance mutations with `walletStore.deduct()` and `walletStore.credit()`.

### Refactored blindBox Store
Import and use `useWalletStore` for all point transactions (box purchases, re-rolls, rewards).

## References

- `docs/product-requirement-document/metro-blind-box-travel/implement-detail.md` sections 2 and 3
- ADR-0002: Pinia for state management (foundational Pinia conventions)
