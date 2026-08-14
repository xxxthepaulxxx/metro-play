<template>
  <div class="tap-in-wrapper">
    <button
      class="tap-in-btn"
      type="button"
      :disabled="loading || store.settlement.done"
      @click="onTapIn"
    >
      {{ loading ? "驗證中…" : "模擬進站" }}
    </button>
    <p v-if="error" class="error-msg" role="alert">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useOffPeakStore } from "../stores/offPeak";

const store = useOffPeakStore();
const loading = ref(false);
const error = ref<string | null>(null);

// biome-ignore lint/correctness/noUnusedVariables: called from template via @click
async function onTapIn(): Promise<void> {
  if (loading.value || store.settlement.done) return;
  loading.value = true;
  error.value = null;
  try {
    await store.simulateGateTap();
    await store.settle();
  } catch {
    error.value = "進站驗證失敗，請稍後再試。";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.tap-in-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.tap-in-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-bg-gradient-end);
  border: none;
  border-radius: var(--radius-pill);
  color: #fff;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: opacity var(--duration-normal) var(--timing-ease);
  width: 100%;
}

.tap-in-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tap-in-btn:not(:disabled):hover {
  opacity: 0.85;
}

.error-msg {
  color: #ff6b6b;
  font-size: var(--font-size-sm);
  margin: 0;
}
</style>
