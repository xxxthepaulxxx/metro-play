<template>
  <span class="point-badge">{{ formatted }} 點</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ points: number }>();

// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const formatted = computed(() => props.points.toLocaleString("zh-TW"));
</script>

<style scoped>
.point-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-glass-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-pill);
  color: var(--color-gold);
  font-family: var(--font-system);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  backdrop-filter: var(--blur-card);
}
</style>
