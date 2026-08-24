<template>
  <div class="district-detail-card glass-card">
    <div class="card-header">
      <h2 class="district-name">{{ name }}</h2>
      <span v-if="isUnlocked" class="unlock-badge">✓ 已解鎖</span>
    </div>

    <div class="progress-section">
      <div class="progress-label">
        <span class="progress-count">{{ visited }} / {{ threshold }}</span>
        <span class="bonus-preview">+{{ bonusPoints }} pts</span>
      </div>
      <div
        class="progress-bar-track"
        role="progressbar"
        :aria-valuenow="progressPct"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="progress-bar-fill" :style="{ width: `${progressPct}%` }" />
      </div>
    </div>

    <ul class="station-list" aria-label="stations">
      <li
        v-for="station in stations"
        :key="station.id"
        class="station-row"
        :class="visitedIds.has(station.id) ? 'visited' : 'unvisited'"
      >
        <span class="station-indicator" aria-hidden="true">
          {{ visitedIds.has(station.id) ? "✓" : "○" }}
        </span>
        <span class="station-name">{{ station.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RpgStation } from "../api/mockData";

const props = defineProps<{
  name: string;
  stations: RpgStation[];
  visitedIds: Set<string>;
  threshold: number;
  bonusPoints: number;
  isUnlocked: boolean;
}>();

const visited = computed(() => props.stations.filter((s) => props.visitedIds.has(s.id)).length);

// biome-ignore lint/correctness/noUnusedVariables: used in template
const progressPct = computed(() =>
  props.threshold > 0 ? Math.min(100, Math.round((visited.value / props.threshold) * 100)) : 0
);
</script>

<style scoped>
.district-detail-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.glass-card {
  background: var(--color-glass-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  backdrop-filter: var(--blur-card);
  -webkit-backdrop-filter: var(--blur-card);
  padding: var(--spacing-lg);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.district-name {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
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

.progress-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-count {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.bonus-preview {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-rpg-accent);
}

.progress-bar-track {
  height: 8px;
  border-radius: 4px;
  background: var(--color-rpg-accent-dim);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--color-rpg-accent);
  transition: width var(--duration-normal) var(--timing-ease-out);
}

.station-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.station-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-body);
}

.station-row.visited .station-indicator {
  color: var(--color-rpg-accent);
  font-weight: var(--font-weight-bold);
}

.station-row.unvisited .station-indicator {
  color: var(--color-text-muted);
}

.station-row.visited .station-name {
  color: var(--color-text-primary);
}

.station-row.unvisited .station-name {
  color: var(--color-text-muted);
}
</style>
