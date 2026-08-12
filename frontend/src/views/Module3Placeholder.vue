<template>
  <div class="placeholder">
    <p class="title">👑 夢幻特權</p>
    <p class="coming-soon">Coming soon</p>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60dvh;
  color: var(--color-text-primary);
  text-align: center;
  gap: var(--spacing-md);
}
.title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
}
.coming-soon {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
}
</style>
