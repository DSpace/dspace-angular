#!/usr/bin/env bash
# Deploy do evidencia-ui (DSpace Angular SSR) sem derrubar o site durante o build.
#
#   1. build de produção em dist-next/ (o site segue servindo dist/)
#   2. confere se o build está completo
#   3. troca: dist -> dist-prev-<timestamp>, dist-next -> dist
#   4. pm2 restart evidencia-ui
#   5. health check local e no domínio; se falhar, rollback automático
#
# Uso: .claude/skills/deploy-prod/deploy.sh [--yes]
#   --yes  pula a confirmação antes da troca (a lista de mudanças é mostrada igual)
set -euo pipefail

APP_DIR=/opt/evidencia-dspace-angular
PM2_NAME=evidencia-ui
LOCAL_URL=http://127.0.0.1:4000/
PUBLIC_URL="https://rdapp.comais.uft.edu.br/search?query=educacao&searchType=lexical"
STAMP=$(date +%Y%m%d-%H%M%S)
LOG_DIR="$APP_DIR/deploy-logs"
LOG="$LOG_DIR/build-$STAMP.log"

cd "$APP_DIR"
mkdir -p "$LOG_DIR"

log() { printf '\n==> %s\n' "$*"; }
die() { printf '\nERRO: %s\n' "$*" >&2; exit 1; }

# --- pré-checagens ------------------------------------------------------------
pm2 describe "$PM2_NAME" >/dev/null 2>&1 || die "processo pm2 '$PM2_NAME' não existe"
[ -d dist/browser ] && [ -d dist/server ] || die "dist/ atual incompleta — nada para guardar como rollback"
[ -e dist-next ] && die "dist-next/ já existe (deploy anterior interrompido?). Confira e remova antes."

log "Arquivos de src/ alterados desde o build em produção ($(stat -c %y dist/browser | cut -d. -f1)):"
CHANGED=$(find src -newer dist/browser -type f ! -name '*.spec.ts' | sort)
if [ -z "$CHANGED" ]; then
  echo "  (nenhum — o build sairia igual ao atual)"
else
  echo "$CHANGED" | sed 's/^/  /'
fi
echo
echo "Atenção: o build usa a árvore de trabalho, incluindo mudanças não commitadas:"
git status --short | sed 's/^/  /'

# --- build ------------------------------------------------------------------
log "Build de produção em dist-next/ (log: $LOG)"
export NODE_ENV=production
if ! { npx ng build --configuration production --output-path dist-next/browser \
       && npx ng run dspace-angular:server:production --output-path dist-next/server; } >"$LOG" 2>&1; then
  tail -30 "$LOG"
  die "build falhou; produção intocada. dist-next/ ficou para inspeção."
fi

# --- verificação do build ---------------------------------------------------
# config.json e o rdapp-theme.<hash>.css NÃO saem do build: o server.ts os gera
# na inicialização (buildAppConfig / addThemeStyle). Não os procure aqui.
log "Verificando dist-next/"
[ -f dist-next/browser/index.html ] || die "dist-next/browser/index.html ausente"
ls dist-next/browser/main.*.js >/dev/null 2>&1 || die "bundle main.*.js ausente"
[ -f dist-next/server/main.js ] || die "dist-next/server/main.js ausente"
echo "  browser: $(find dist-next/browser -type f | wc -l) arquivos | atual: $(find dist/browser -type f | wc -l)"

if [ "${1:-}" != "--yes" ]; then
  read -r -p $'\nTrocar a produção agora? [s/N] ' ok
  [ "$ok" = "s" ] || [ "$ok" = "S" ] || die "cancelado; dist-next/ pronta, produção intocada."
fi

# --- troca + restart --------------------------------------------------------
PREV="dist-prev-$STAMP"
rollback() {
  printf '\nFALHA após a troca — rollback para %s\n' "$PREV" >&2
  mv dist "dist-failed-$STAMP"
  mv "$PREV" dist
  pm2 restart "$PM2_NAME" --update-env >/dev/null
  die "produção restaurada; build com problema em dist-failed-$STAMP/"
}

log "Troca: dist -> $PREV, dist-next -> dist; restart $PM2_NAME"
mv dist "$PREV"
mv dist-next dist
pm2 restart "$PM2_NAME" --update-env >/dev/null || rollback

# --- health check -----------------------------------------------------------
log "Health check"
ok=""
for _ in $(seq 1 20); do
  sleep 3
  if [ "$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: rdapp.comais.uft.edu.br' "$LOCAL_URL")" = "200" ]; then ok=1; break; fi
done
[ -n "$ok" ] || rollback
PUBLIC_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$PUBLIC_URL")
echo "  local: 200 | público: $PUBLIC_CODE"
[ "$PUBLIC_CODE" = "200" ] || rollback
[ -f dist/browser/assets/config.json ] || rollback

log "Deploy concluído"
echo "  log do build: $LOG"
echo "  rollback: .claude/skills/deploy-prod/rollback.sh $PREV"
echo "  backups guardados (apague os antigos quando não precisar mais):"
du -sh dist-prev-* 2>/dev/null | sed 's/^/    /'
