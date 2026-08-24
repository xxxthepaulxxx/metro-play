<template>
  <div v-if="active" class="unlock-burst">
    <div class="burst-card">
      <p class="burst-icon">🗺️</p>
      <p class="burst-title">區域解鎖！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";

const props = defineProps<{ active: boolean }>();
const emit = defineEmits<{ done: [] }>();

watch(
  () => props.active,
  (val) => {
    if (!val) return;
    setTimeout(() => {
      emit("done");
    }, 600);
  },
  { immediate: true }
);
</script>

<style scoped>
.unlock-burst {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  background: rgba(0, 0, 0, 0.6);
  animation: fadeIn var(--duration-fast) var(--timing-ease-out);
}

.burst-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-glass-combo);
  backdrop-filter: var(--blur-card);
  border: 2px solid var(--color-rpg-accent-border);
  border-radius: var(--radius-card);
  box-shadow: 0 0 40px var(--color-rpg-accent-glow);
  animation:
    unlockBounce var(--duration-rpg-unlock-bounce) var(--timing-ease-out),
    glowBurst var(--duration-rpg-glow-burst) var(--timing-ease-out) var(--duration-rpg-unlock-bounce);
}

.burst-icon {
  font-size: 64px;
  line-height: 1;
  margin: 0;
}

.burst-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-black);
  color: var(--color-rpg-accent);
  margin: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes unlockBounce {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  60% {
    opacity: 1;
    transform: scale(1.15);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes glowBurst {
  0% {
    box-shadow: 0 0 20px var(--color-rpg-accent-glow);
  }
  50% {
    box-shadow: 0 0 80px var(--color-rpg-accent-glow);
  }
  100% {
    box-shadow: 0 0 20px var(--color-rpg-accent-glow);
  }
}

@media (prefers-reduced-motion: reduce) {
  .unlock-burst,
  .burst-card {
    animation: none;
  }
}
</style>
