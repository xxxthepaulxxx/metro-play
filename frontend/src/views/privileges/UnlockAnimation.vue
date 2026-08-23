<template>
  <div v-if="store.unlockPending" class="unlock-animation" @animationend="onAnimationEnd">
    <div class="unlock-card">
      <p class="unlock-emoji">{{ tierEmoji }}</p>
      <p class="unlock-title">{{ tierName }} 解鎖！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLoyaltyTierStore } from "../../stores/loyaltyTier";

const store = useLoyaltyTierStore();

const TIER_META: Record<string, { emoji: string; name: string }> = {
  Bronze: { emoji: "🥉", name: "青銅" },
  Silver: { emoji: "🥈", name: "白銀" },
  Gold: { emoji: "🏆", name: "黃金" },
  Platinum: { emoji: "👑", name: "鉑金" },
};

// biome-ignore lint/correctness/noUnusedVariables: used in template
const tierEmoji = computed(() => TIER_META[store.currentTier.name]?.emoji ?? "🎉");
// biome-ignore lint/correctness/noUnusedVariables: used in template
const tierName = computed(() => TIER_META[store.currentTier.name]?.name ?? store.currentTier.name);

function onAnimationEnd() {
  store.clearUnlock();
}
</script>

<style scoped>
.unlock-animation {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  background: rgba(0, 0, 0, 0.6);
  animation: fadeIn var(--duration-fast) var(--timing-ease-out);
}

.unlock-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-glass-combo);
  backdrop-filter: var(--blur-card);
  border: 2px solid var(--color-tier-accent-border);
  border-radius: var(--radius-card);
  box-shadow: 0 0 40px var(--color-tier-accent-glow);
  animation:
    unlockBounce var(--duration-tier-unlock-bounce) var(--timing-ease-out),
    glowPulse var(--duration-tier-glow-pulse) var(--timing-ease-out)
      var(--duration-tier-unlock-bounce);
}

.unlock-emoji {
  font-size: 64px;
  line-height: 1;
  margin: 0;
}

.unlock-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-black);
  color: var(--color-tier-accent);
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes unlockBounce {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes glowPulse {
  0% { box-shadow: 0 0 20px var(--color-tier-accent-glow); }
  50% { box-shadow: 0 0 60px var(--color-tier-accent-glow); }
  100% { box-shadow: 0 0 20px var(--color-tier-accent-glow); }
}
</style>
