#!/usr/bin/env bash
# Deploy ScanGo di server (jalankan dari /var/www/scango): bash deploy.sh [branch]
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

BRANCH="${1:-$(git branch --show-current 2>/dev/null || true)}"
BRANCH="${BRANCH:-deploy}"
SERVICE="${SCANGO_SERVICE:-scango}"
PORT="${SCANGO_PORT:-3100}"
WEB_GROUP="${SCANGO_WEB_GROUP:-www-data}"

step() { echo; echo "==> $1"; }

for cmd in git node npm curl; do
    command -v "$cmd" >/dev/null 2>&1 || { echo "Command tidak ditemukan: $cmd" >&2; exit 1; }
done
[ -f .env ] || { echo "File .env tidak ditemukan di $APP_DIR" >&2; exit 1; }

echo "ScanGo deploy | dir: $APP_DIR | branch: $BRANCH | node: $(node -v)"

step "Cek working tree"
if [ -n "$(git status --porcelain)" ]; then
    echo "  Ada perubahan lokal di server:"; git status --short
fi

step "Tarik kode terbaru"
git fetch origin "$BRANCH" --prune
git pull --ff-only origin "$BRANCH"

step "Install dependency (production)"
npm ci --omit=dev --no-audit --no-fund

step "Atur izin file"
sudo chgrp -R "$WEB_GROUP" "$APP_DIR"
sudo chmod 640 .env

step "Restart service $SERVICE"
sudo systemctl restart "$SERVICE"
sleep 2
sudo systemctl --no-pager --lines=5 status "$SERVICE" || true

step "Health check"
code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api-docs" || true)"
if [ "$code" = "200" ]; then
    echo "  OK: API merespons (HTTP $code)"
else
    echo "  GAGAL: API merespons HTTP $code. Cek: sudo journalctl -u $SERVICE -n 50" >&2
    exit 1
fi

echo
echo "Deploy ScanGo selesai. Commit: $(git log --oneline -1)"
