# 捷點生活 Metro Go Pass

> 黑客松原型 · Hackathon Prototype

一款以台北捷運為場景的遊戲化點數 App，讓離峰通勤變成每天的小冒險。
A gamified points app set in the Taipei Metro, turning off-peak commuting into a daily adventure.

---

## 快速試玩 Quick Demo

> **評審請直接開啟以下連結，無需安裝任何環境。**
> **Judges: open the link below — no setup required.**

🔗 **https://xxxthepaulxxx.github.io/metro-play/** *(replace with your deployed URL)*

建議使用手機或開啟瀏覽器的 **手機模擬模式（375 × 812）**，體驗最佳。
Best viewed on mobile or with browser DevTools set to **375 × 812 (iPhone viewport)**.

---

## 四大模組 Demo 步驟 · Four-Module Walkthrough

### Module 1 — 離峰減碳大作戰 Off-Peak Carbon Challenge

> 預測明日離峰時段、承諾搭乘、結算獎勵。
> Predict tomorrow's off-peak window, pledge to ride, settle your reward.

| 步驟 Step | 操作 Action | 預期畫面 Expected |
|-----------|-------------|-------------------|
| 1 | 點底部 Tab 1（🏔️ 離峰） | 首頁顯示今日離峰時段與餘額 |
| 2 | 點「Game A — 離峰承諾」→ 輸入賭注金額 → 送出 | 「已承諾」標章出現 |
| 3 | 點「Game B — 預測猜測」→ 選擇時段等級 → 送出 | 確認畫面顯示預測結果 |
| 4 | 點畫面右下角模擬閘口按鈕 | 結算 Overlay 展開，顯示得分明細 |

---

### Module 2 — 盲盒旅行 Blind Box Travel

> 花點數買神秘目的地盲盒，抵達後打卡兌換商家優惠。
> Spend points on a mystery destination box, check in at the station, redeem merchant discounts.

| 步驟 Step | 操作 Action | 預期畫面 Expected |
|-----------|-------------|-------------------|
| 1 | 點底部 Tab 2（🎁 盲盒） | 顯示盲盒卡片與「解鎖旅程」按鈕 |
| 2 | 點「解鎖旅程」→ 確認扣點 | 3D 盲盒翻轉動畫，揭露目的地 |
| 3 | 點「模擬進站打卡」 | 驗證成功畫面 |
| 4 | 點「前往商家打卡」→ 點「掃描驗證」 | 商家驗證成功，顯示優惠卡 |
| 5 | 點「領取獎勵」 | 慶祝動畫，點數回饋至錢包 |

---

### Module 3 — 夢幻特權 Dream Privilege

> 累積里程解鎖會員等級，享受點數加成倍率。
> Accumulate mileage to unlock membership tiers and earn point multipliers.

| 步驟 Step | 操作 Action | 預期畫面 Expected |
|-----------|-------------|-------------------|
| 1 | 點底部 Tab 3（👑 特權） | 盾牌卡顯示當前等級、EXP 進度條 |
| 2 | 查看「當前特權」卡片 | 顯示當前倍率（如 1.2× 白銀） |
| 3 | 查看「下一等級特權」卡片 | 顯示升級需求與下一倍率 |
| 4 | 回到 Module 1 結算（Module 1 Step 4）後再切回此頁 | 若升級，解鎖動畫自動播放一次 |

---

### Module 4 — 城市 RPG 解鎖 City RPG Unlock

> 在冒險地圖上探索台北各區，集滿站點觸發區域解鎖。
> Explore Taipei districts on an adventure map; collect station visits to unlock regions.

| 步驟 Step | 操作 Action | 預期畫面 Expected |
|-----------|-------------|-------------------|
| 1 | 點底部 Tab 4（🗺️ 城市RPG） | 6 個區域卡片，顯示各區解鎖進度 |
| 2 | 點「信義探險區」（預設 3/4 已造訪） | 進入區域詳細頁，站點清單顯示 ✓ / ○ |
| 3 | 點「模擬進站 — 國父紀念館」 | 進度條推進至 4/4，解鎖動畫爆發 |
| 4 | 確認「已解鎖」標章出現、點數 +50 | 動畫消失後按鈕變灰（不可重複觸發）|
| 5 | 點「← 返回」 | 冒險地圖更新，信義區亮起 ✓ |

---

