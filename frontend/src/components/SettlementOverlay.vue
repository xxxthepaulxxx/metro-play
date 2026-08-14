<template>
  <div v-if="store.settlement.done && !dismissed" class="overlay-backdrop" role="dialog" aria-modal="true">
    <div class="overlay-card">
      <h2 class="overlay-title">🎊 結算結果</h2>

      <!-- Pledge result row -->
      <div v-if="store.pledge.committed" class="result-section">
        <p class="section-label">⚔️ 卡位承諾</p>
        <div class="result-row">
          <span v-if="store.pledge.outcome === 'success'" class="outcome-hit">命中 ✓</span>
          <span v-else class="outcome-miss">未命中 ✗</span>
          <span v-if="store.pledge.outcome === 'success'" class="points-positive">
            +{{ store.settlement.pledgeReward }} 捷點
          </span>
          <span v-else class="points-negative">
            −{{ store.pledge.staked }} 捷點
          </span>
        </div>
      </div>

      <!-- Guess result row -->
      <div v-if="store.prediction.submitted" class="result-section">
        <p class="section-label">🎯 運量猜猜樂</p>
        <div class="result-row">
          <span v-if="store.prediction.outcome === 'correct'" class="outcome-hit">猜對 ✓</span>
          <span v-else class="outcome-miss">猜錯 ✗</span>
          <span v-if="store.settlement.guessReward > 0" class="points-positive">
            +{{ store.settlement.guessReward }} 捷點
          </span>
        </div>
      </div>

      <!-- Combo bonus panel -->
      <ComboBonus
        v-if="store.settlement.combo"
        :pledge-reward="store.settlement.pledgeReward"
        :guess-reward="store.settlement.guessReward"
        :total-reward="store.settlement.totalReward"
      />

      <!-- Total -->
      <div v-if="!store.settlement.combo" class="total-section">
        <span class="total-label">合計獎勵</span>
        <span class="total-value">+{{ store.settlement.totalReward }} 捷點</span>
      </div>

      <button class="dismiss-btn" type="button" @click="dismissed = true">
        確認
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useOffPeakStore } from "../stores/offPeak";
// biome-ignore lint/correctness/noUnusedImports: used in template
import ComboBonus from "./ComboBonus.vue";

// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const store = useOffPeakStore();
// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const dismissed = ref(false);
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--spacing-lg);
}

.overlay-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
}

.overlay-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-glass-border);
}

.section-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-body);
}

.outcome-hit {
  color: var(--color-bg-gradient-end);
  font-weight: var(--font-weight-bold);
}

.outcome-miss {
  color: #ff6b6b;
  font-weight: var(--font-weight-bold);
}

.points-positive {
  color: var(--color-gold);
  font-weight: var(--font-weight-bold);
}

.points-negative {
  color: #ff6b6b;
  font-weight: var(--font-weight-bold);
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.total-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
}

.total-value {
  color: var(--color-gold);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-section);
}

.dismiss-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-gold);
  border: none;
  border-radius: var(--radius-pill);
  color: #000;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.dismiss-btn:hover {
  opacity: 0.85;
}
</style>
