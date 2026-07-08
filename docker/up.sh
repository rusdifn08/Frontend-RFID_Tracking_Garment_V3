#!/usr/bin/env bash
set -euo pipefail
ENV="${1:-cln}"
case "$ENV" in
  cln|mjl|mjl2|gcc) ;;
  *)
    echo "Usage: $0 [cln|mjl|mjl2|gcc]" >&2
    exit 1
    ;;
esac
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
docker compose --env-file ".env.docker.${ENV}" up -d --build
