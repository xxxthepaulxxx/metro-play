<template>
  <div class="game-a-pledge">
    <header class="page-header">
      <router-link to="/off-peak" class="back-link">← 返回</router-link>
      <h1 class="page-title">⚔️ 卡位承諾</h1>
    </header>

    <!-- Inline confirmation after successful submit (takes priority so user sees it) -->
    <GameAPledgeConfirm
      v-if="submitted"
      :off-peak-window="store.offPeakWindow"
      :staked="stakedAmount"
      :expected-return="stakedAmount * 3"
    />

    <!-- Returning to this page after a prior session's commit -->
    <div v-else-if="store.pledge.committed" class="committed-state">
      <p class="committed-label">已承諾 {{ store.pledge.staked.toLocaleString("zh-TW") }} 點</p>
      <p class="committed-window">{{ store.offPeakWindow.start }} – {{ store.offPeakWindow.end }}</p>
      <router-link to="/off-peak" class="cta-button">返回首頁</router-link>
    </div>

    <!-- Pledge form -->
    <div v-else class="pledge-form-container">
      <div class="window-card">
        <p class="window-label">今日離峰時段</p>
        <p class="window-time">{{ store.offPeakWindow.start }} – {{ store.offPeakWindow.end }}</p>
      </div>

      <form class="pledge-form" @submit.prevent="onSubmit">
        <label class="input-label" for="stake-input">承諾點數</label>
        <input
          id="stake-input"
          v-model.number="stake"
          class="stake-input"
          type="number"
          min="10"
          :max="store.balance"
          placeholder="最少 10 點"
        />
        <p class="input-hint">
          餘額 {{ store.balance.toLocaleString("zh-TW") }} 點，最少 10 點
        </p>

        <p v-if="error" class="error-msg" role="alert">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="!isValid || loading">
          {{ loading ? "提交中…" : "確認承諾" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { submitPledge } from "../../api/mockApi";
import { useOffPeakStore } from "../../stores/offPeak";
// biome-ignore lint/correctness/noUnusedImports: used in template
import GameAPledgeConfirm from "./GameAPledgeConfirm.vue";

const store = useOffPeakStore();
const stake = ref<number>(10);
const loading = ref(false);
const error = ref<string | null>(null);
const submitted = ref(false);
// Capture the staked amount at submit time so the confirm screen is stable
const stakedAmount = ref(0);

const isValid = computed(() => stake.value >= 10 && stake.value <= store.balance);

// biome-ignore lint/correctness/noUnusedVariables: called from template via @submit.prevent
async function onSubmit(): Promise<void> {
  if (!isValid.value || loading.value) return;
  loading.value = true;
  error.value = null;
  try {
    const response = await submitPledge(stake.value, "wenhu");
    store._pledgeId = response.pledgeId;
    store.commitPledge(stake.value);
    stakedAmount.value = stake.value;
    submitted.value = true;
  } catch {
    error.value = "提交失敗，請稍後再試。";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.game-a-pledge {
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

.committed-state {
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

.committed-label {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-bg-gradient-end);
  margin: 0;
}

.committed-window {
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

.pledge-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-label {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.stake-input {
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  color: var(--color-text-primary);
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  text-align: center;
  box-sizing: border-box;
  -moz-appearance: textfield;
}

.stake-input::-webkit-outer-spin-button,
.stake-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
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
