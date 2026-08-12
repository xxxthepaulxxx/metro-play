#!/usr/bin/env bash
set -euo pipefail

# Diff-scoped mutation testing via Stryker.
# Usage: bash scripts/mutation.sh [base-ref]
# Example: bash scripts/mutation.sh origin/main

BASE_REF="${1:-origin/main}"
cd "$(dirname "$0")/.."

echo "=== stryker run (diff vs ${BASE_REF}) ==="
npx stryker run --since "${BASE_REF}"
