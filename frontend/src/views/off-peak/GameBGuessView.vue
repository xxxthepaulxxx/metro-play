<template>
  <div class="game-b-guess">
    <header class="page-header">
      <router-link to="/off-peak" class="back-link">← 返回</router-link>
      <h1 class="page-title">🎯 運量猜猜樂</h1>
    </header>

    <!-- Inline confirmation after successful submit (takes priority) -->
    <GameBGuessConfirm
      v-if="submitted"
      :off-peak-window="store.offPeakWindow"
      :prediction-label="confirmedLabel"
    />

    <!-- Returning after a prior session's guess -->
    <div v-else-if="store.prediction.submitted" class="locked-state">
      <p class="locked-label">已提交預測</p>
      <p class="locked-range">
        範圍 {{ store.prediction.range.min }} – {{ store.prediction.range.max }} 人次
      </p>
      <router-link to="/off-peak" class="cta-button">返回首頁</router-link>
    </div>

    <!-- Guess form -->
    <div v-else class="guess-form-container">
      <div class="window-card">
        <p class="window-label">今日離峰時段</p>
        <p class="window-time">{{ store.offPeakWindow.start }} – {{ store.offPeakWindow.end }}</p>
      </div>

      <div class="level-select">
        <p class="level-heading">預測運量</p>
        <div class="level-buttons">
          <button
            class="level-btn"
            :class="{ active: selectedLevel === 'HIGH' }"
            type="button"
            @click="selectedLevel = 'HIGH'"
          >
            🔴 高運量
          </button>
          <button
            class="level-btn"
            :class="{ active: selectedLevel === 'MED' }"
            type="button"
            @click="selectedLevel = 'MED'"
          >
            🟡 中運量
          </button>
          <button
            class="level-btn"
            :class="{ active: selectedLevel === 'LOW' }"
            type="button"
            @click="selectedLevel = 'LOW'"
          >
            🟢 低運量
          </button>
        </div>
      </div>

      <p v-if="error" class="error-msg" role="alert">{{ error }}</p>

      <button
        class="submit-btn"
        type="button"
        :disabled="!isValid || loading"
        @click="onSubmit"
      >
        {{ loading ? "提交中…" : "確認預測" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { submitPrediction } from "../../api/mockApi";
import { useOffPeakStore } from "../../stores/offPeak";
// biome-ignore lint/correctness/noUnusedImports: used in template
import GameBGuessConfirm from "./GameBGuessConfirm.vue";

type Level = "HIGH" | "MED" | "LOW";

const LEVEL_RANGES: Record<Level, { min: number; max: number }> = {
  HIGH: { min: 600, max: 1000 },
  LOW: { min: 0, max: 400 },
  MED: { min: 400, max: 600 },
};

const LEVEL_LABELS: Record<Level, string> = {
  HIGH: "高運量",
  LOW: "低運量",
  MED: "中運量",
};

const store = useOffPeakStore();
const selectedLevel = ref<Level | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const submitted = ref(false);
const confirmedLabel = ref("");

const isValid = computed(() => selectedLevel.value !== null);

// biome-ignore lint/correctness/noUnusedVariables: called from template via @click
async function onSubmit(): Promise<void> {
  if (!isValid.value || loading.value) return;
  loading.value = true;
  error.value = null;
  const level = selectedLevel.value as Level;
  const range = LEVEL_RANGES[level];
  try {
    const response = await submitPrediction("wenhu", range);
    store._predictionId = response.predictionId;
    store.submitPrediction(range);
    confirmedLabel.value = LEVEL_LABELS[level];
    submitted.value = true;
  } catch {
    error.value = "提交失敗，請稍後再試。";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.game-b-guess {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.back-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-body);
  transition: color var(--duration-normal) var(--timing-ease);
}

.back-link:hover {
  color: var(--color-text-primary);
}

.page-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.locked-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  text-align: center;
}

.locked-label {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: #7c3aed;
  margin: 0;
}

.locked-range {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  margin: 0;
}

.window-card {
  padding: var(--spacing-lg);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
}

.window-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-xs);
}

.window-time {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-bg-gradient-end);
  margin: 0;
}

.level-select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.level-heading {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
}

.level-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.level-btn {
  flex: 1;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    border-color var(--duration-normal) var(--timing-ease),
    color var(--duration-normal) var(--timing-ease),
    background var(--duration-normal) var(--timing-ease);
}

.level-btn.active {
  border-color: #7c3aed;
  color: var(--color-text-primary);
  background: rgba(124, 58, 237, 0.15);
}

.error-msg {
  color: #ff6b6b;
  font-size: var(--font-size-body);
  margin: 0;
}

.submit-btn {
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

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  opacity: 0.85;
}

.cta-button {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-gold);
  border-radius: var(--radius-pill);
  color: #000;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.cta-button:hover {
  opacity: 0.85;
}
</style>
