<template>
  <div class="tier-shield-card">
    <div class="tier-badge">
      <span class="tier-emoji">{{ tierEmoji }}</span>
      <div class="tier-info">
        <p class="tier-name">{{ tierName }}</p>
        <span class="multiplier-badge">{{ store.multiplier.toFixed(1) }}x 加成</span>
      </div>
    </div>

    <div class="exp-bar-section">
      <div
        class="exp-bar-track"
        role="progressbar"
        :aria-valuenow="store.progress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="exp-bar-fill" :style="{ width: `${store.progress}%` }" />
      </div>
      <p class="exp-label">
        {{ store.nextTierThreshold === null ? "滿級 👑" : `${store.progress}% → 下一等級` }}
      </p>
    </div>

    <p class="cumulative-pts">累積 {{ store.cumulativePoints }} 捷點</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";

const store = useLoyaltyTierStore();

const TIER_META: Record<string, { emoji: string; name: string }> = {
  Bronze: { emoji: "🥉", name: "青銅" },
  Silver: { emoji: "🥈", name: "白銀" },
  Gold: { emoji: "🏆", name: "黃金" },
  Platinum: { emoji: "👑", name: "鉑金" },
};

// biome-ignore lint/correctness/noUnusedVariables: used in template
const tierEmoji = computed(() => TIER_META[store.currentTier.name]?.emoji ?? "🥉");
// biome-ignore lint/correctness/noUnusedVariables: used in template
const tierName = computed(() => TIER_META[store.currentTier.name]?.name ?? store.currentTier.name);
</script>

<style scoped>
.tier-shield-card {
  padding: var(--spacing-xl);
  background: var(--color-glass-combo);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-tier-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeSlideUp var(--duration-slow) var(--timing-ease-out);
}

.tier-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.tier-emoji {
  font-size: 48px;
  line-height: 1;
}

.tier-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tier-name {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-black);
  color: var(--color-text-primary);
  margin: 0;
}

.multiplier-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-tier-accent-dim);
  border: 1px solid var(--color-tier-accent-border);
  border-radius: var(--radius-pill);
  color: var(--color-tier-accent);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.exp-bar-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.exp-bar-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background: var(--color-tier-accent);
  border-radius: var(--radius-pill);
  transition: width 0.4s var(--timing-ease-out);
}

.exp-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.cumulative-pts {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
