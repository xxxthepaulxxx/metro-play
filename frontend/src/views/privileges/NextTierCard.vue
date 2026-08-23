<template>
  <div class="next-tier-card">
    <p class="card-title">下一等級特權</p>
    <div v-if="nextTier === null" class="max-tier">
      <span class="max-label">已達最高等級</span>
    </div>
    <ul v-else class="perks-list">
      <li class="perk-item locked">
        <span class="perk-icon">🔒</span>
        <span class="perk-label">捷點加成 {{ nextTier.multiplier.toFixed(1) }}x</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";

const TIER_TABLE = [
  { name: "Bronze", threshold: 0, multiplier: 1.0 },
  { name: "Silver", threshold: 200, multiplier: 1.2 },
  { name: "Gold", threshold: 500, multiplier: 1.5 },
  { name: "Platinum", threshold: 1000, multiplier: 2.0 },
] as const;

const store = useLoyaltyTierStore();

// biome-ignore lint/correctness/noUnusedVariables: used in template
const nextTier = computed(() => {
  if (store.nextTierThreshold === null) return null;
  return TIER_TABLE.find((t) => t.threshold === store.nextTierThreshold) ?? null;
});
</script>

<style scoped>
.next-tier-card {
  padding: var(--spacing-lg);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px dashed var(--color-tier-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  opacity: 0.75;
}

.card-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  margin: 0;
}

.max-tier {
  display: flex;
  align-items: center;
}

.max-label {
  font-size: var(--font-size-body);
  color: var(--color-tier-accent);
  font-weight: var(--font-weight-bold);
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
  color: var(--color-text-muted);
}
</style>
