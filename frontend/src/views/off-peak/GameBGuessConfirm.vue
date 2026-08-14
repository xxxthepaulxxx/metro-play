<template>
  <div class="guess-confirm">
    <p class="confirm-icon">🎯</p>
    <h2 class="confirm-title">預測提交成功！</h2>
    <div class="confirm-details">
      <div class="detail-row">
        <span class="detail-label">離峰時段</span>
        <span class="detail-value">{{ offPeakWindow.start }} – {{ offPeakWindow.end }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">您的預測</span>
        <span class="detail-value prediction">{{ predictionLabel }}</span>
      </div>
    </div>
    <p class="result-hint">結算時揭曉答案，正確可獲得額外獎勵！</p>
    <router-link to="/off-peak" class="cta-button">返回首頁</router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  offPeakWindow: { start: string; end: string };
  predictionLabel: string;
}>();
</script>

<style scoped>
.guess-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  text-align: center;
}

.confirm-icon {
  font-size: 48px;
  margin: 0;
}

.confirm-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.confirm-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-glass-border);
  font-family: var(--font-system);
}

.detail-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
}

.detail-value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
}

.detail-value.prediction {
  color: #7c3aed;
  font-size: var(--font-size-section);
}

.result-hint {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
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
