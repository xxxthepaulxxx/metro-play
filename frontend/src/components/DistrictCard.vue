<template>
  <button
    type="button"
    class="district-card"
    :class="{ unlocked: isUnlocked, locked: !isUnlocked }"
    @click="$emit('click')"
  >
    <div class="card-top">
      <span class="district-name">{{ name }}</span>
      <span v-if="isUnlocked" class="unlock-badge">✓ 已解鎖</span>
      <span v-else class="lock-icon" aria-hidden="true">🔒</span>
    </div>
    <div class="card-bottom">
      <span class="progress-label">{{ visited }} / {{ threshold }}</span>
      <span class="bonus-preview">+{{ bonusPoints }} pts</span>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  visited: number;
  total: number;
  threshold: number;
  isUnlocked: boolean;
  bonusPoints: number;
}>();

defineEmits<{ click: [] }>();
</script>

<style scoped>
.district-card {
  width: 100%;
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
  background: var(--color-rpg-accent-dim);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-system);
  color: var(--color-text-primary);
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.district-card:hover {
  opacity: 0.9;
}

.district-card.unlocked {
  border: 1.5px solid var(--color-rpg-accent);
  opacity: 1;
}

.district-card.locked {
  border: 1.5px dashed var(--color-rpg-accent-border);
  opacity: 0.75;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.district-name {
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-bold);
}

.unlock-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-rpg-accent);
  background: var(--color-rpg-accent-dim);
  border: 1px solid var(--color-rpg-accent-border);
  border-radius: var(--radius-pill);
  padding: 2px var(--spacing-sm);
}

.lock-icon {
  font-size: var(--font-size-body);
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.bonus-preview {
  font-size: var(--font-size-sm);
  color: var(--color-rpg-accent);
  font-weight: var(--font-weight-medium);
}
</style>
