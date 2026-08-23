<template>
  <div class="current-perks-card">
    <p class="card-title">當前特權</p>
    <ul class="perks-list">
      <li class="perk-item">
        <span class="perk-icon">⚡</span>
        <span class="perk-label">捷點加成 {{ store.multiplier.toFixed(1) }}x</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";

const store = useLoyaltyTierStore();
</script>

<style scoped>
.current-perks-card {
  padding: var(--spacing-lg);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-tier-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.card-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-tier-accent);
  margin: 0;
}

.perks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.perk-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.perk-icon {
  font-size: var(--font-size-body);
}

.perk-label {
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
</style>
