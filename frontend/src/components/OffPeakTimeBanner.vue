<template>
  <div class="off-peak-banner">
    <div class="window-time">
      <span class="label">{{ window.label ?? "離峰時段" }}</span>
      <span class="time-range">{{ window.start }} – {{ window.end }}</span>
    </div>
    <div class="countdown">
      <span class="countdown-label">倒計時</span>
      <span class="countdown-value">{{ countdownDisplay }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";

interface OffPeakWindow {
  start: string;
  end: string;
  label?: string;
}

const props = defineProps<{ window: OffPeakWindow }>();

function getTargetMs(): number {
  const now = new Date();
  const [hStr, mStr] = props.window.start.split(":");
  const h = Number(hStr ?? "0");
  const m = Number(mStr ?? "0");
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  return target.getTime();
}

const remaining = ref<number>(0);

function update(): void {
  const diff = getTargetMs() - Date.now();
  remaining.value = diff;
}

update();

const intervalId = setInterval(update, 1000);

onUnmounted(() => {
  clearInterval(intervalId);
});

// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const countdownDisplay = computed<string>(() => {
  if (remaining.value <= 0) {
    return "進行中";
  }
  const totalSeconds = Math.floor(remaining.value / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
});
</script>

<style scoped>
.off-peak-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  font-family: var(--font-system);
  color: var(--color-text-primary);
  gap: var(--spacing-lg);
}

.window-time {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.time-range {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-bg-gradient-end);
}

.countdown {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.countdown-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.countdown-value {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}
</style>
