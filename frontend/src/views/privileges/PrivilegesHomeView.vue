<template>
  <div class="privileges-view">
    <header class="page-header">
      <h1 class="page-title">👑 會員等級</h1>
      <span class="balance-badge">{{ wallet.balance }} 點</span>
    </header>

    <TierShieldCard />
  </div>
</template>

<script setup lang="ts">
import { useWalletStore } from "../../stores/wallet";
// biome-ignore lint/correctness/noUnusedImports: used as component in template
import TierShieldCard from "./TierShieldCard.vue";

// biome-ignore lint/correctness/noUnusedVariables: used in template
const wallet = useWalletStore();
</script>

<style scoped>
.privileges-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.balance-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-tier-accent-dim);
  border: 1px solid var(--color-tier-accent-border);
  border-radius: var(--radius-pill);
  color: var(--color-tier-accent);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}
</style>
