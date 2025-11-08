#!/usr/bin/env bash
set -euo pipefail

if command -v npx >/dev/null 2>&1; then
  echo "Gerando índice de busca com Pagefind..."
  npx pagefind --site dist
else
  echo "npx não encontrado; pulei Pagefind."
fi