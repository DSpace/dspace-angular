#!/usr/bin/env bash
# Volta a produção para um build guardado pelo deploy.sh.
#
# Uso: .claude/skills/deploy-prod/rollback.sh [dist-prev-<timestamp>]
#   sem argumento: usa o dist-prev-* mais recente
set -euo pipefail

APP_DIR=/opt/evidencia-dspace-angular
PM2_NAME=evidencia-ui
STAMP=$(date +%Y%m%d-%H%M%S)

cd "$APP_DIR"

PREV=${1:-$(ls -d dist-prev-* 2>/dev/null | sort | tail -1)}
[ -n "$PREV" ] && [ -d "$PREV/browser" ] && [ -d "$PREV/server" ] \
  || { echo "ERRO: backup '$PREV' inexistente ou incompleto" >&2; ls -d dist-prev-* 2>/dev/null; exit 1; }

echo "==> Rollback: dist -> dist-rolledback-$STAMP, $PREV -> dist"
mv dist "dist-rolledback-$STAMP"
mv "$PREV" dist
pm2 restart "$PM2_NAME" --update-env >/dev/null

for _ in $(seq 1 20); do
  sleep 3
  if [ "$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: rdapp.comais.uft.edu.br' http://127.0.0.1:4000/)" = "200" ]; then
    echo "==> Produção respondendo (200). Build retirado em dist-rolledback-$STAMP/"
    exit 0
  fi
done
echo "ERRO: produção não respondeu 200 após o rollback — verifique 'pm2 logs $PM2_NAME'" >&2
exit 1
