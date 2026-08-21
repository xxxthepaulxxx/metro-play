<template>
  <div class="bb-home">
    <header class="bb-header">
      <h1 class="bb-title">🎁 盲盒旅行</h1>
      <span class="balance-badge">{{ wallet.balance }} 點</span>
    </header>

    <!-- Active box: already purchased, go to reveal -->
    <div v-if="store.activeBox.id && !store.reward.done" class="active-box-card">
      <p class="active-label">🗺️ 旅程進行中</p>
      <p class="active-dest" v-if="store.activeBox.destination">
        目的地：{{ store.activeBox.destination.name }}
      </p>
      <router-link to="/blind-box/reveal" class="cta-button">查看盲盒</router-link>
    </div>

    <!-- Reward done: show reset option -->
    <div v-else-if="store.reward.done" class="completed-card">
      <p class="completed-label">✅ 本次旅程完成！</p>
      <p class="completed-points">+{{ store.reward.bonusPoints }} 捷點已入帳</p>
      <button class="cta-button" type="button" @click="store.resetBox()">再來一次</button>
    </div>

    <!-- No active box: purchase flow -->
    <div v-else class="purchase-section">
      <div class="mystery-box-wrapper">
        <div class="mystery-box" aria-label="神秘盲盒">
          <span class="box-emoji">🎁</span>
        </div>
      </div>

      <div class="info-card">
        <p class="info-title">🗺️ 探索台北秘境</p>
        <p class="info-desc">購買盲盒，系統隨機分配台北捷運沿線的秘密目的地。抵達後掃描驗證，解鎖獨家商家優惠！</p>
        <ul class="info-list">
          <li>購買費用：<strong>30 捷點</strong></li>
          <li>換目的地（最多1次）：<strong>10 捷點</strong></li>
          <li>到達獎勵：<strong>50–150 捷點</strong></li>
        </ul>
      </div>

      <p v-if="wallet.balance < 30" class="insufficient-msg">
        點數不足，需要至少 30 捷點
      </p>
      <button
        class="purchase-btn"
        type="button"
        :disabled="wallet.balance < 30 || loading"
        @click="onPurchase"
      >
        {{ loading ? "購買中…" : "購買盲盒 (30點)" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useBlindBoxStore } from "../../stores/blindBox";
import { useWalletStore } from "../../stores/wallet";

const store = useBlindBoxStore();
const wallet = useWalletStore();
const router = useRouter();
const loading = ref(false);

// biome-ignore lint/correctness/noUnusedVariables: called from template
async function onPurchase(): Promise<void> {
  if (loading.value || wallet.balance < 30) return;
  loading.value = true;
  try {
    await store.purchaseBox();
    router.push("/blind-box/reveal");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.bb-home {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.bb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bb-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.balance-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-box-accent-dim);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-pill);
  color: var(--color-box-accent);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

/* Active box card */
.active-box-card,
.completed-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  text-align: center;
}

.active-label,
.completed-label {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.active-dest,
.completed-points {
  color: var(--color-box-accent);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

/* Purchase section */
.purchase-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
}

.mystery-box-wrapper {
  display: flex;
  justify-content: center;
}

.mystery-box {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-box-accent-dim);
  border: 2px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  animation: box-glow 2s ease-in-out infinite;
}

.box-emoji {
  font-size: 56px;
  line-height: 1;
}

@keyframes box-glow {
  0%, 100% {
    box-shadow: 0 0 16px rgba(0, 188, 212, 0.3);
  }
  50% {
    box-shadow: 0 0 36px rgba(0, 188, 212, 0.7);
  }
}

.info-card {
  width: 100%;
  padding: var(--spacing-lg);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.info-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

.info-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.info-list strong {
  color: var(--color-box-accent);
}

.insufficient-msg {
  color: #ff6b6b;
  font-size: var(--font-size-body);
  margin: 0;
  text-align: center;
}

.purchase-btn {
  padding: var(--spacing-md) var(--spacing-2xl);
  background: var(--color-box-accent);
  border: none;
  border-radius: var(--radius-pill);
  color: #000;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.purchase-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.purchase-btn:not(:disabled):hover {
  opacity: 0.85;
}

.cta-button {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-xl);
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
