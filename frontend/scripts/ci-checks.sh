#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== biome ci ==="
npx biome ci --files-ignore-unknown=true .

echo "=== vue-tsc --noEmit ==="
npx vue-tsc --noEmit

echo "=== vitest run ==="
npx vitest run --passWithNoTests

echo "=== all checks passed ==="