## 本機執行 Local Development

### 環境需求 Prerequisites

- Node.js ≥ 18（建議 v22）
- npm ≥ 9

### 步驟 Steps

```bash
# 1. Clone repo
git clone https://github.com/xxxthepaulxxx/metro-play.git
cd metro-play

# 2. 安裝前端依賴 Install frontend dependencies
cd frontend
npm install

# 3. 啟動開發伺服器 Start dev server
npm run dev
```

瀏覽器開啟 **http://localhost:5173**

Browser opens at **http://localhost:5173**

### 其他指令 Other Commands

```bash
# 執行全套 CI 檢查（biome lint + tsc + vitest）
# Run full CI checks (biome lint + tsc + vitest)
npm run ci-checks

# 建置正式版本 Production build
npm run build
```

---

## 技術架構 Technical Architecture

### 技術棧 Stack

| 層次 Layer | 技術 Technology |
|------------|-----------------|
| UI 框架 Framework | Vue 3 (Composition API + `<script setup>`) |
| 路由 Router | Vue Router 4 |
| 狀態管理 State | Pinia + `pinia-plugin-persistedstate` |
| 建置工具 Build | Vite 6 |
| 語言 Language | TypeScript (strict) |
| Lint / Format | Biome |
| 單元測試 Unit Tests | Vitest + @vue/test-utils |
| E2E 測試 E2E Tests | Playwright |

### 目錄結構 Directory Structure

```
metro-play/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── mockApi.ts        # 模擬 API（含延遲） Simulated API with delays
│   │   │   └── mockData.ts       # 靜態資料 Static data (districts, destinations…)
│   │   ├── components/           # 共用元件 Shared components
│   │   ├── stores/               # Pinia stores（每模組一份）Per-module stores
│   │   ├── views/
│   │   │   ├── off-peak/         # Module 1
│   │   │   ├── blind-box/        # Module 2
│   │   │   ├── privileges/       # Module 3
│   │   │   └── rpg/              # Module 4
│   │   ├── styles/
│   │   │   └── tokens.css        # 設計系統 CSS 變數 Design system CSS tokens
│   │   ├── router/index.ts       # 路由設定 Route definitions
│   │   └── App.vue               # 根元件 + 底部 Tab Bar
│   └── scripts/
│       └── ci-checks.sh          # 單一 CI 腳本 Single CI gate script
├── e2e/
│   └── tests/                    # Playwright E2E 規格 E2E specs (per module)
└── docs/
    ├── architecture-decision-record/   # ADR 決策記錄
    ├── critical-path/                  # Gherkin 驗收場景 Acceptance scenarios
    └── design-system/                  # 設計規範 Design specs + tokens
```

### 狀態持久化 State Persistence

每個模組的 Pinia store 皆透過 `pinia-plugin-persistedstate` 自動同步至 `localStorage`，重新整理頁面不會遺失遊戲進度。`Set<string>` 型別（如已造訪站點 ID）使用自訂 serializer 轉為 JSON 陣列。

Each module's Pinia store is automatically synced to `localStorage` via `pinia-plugin-persistedstate`, so game progress survives page refreshes. `Set<string>` fields (e.g. visited station IDs) use a custom serializer to convert to/from JSON arrays.

### 設計系統 Design System

全站使用 CSS 自訂屬性（`tokens.css`）統一視覺語言：

- 背景：固定斜向漸層 `#0070BD → #00A86B`
- 卡片：Glassmorphism（`rgba(255,255,255,0.15)` + `blur(12px)`）
- 每模組一個主色調 Accent per module:
  - Module 1 Off-Peak：Purple `#7C3AED`
  - Module 2 Blind Box：Teal `#00BCD4`
  - Module 3 Privilege：Rose `#E91E63`
  - Module 4 RPG：Amber `#FF8F00`

The entire app uses CSS custom properties (`tokens.css`) for visual consistency. Each module has a dedicated accent color, layered on a shared glassmorphism card system.

---

## 測試覆蓋 Test Coverage

```
Test Files  25 passed
Tests       168 passed
```

- **Unit tests** — 每個元件與 store 皆有對應測試 Every component and store is covered
- **E2E specs** — 對應 critical path 的 5 個 Gherkin Scenario Covers all 5 Gherkin scenarios across the 4 modules

---

*黑客松作品 · Hackathon submission*
