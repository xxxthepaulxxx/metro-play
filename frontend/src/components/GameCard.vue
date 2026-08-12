<template>
  <div class="game-card">
    <div class="game-card__title">
      <slot name="title" />
    </div>
    <div class="game-card__description">
      <slot name="description" />
    </div>
    <div class="game-card__cta">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// No props, no emits, no router coupling — pure slot container
</script>

<style scoped>
.game-card {
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  font-family: var(--font-system);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.game-card__title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.game-card__description {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
}

.game-card__cta {
  margin-top: var(--spacing-sm);
}
</style>
