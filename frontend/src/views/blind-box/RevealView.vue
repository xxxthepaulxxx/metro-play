<template>
  <div class="reveal-view">
    <header class="page-header">
      <router-link to="/blind-box" class="back-link">← 返回</router-link>
      <h1 class="page-title">🎁 開箱揭曉</h1>
    </header>

    <!-- No active box guard -->
    <div v-if="!store.activeBox.id" class="no-box">
      <p class="no-box-msg">尚未購買盲盒</p>
      <router-link to="/blind-box" class="cta-button">前往購買</router-link>
    </div>

    <template v-else>
      <!-- 3D Flip card -->
      <div class="flip-scene" @click="!flipped ? reveal() : null">
        <div class="flip-card" :class="{ flipped, shaking }">
          <!-- Front: mystery box -->
          <div class="flip-face flip-front">
            <div class="mystery-box">
              <span class="box-emoji">🎁</span>
              <p class="tap-hint">點擊開箱！</p>
            </div>
          </div>
          <!-- Back: destination -->
          <div class="flip-face flip-back">
            <div class="destination-card" v-if="store.activeBox.destination">
              <p class="dest-tag">🗺️ 你的秘密目的地</p>
              <h2 class="dest-name">{{ store.activeBox.destination.name }}</h2>
              <p class="dest-station">
                <span class="station-icon">🚇</span> {{ store.activeBox.destination.station }} 站
              </p>
              <p class="dest-description">{{ store.activeBox.destination.description }}</p>
              <div class="discount-badge">
                🎟️ {{ store.activeBox.destination.discountText }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions (visible after reveal) -->
      <div v-if="flipped" class="actions">
        <button
          v-if="store.rerollCount < 1"
          class="reroll-btn"
          type="button"
          :disabled="wallet.balance < 10 || rerolling"
          @click="onReroll"
        >
          {{ rerolling ? "換目的地中…" : `🔄 換個目的地 (10點)` }}
        </button>
        <p v-if="store.rerollCount >= 1" class="reroll-used">已使用換目的地機會</p>

        <router-link
          to="/blind-box/scan-station"
          class="cta-button"
        >
          🚇 前往車站打卡
        </router-link>
      </div>

      <p v-if="wallet.balance < 10 && store.rerollCount < 1 && flipped" class="low-balance">
        點數不足，無法換目的地
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBlindBoxStore } from "../../stores/blindBox";
import { useWalletStore } from "../../stores/wallet";

const store = useBlindBoxStore();
const wallet = useWalletStore();

const flipped = ref(false);
const shaking = ref(false);
const rerolling = ref(false);

// biome-ignore lint/correctness/noUnusedVariables: called from template
function reveal(): void {
  flipped.value = true;
}

// biome-ignore lint/correctness/noUnusedVariables: called from template
async function onReroll(): Promise<void> {
  if (rerolling.value || store.rerollCount >= 1 || wallet.balance < 10) return;
  rerolling.value = true;

  // Shake then flip back
  shaking.value = true;
  await pause(300);
  shaking.value = false;
  flipped.value = false;
  await pause(100);

  // Fetch new destination
  await store.rerollBox();

  // Flip forward again
  flipped.value = true;
  rerolling.value = false;
}

function pause(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
</script>

<style scoped>
.reveal-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.back-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-body);
  transition: color var(--duration-normal) var(--timing-ease);
}

.back-link:hover {
  color: var(--color-text-primary);
}

.page-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

/* No box */
.no-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  text-align: center;
}

.no-box-msg {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  margin: 0;
}

/* 3D flip card */
.flip-scene {
  perspective: 1000px;
  cursor: pointer;
  min-height: 220px;
}

.flip-card {
  position: relative;
  width: 100%;
  min-height: 220px;
  transform-style: preserve-3d;
  transition: transform var(--duration-box-flip) var(--timing-ease-out);
}

.flip-card.flipped {
  transform: rotateY(180deg);
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotateY(0deg); }
  20%       { transform: translateX(-8px) rotateY(0deg); }
  40%       { transform: translateX(8px) rotateY(0deg); }
  60%       { transform: translateX(-6px) rotateY(0deg); }
  80%       { transform: translateX(6px) rotateY(0deg); }
}

.flip-card.shaking {
  animation: shake var(--duration-box-shake) ease-out;
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius-card);
  overflow: hidden;
}

.flip-front {
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
}

.flip-back {
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  transform: rotateY(180deg);
}

/* Front: mystery box */
.mystery-box {
  width: 100%;
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.box-emoji {
  font-size: 72px;
  line-height: 1;
  animation: box-glow-filter 2s ease-in-out infinite;
}

@keyframes box-glow-filter {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 188, 212, 0.4)); }
  50%       { filter: drop-shadow(0 0 20px rgba(0, 188, 212, 0.9)); }
}

.tap-hint {
  color: var(--color-box-accent);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

/* Back: destination card */
.destination-card {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 220px;
  justify-content: center;
}

.dest-tag {
  font-size: var(--font-size-sm);
  color: var(--color-box-accent);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.dest-name {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-black);
  color: var(--color-text-primary);
  margin: 0;
}

.dest-station {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.station-icon {
  font-size: var(--font-size-body);
}

.dest-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

.discount-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-box-accent-dim);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-pill);
  color: var(--color-box-accent);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

/* Actions */
.actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.reroll-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: transparent;
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-pill);
  color: var(--color-box-accent);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.reroll-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.reroll-btn:not(:disabled):hover {
  opacity: 0.8;
}

.reroll-used {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.low-balance {
  color: #ff6b6b;
  font-size: var(--font-size-sm);
  text-align: center;
  margin: 0;
}

.cta-button {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-2xl);
  background: var(--color-box-accent);
  border: none;
  border-radius: var(--radius-pill);
  color: #000;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  cursor: pointer;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.cta-button:hover {
  opacity: 0.85;
}
</style>
