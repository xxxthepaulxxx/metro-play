<template>
  <div class="combo-bonus">
    <p class="combo-title">🏆 雙重大獎！</p>
    <div class="combo-lines">
      <div class="combo-row">
        <span class="combo-label">承諾獎勵</span>
        <span class="combo-value">+{{ pledgeReward }} 捷點</span>
      </div>
      <div class="combo-row">
        <span class="combo-label">猜猜樂獎勵</span>
        <span class="combo-value">+{{ guessReward }} 捷點</span>
      </div>
      <div v-if="comboBonus > 0" class="combo-row bonus-row">
        <span class="combo-label">雙重加成</span>
        <span class="combo-value">+{{ comboBonus }} 捷點</span>
      </div>
      <div class="combo-row total-row">
        <span class="combo-label">合計</span>
        <span class="combo-value total-value">+{{ totalReward }} 捷點</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  pledgeReward: number;
  guessReward: number;
  totalReward: number;
}>();

// biome-ignore lint/correctness/noUnusedVariables: used in template
const comboBonus = computed(() => props.totalReward - props.pledgeReward - props.guessReward);
</script>

<style scoped>
.combo-bonus {
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid #7c3aed;
  border-radius: var(--radius-card);
}

.combo-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: #7c3aed;
  margin: 0 0 var(--spacing-sm);
  text-align: center;
}

.combo-lines {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.combo-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-body);
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid rgba(124, 58, 237, 0.2);
}

.combo-row:last-child {
  border-bottom: none;
}

.combo-label {
  color: var(--color-text-muted);
}

.combo-value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.bonus-row .combo-value {
  color: #7c3aed;
}

.total-row {
  padding-top: var(--spacing-sm);
}

.total-value {
  color: var(--color-gold);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-section);
}
</style>
