<template>
  <div class="home-view">
    <header class="home-header">
      <h1 class="home-title">⚔️ 離峰大作戰</h1>
      <PointBadge :points="wallet.balance" />
    </header>

    <OffPeakTimeBanner
      v-if="store.offPeakWindow.start"
      :window="store.offPeakWindow"
    />
    <p v-else class="no-window">今日無離峰時段</p>

    <section class="game-cards">
      <GameCard>
        <template #title>⚔️ 卡位承諾</template>
        <template #description>預先承諾離峰進站，成功驗證可獲得 3 倍點數回饋。</template>
        <span v-if="store.pledge.committed" class="committed-badge">已承諾</span>
        <router-link v-else to="/off-peak/game-a" class="cta-button">前往</router-link>
      </GameCard>

      <GameCard>
        <template #title>🎯 運量猜猜樂</template>
        <template #description>預測離峰時段旅客運量，猜對贏得額外獎勵。</template>
        <span v-if="store.prediction.submitted" class="committed-badge">已預測</span>
        <router-link v-else to="/off-peak/game-b" class="cta-button">前往</router-link>
      </GameCard>
    </section>

    <MockTapInButton />
    <SettlementOverlay />
  </div>
</template>

<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: used in template
import GameCard from "../../components/GameCard.vue";
// biome-ignore lint/correctness/noUnusedImports: used in template
import MockTapInButton from "../../components/MockTapInButton.vue";
// biome-ignore lint/correctness/noUnusedImports: used in template
import OffPeakTimeBanner from "../../components/OffPeakTimeBanner.vue";
// biome-ignore lint/correctness/noUnusedImports: used in template
import PointBadge from "../../components/PointBadge.vue";
// biome-ignore lint/correctness/noUnusedImports: used in template
import SettlementOverlay from "../../components/SettlementOverlay.vue";
import { useOffPeakStore } from "../../stores/offPeak";
import { useWalletStore } from "../../stores/wallet";

// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const store = useOffPeakStore();
// biome-ignore lint/correctness/noUnusedVariables: exposed to template
const wallet = useWalletStore();
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-title {
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.no-window {
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  text-align: center;
  padding: var(--spacing-lg);
}

.game-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.committed-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(0, 168, 107, 0.2);
  border: 1px solid var(--color-bg-gradient-end);
  border-radius: var(--radius-pill);
  color: var(--color-bg-gradient-end);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

.cta-button {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-xl);
  background: var(--color-gold);
  border-radius: var(--radius-pill);
  color: #000;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  transition: opacity var(--duration-normal) var(--timing-ease);
}

.cta-button:hover {
  opacity: 0.85;
}
</style>
