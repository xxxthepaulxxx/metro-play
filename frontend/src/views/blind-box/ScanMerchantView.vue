<template>
  <div class="scan-merchant-view">
    <header class="page-header">
      <router-link to="/blind-box/scan-station" class="back-link">← 返回</router-link>
      <h1 class="page-title">🎟️ 商家驗證</h1>
    </header>

    <!-- Guard: no active box -->
    <div v-if="!store.activeBox.id || !store.activeBox.destination" class="no-box">
      <p class="no-box-msg">尚未購買盲盒</p>
      <router-link to="/blind-box" class="cta-button">前往購買</router-link>
    </div>

    <!-- Guard: station not verified -->
    <div v-else-if="!store.activeBox.stationVerified" class="station-required">
      <p class="station-required-icon">🚇</p>
      <p class="station-required-msg">請先完成車站打卡</p>
      <router-link to="/blind-box/scan-station" class="cta-button">前往車站打卡</router-link>
    </div>

    <template v-else>
      <!-- Merchant info card -->
      <div class="merchant-card">
        <p class="merchant-tag">🎟️ 合作商家</p>
        <h2 class="merchant-name">{{ store.activeBox.destination.name }}</h2>
        <div class="discount-badge">{{ store.activeBox.destination.discountText }}</div>
        <p class="merchant-code-label">商家驗證碼</p>
        <p class="merchant-code">{{ store.activeBox.destination.merchantCode }}</p>
      </div>

      <!-- Phase: scan -->
      <div v-if="!store.activeBox.merchantVerified" class="scan-card">
        <div class="qr-mock">
          <div class="qr-frame">
            <span class="qr-icon">📷</span>
          </div>
          <p class="scan-hint">
            在 {{ store.activeBox.destination.name }} 出示此畫面並掃描商家 QR Code
          </p>
        </div>
        <button
          class="scan-btn"
          type="button"
          :disabled="scanning"
          @click="onScan"
        >
          {{ scanning ? "驗證中…" : "模擬掃描商家 QR Code" }}
        </button>
      </div>

      <!-- Phase: verified, claim reward -->
      <div v-else-if="!store.reward.done" class="reward-card">
        <div class="reward-header">
          <span class="reward-icon">🎊</span>
          <p class="reward-title">商家驗證成功！</p>
        </div>
        <div class="reward-breakdown">
          <div class="reward-row">
            <span class="reward-label">🎟️ 折扣優惠</span>
            <span class="reward-value discount">{{ store.activeBox.destination.discountText }}</span>
          </div>
          <div class="reward-row">
            <span class="reward-label">✨ 捷點獎勵</span>
            <span class="reward-value points">+{{ store.reward.bonusPoints }} 捷點</span>
          </div>
        </div>
        <button
          class="claim-btn"
          type="button"
          :disabled="claiming"
          @click="onClaim"
        >
          {{ claiming ? "領取中…" : "領取獎勵" }}
        </button>
      </div>

      <!-- Phase: reward claimed, celebration -->
      <div v-else class="celebration-card">
        <div class="celebration-header">
          <span class="celebration-icon">🏆</span>
          <p class="celebration-title">旅程完成！</p>
        </div>
        <div class="celebration-summary">
          <p class="summary-label">本次獲得</p>
          <p class="summary-points">+{{ store.reward.bonusPoints }} 捷點</p>
          <p class="summary-discount">{{ store.activeBox.destination.discountText }} 已解鎖</p>
        </div>
        <router-link to="/blind-box" class="cta-button home-btn">
          返回首頁
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBlindBoxStore } from "../../stores/blindBox";

const store = useBlindBoxStore();
const scanning = ref(false);
const claiming = ref(false);

// biome-ignore lint/correctness/noUnusedVariables: called from template
async function onScan(): Promise<void> {
  if (scanning.value || !store.activeBox.destination) return;
  scanning.value = true;
  try {
    await store.verifyMerchant(store.activeBox.destination.merchantCode);
  } finally {
    scanning.value = false;
  }
}

// biome-ignore lint/correctness/noUnusedVariables: called from template
function onClaim(): void {
  if (claiming.value) return;
  claiming.value = true;
  store.claimReward();
  claiming.value = false;
}
</script>

<style scoped>
.scan-merchant-view {
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

/* Guards */
.no-box,
.station-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  text-align: center;
}

.no-box-msg,
.station-required-msg {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  margin: 0;
}

.station-required-icon {
  font-size: 48px;
  margin: 0;
}

/* Merchant card */
.merchant-card {
  padding: var(--spacing-lg);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.merchant-tag {
  font-size: var(--font-size-sm);
  color: var(--color-box-accent);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.merchant-name {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-black);
  color: var(--color-text-primary);
  margin: 0;
}

.discount-badge {
  display: inline-block;
  align-self: flex-start;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-box-accent-dim);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-pill);
  color: var(--color-box-accent);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.merchant-code-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: var(--spacing-xs) 0 0;
}

.merchant-code {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-family: monospace;
  margin: 0;
}

/* Scan card */
.scan-card {
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  min-height: 220px;
  justify-content: center;
}

.qr-mock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.qr-frame {
  width: 100px;
  height: 100px;
  border: 2px dashed var(--color-box-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-box-accent-dim);
  animation: frame-pulse 2s ease-in-out infinite;
}

@keyframes frame-pulse {
  0%, 100% { border-color: var(--color-box-accent-border); }
  50%       { border-color: var(--color-box-accent); }
}

.qr-icon {
  font-size: 40px;
  line-height: 1;
}

.scan-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
  max-width: 240px;
  line-height: 1.5;
}

.scan-btn {
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

.scan-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.scan-btn:not(:disabled):hover {
  opacity: 0.85;
}

/* Reward card */
.reward-card {
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.reward-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.reward-icon {
  font-size: 48px;
  line-height: 1;
}

.reward-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.reward-breakdown {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-box-accent-dim);
  border-radius: var(--radius-card);
}

.reward-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reward-label {
  font-size: var(--font-size-body);
  color: var(--color-text-muted);
}

.reward-value {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
}

.reward-value.discount {
  color: var(--color-box-accent);
}

.reward-value.points {
  color: var(--color-gold);
}

.claim-btn {
  padding: var(--spacing-md) var(--spacing-2xl);
  background: var(--color-gold);
  border: none;
  border-radius: var(--radius-pill);
  color: #000;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.claim-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.claim-btn:not(:disabled):hover {
  opacity: 0.85;
}

/* Celebration card */
.celebration-card {
  padding: var(--spacing-xl);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  text-align: center;
  animation: celebrate-in var(--duration-slow) var(--timing-ease-out);
}

@keyframes celebrate-in {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

.celebration-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.celebration-icon {
  font-size: 64px;
  line-height: 1;
}

.celebration-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.celebration-summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.summary-points {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-black);
  color: var(--color-gold);
  margin: 0;
}

.summary-discount {
  font-size: var(--font-size-body);
  color: var(--color-box-accent);
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

.home-btn {
  background: var(--color-gold);
}
</style>
