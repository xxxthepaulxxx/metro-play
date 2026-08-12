<template>
  <div id="metro-play">
    <nav class="tab-bar" role="tablist">
      <router-link
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="tab"
        :class="{ active: isTabActive(tab) }"
        role="tab"
        :aria-selected="isTabActive(tab)"
      >
        {{ tab.label }}
      </router-link>
    </nav>

    <main class="view-container">
      <router-view />
    </main>

    <div class="particles" aria-hidden="true">
      <span class="particle particle-1">✨</span>
      <span class="particle particle-2">⭐</span>
      <span class="particle particle-3">💫</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tabs = [
  {
    label: "⚔️ 離峰大作戰",
    to: "/",
    activePaths: ["/", "/game-a", "/game-b", "/settlement"],
  },
  { label: "🎁 盲盒旅行", to: "/module2", activePaths: ["/module2"] },
  { label: "👑 夢幻特權", to: "/module3", activePaths: ["/module3"] },
  { label: "🗺️ 城市RPG", to: "/module4", activePaths: ["/module4"] },
] as const;

type Tab = (typeof tabs)[number];

// biome-ignore lint/correctness/noUnusedVariables: used in template as isTabActive(tab)
const isTabActive = computed(() => (tab: Tab) => {
  const path = route.path;
  return tab.activePaths.some((p) =>
    p === "/" ? path === "/" : path === p || path.startsWith(`${p}/`)
  );
});

onMounted(() => {
  const key = "metro-play:last-date";
  const today = new Date().toISOString().split("T")[0] ?? "";
  if (localStorage.getItem(key) !== today) {
    localStorage.setItem(key, today);
  }
});
</script>

<style scoped>
#metro-play {
  position: relative;
  min-height: 100dvh;
  background: linear-gradient(
    135deg,
    var(--color-bg-gradient-start) 0%,
    var(--color-bg-gradient-end) 100%
  );
  background-attachment: fixed;
  font-family: var(--font-system);
  color: var(--color-text-primary);
  overflow-x: hidden;
}

.tab-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  height: 56px;
  background: var(--color-tab-bg);
  backdrop-filter: var(--blur-tab);
  -webkit-backdrop-filter: var(--blur-tab);
  border-bottom: 1px solid var(--color-glass-border);
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color var(--duration-normal) var(--timing-ease),
    border-color var(--duration-normal) var(--timing-ease);
  padding: 0 var(--spacing-xs);
  text-align: center;
  white-space: nowrap;
}

.tab.active {
  color: var(--color-gold);
  border-bottom-color: var(--color-gold);
  font-weight: var(--font-weight-bold);
}

.view-container {
  position: relative;
  z-index: 1;
  min-height: calc(100dvh - 56px);
  padding: var(--spacing-lg);
}

/* Floating particles — decorative only, never intercept events */
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  font-size: 18px;
  opacity: 0.4;
  animation: float var(--duration-float) ease-in-out infinite;
}

.particle-1 {
  left: 15%;
  bottom: -40px;
  animation-delay: 0s;
}

.particle-2 {
  left: 55%;
  bottom: -40px;
  animation-delay: 2s;
}

.particle-3 {
  left: 80%;
  bottom: -40px;
  animation-delay: 4s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-110dvh) rotate(20deg);
    opacity: 0;
  }
}
</style>
