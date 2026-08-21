<template>
  <div class="stub-view">
    <header class="page-header">
      <router-link to="/blind-box/scan-station" class="back-link">← 返回</router-link>
      <h1 class="page-title">🎟️ 商家驗證</h1>
    </header>
    <div class="stub-card">
      <p class="stub-label">掃描商家 QR Code</p>
      <p class="stub-hint">Coming in Slice 21</p>
    </div>
  </div>
</template>

<style scoped>
.stub-view {
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
}
.page-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}
.stub-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  min-height: 200px;
  justify-content: center;
  text-align: center;
}
.stub-label {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}
.stub-hint {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
}
</style>
