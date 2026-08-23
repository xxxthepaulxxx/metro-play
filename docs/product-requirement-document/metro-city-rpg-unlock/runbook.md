# City RPG Unlock — Dev Setup & Hackathon Demo Runbook

## DEV SETUP

### Prerequisites
- Node.js LTS
- pnpm

### Install & Run
```bash
cd frontend
pnpm install
pnpm dev
```

App runs on http://localhost:5173. Navigate to "城市RPG" tab (tab 4).

### File Locations

| Purpose | Path |
|---------|------|
| Store | frontend/src/stores/cityRpg.ts |
| Mock data (DISTRICTS) | frontend/src/api/mockData.ts |
| Mock API functions | frontend/src/api/mockApi.ts |
| Map view | frontend/src/views/cityRpg/CityRpgMapView.vue |
| District detail view | frontend/src/views/cityRpg/DistrictDetailView.vue |
| District card | frontend/src/views/cityRpg/DistrictCard.vue |
| Detail card | frontend/src/views/cityRpg/DistrictDetailCard.vue |
| Unlock animation | frontend/src/views/cityRpg/UnlockBurstAnimation.vue |
| Router | frontend/src/router/index.ts |
| Design tokens | frontend/src/styles/tokens.css |

---

## MOCK DATA SEEDING

### Fresh State (default)
On first load: visitedStationIds empty, claimedDistrictBonuses empty, wallet 500. All districts show 0/N.

### Pre-seeded Demo State
Run in browser console before navigating to /rpg:
```javascript
localStorage.setItem('city-rpg-store', JSON.stringify({
  visitedStationIds: [
    "xinyi-city-hall", "xinyi-101", "xinyi-xiangshan",   // 3/4 Xinyi — UNLOCKED
    "zhongshan-zhongshan", "zhongshan-shuanglian",       // 2/5 Zhongshan — locked
    "beitou-beitou", "beitou-xinbeitou"                   // 2/3 Beitou — UNLOCKED
  ],
  claimedDistrictBonuses: ["xinyi", "beitou"]
}));
const ws = JSON.parse(localStorage.getItem('wallet-store') || '{}');
ws.balance = (ws.balance || 500) + 200;
localStorage.setItem('wallet-store', JSON.stringify(ws));
```
After refresh: Xinyi and Beitou glow amber (unlocked), Zhongshan 2/5 (locked), others 0/N.

### Reset to Clean State
```javascript
localStorage.removeItem('city-rpg-store');
location.reload();
```

---

## HACKATHON DEMO WALKTHROUGH

**Target:** under 60 seconds for Module 4 portion of the 3-minute overall demo.

### Step-by-step from pre-seeded state

1. **Open app → click "🗺️ 城市RPG" tab**
   - Judges see: 6 districts, Xinyi + Beitou glow amber (unlocked), others dimmed, progress bar ~30%

2. **Tap Xinyi (信義) card → show unlocked district detail**
   - Judges see: 3/4 stations checked, bonus already claimed

3. **Go back → tap Zhongshan (中山) card**
   - Judges see: 2/5 stations, 3 have "模擬進站" button

4. **Tap "模擬進站" on one unvisited station**
   - 400ms loading → station gets checkmark → progress 3/5 → threshold 3 reached
   - UnlockBurstAnimation fires immediately: amber glow ring + scale bounce + "+100 points!"
   - Wallet balance +100

5. **Go back to map**
   - Judges see: Zhongshan now glows amber, progress bar updated

6. **Switch to next module tab to continue demo**

### Talking Points for Presenter

- "Each MRT station visit is tracked. Visit enough stations in a district to unlock a bonus reward."
- "The unlock animation fires instantly — no server round-trip."
- "Progress persists across page refreshes via localStorage."
- "This gamifies real-world MRT usage — more you ride, more districts you unlock."

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Tab 4 shows placeholder | Router not updated — check /rpg route was added |
| No districts shown | DISTRICTS constant missing from mockData.ts |
| Unlock animation never fires | Check visitStation returns { newlyUnlocked: true } and DistrictDetailView sets showBurst = true |
| Progress resets on refresh | Custom serializer not configured for Set<->Array |
| Wallet unchanged after unlock | Check useWalletStore().credit() call in visitStation action |
