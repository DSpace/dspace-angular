---
name: deploy-prod
description: Publica o evidencia-ui (DSpace Angular SSR) em produção em rdapp.comais.uft.edu.br — build em pasta separada, troca de pastas, restart no pm2 e build anterior guardado para rollback. Também faz o rollback.
disable-model-invocation: true
---

# Deploy de produção do evidencia-ui

Produção roda **neste servidor**: nginx (`/etc/nginx/sites-available/dspace`) →
`localhost:4000` → pm2 `evidencia-ui` → `node dist/server/main`, com cwd em
`/opt/evidencia-dspace-angular`. O `server.ts` resolve `dist/browser` relativo ao
cwd, por isso trocar a pasta `dist` e reiniciar basta.

## Deploy

```bash
.claude/skills/deploy-prod/deploy.sh
```

Rode em background (`run_in_background`): o build leva vários minutos.
Como o script pede confirmação antes da troca, em execução não interativa use
`--yes` **somente depois** de mostrar ao usuário a lista de mudanças e ele confirmar.

O script:
1. lista os arquivos de `src/` alterados desde o build em produção e o `git status`
   — **o build usa a árvore de trabalho, com o que não foi commitado**;
2. compila em `dist-next/` enquanto o site segue servindo `dist/`;
3. confere o build (`index.html`, `main.*.js`, `server/main.js`);
4. troca `dist` → `dist-prev-<timestamp>` e `dist-next` → `dist`, e reinicia o pm2;
5. faz health check local e no domínio; se falhar, **volta sozinho** ao build anterior.

## Antes de rodar

- Confirme com o usuário: é produção. Aprovação de um deploy não vale para o próximo.
- Rode os testes do que mudou (Karma precisa de Chrome com `--no-sandbox` como root:
  aponte `CHROME_BIN` para um wrapper `exec <chrome> --no-sandbox "$@"`).
- Se a lista de mudanças trouxer arquivos que não são do trabalho atual, pergunte.

## Depois

- Valide o fluxo alterado no domínio real (ex.: Playwright headless em
  `https://rdapp.comais.uft.edu.br/...`), não só o HTTP 200.
- Informe o caminho do backup e o comando de rollback.
- Não apague `dist-prev-*` por conta própria; só liste e sugira.

## Rollback

```bash
.claude/skills/deploy-prod/rollback.sh                 # o dist-prev-* mais recente
.claude/skills/deploy-prod/rollback.sh dist-prev-XXXX  # um específico
```

## Armadilhas conhecidas

- `dist-next/browser` não tem `assets/config.json` nem `rdapp-theme.<hash>.css`:
  ambos são gerados pelo servidor na inicialização. Não é build incompleto.
- O `evidencia-ui-error.log` do pm2 vive cheio de `URL with hostname "_" is not
  allowed` (requisições no `server_name _` do nginx). É antigo e não indica falha
  do deploy — procure erros **novos** após o restart.
- Não use `npm run build:prod` direto: ele escreve por cima de `dist/` enquanto o
  site está servindo dela.
