<template>
  <svg class="progress-ring" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
    <circle
      class="progress-ring__track"
      cx="44"
      cy="44"
      r="36"
      fill="none"
      stroke-width="8"
    />
    <circle
      class="progress-ring__fill"
      cx="44"
      cy="44"
      r="36"
      fill="none"
      stroke-width="8"
      :stroke-dasharray="CIRCUMFERENCE"
      :stroke-dashoffset="offset"
      transform="rotate(-90 44 44)"
    />
    <text class="progress-ring__label" x="44" y="44" text-anchor="middle" dominant-baseline="central">
      {{ percentText }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: number; total: number }>();

const CIRCUMFERENCE = 2 * Math.PI * 36;

// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const offset = computed<number>(() => {
  const ratio = Math.min(1, Math.max(0, props.value / props.total));
  return CIRCUMFERENCE * (1 - ratio);
});

// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const percentText = computed<string>(() => {
  const ratio = Math.min(1, Math.max(0, props.value / props.total));
  return `${Math.round(ratio * 100)}%`;
});
</script>

<style scoped>
.progress-ring {
  width: 88px;
  height: 88px;
  display: block;
}

.progress-ring__track {
  stroke: var(--color-glass-border);
}

.progress-ring__fill {
  stroke: var(--color-bg-gradient-end);
  stroke-linecap: round;
  transition: stroke-dashoffset var(--duration-normal) var(--timing-ease-out);
}

.progress-ring__label {
  font-family: var(--font-system);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  fill: var(--color-text-primary);
}
</style>
