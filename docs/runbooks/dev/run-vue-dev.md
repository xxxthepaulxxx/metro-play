# Dev Runbook: Run Vue Dev Server

**Audience:** Developer
**Trigger:** Any time a team member wants to start development on the Vue app

## Prerequisites

- Node.js 18+
- npm 9+

## Steps

### 1. Navigate to the Vue project root

```bash
cd metro-play-vue
```

### 2. Install dependencies (first time only)

```bash
npm install
```

### 3. Start dev server

```bash
npm run dev
```

### 4. Open browser at localhost

Navigate to `http://localhost:5173` in your browser.

### 5. Use hot module replacement

Hot module replacement is active — save any `.vue` file to see changes instantly. No manual refresh needed.

### 6. Reset demo state (if needed)

To reset the demo state:
1. Open browser DevTools
2. Go to **Application** tab
3. In the left sidebar, expand **localStorage**
4. Find the `off-peak-store` key and delete it
5. Refresh the page

## Verification Signal

The terminal should display:
```
VITE ready in Xms
Local: http://localhost:5173/
```

## Rollback

To stop the dev server, press `Ctrl+C` in the terminal.

## Related Documentation

- ADR-0001 — Vue 3 + Vite framework choice
- ADR-0002 — Pinia store for state management
