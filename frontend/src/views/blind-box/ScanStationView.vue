<template>
  <div class="scan-station-view">
    <header class="page-header">
      <router-link to="/blind-box/reveal" class="back-link">← 返回</router-link>
      <h1 class="page-title">🚇 車站打卡</h1>
    </header>

    <!-- Guard: no active box -->
    <div v-if="!store.activeBox.id || !store.activeBox.destination" class="no-box">
      <p class="no-box-msg">尚未購買盲盒</p>
      <router-link to="/blind-box" class="cta-button">前往購買</router-link>
    </div>

    <template v-else>
      <!-- Destination reminder -->
      <div class="dest-card">
        <p class="dest-tag">🗺️ 今日目的地</p>
        <h2 class="dest-name">{{ store.activeBox.destination.name }}</h2>
        <p class="dest-station">
          <span class="station-label">搭乘捷運至</span>
          <strong class="station-name">{{ store.activeBox.destination.station }} 站</strong>
        </p>
      </div>

      <!-- Scan area -->
      <div class="scan-card">
        <!-- Before scan -->
        <template v-if="!store.activeBox.stationVerified">
          <div class="qr-mock" aria-label="模擬 QR Code 掃描區">
            <div class="qr-frame">
              <span class="qr-icon">📷</span>
            </div>
            <p class="scan-hint">到達 {{ store.activeBox.destination.station }} 站後，掃描閘門旁的 QR Code</p>
          </div>

          <button
            class="scan-btn"
            type="button"
            :disabled="scanning"
            @click="onScan"
          >
            {{ scanning ? "驗證中…" : "模擬掃描 QR Code" }}
          </button>
        </template>

        <!-- After scan: success -->
        <template v-else>
          <div class="success-state">
            <span class="success-icon">✅</span>
            <p class="success-label">車站打卡成功！</p>
            <p class="success-sub">已確認抵達 {{ store.activeBox.destination.station }} 站</p>
          </div>

          <router-link to="/blind-box/scan-merchant" class="cta-button">
            🎟️ 前往商家打卡
          </router-link>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBlindBoxStore } from "../../stores/blindBox";

const store = useBlindBoxStore();
const scanning = ref(false);

// biome-ignore lint/correctness/noUnusedVariables: called from template
async function onScan(): Promise<void> {
  if (scanning.value || !store.activeBox.destination) return;
  scanning.value = true;
  try {
    await store.verifyStation(store.activeBox.destination.station);
  } finally {
    scanning.value = false;
  }
}
</script>

<style scoped>
.scan-station-view {
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

/* Destination reminder card */
.dest-card {
  padding: var(--spacing-lg);
  background: var(--color-glass-card);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-box-accent-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.dest-tag {
  font-size: var(--font-size-sm);
  color: var(--color-box-accent);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.dest-name {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-black);
  color: var(--color-text-primary);
  margin: 0;
}

.dest-station {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin: 0;
  display: flex;
  gap: var(--spacing-xs);
  align-items: baseline;
}

.station-label {
  color: var(--color-text-muted);
}

.station-name {
  color: var(--color-box-accent);
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
  min-height: 240px;
  justify-content: center;
}

/* QR mock */
.qr-mock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.qr-frame {
  width: 120px;
  height: 120px;
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
  font-size: 48px;
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

/* Success state */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
}

.success-icon {
  font-size: 56px;
  line-height: 1;
}

.success-label {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.success-sub {
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
</style>
