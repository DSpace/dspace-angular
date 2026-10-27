/**
 * Vocabulário de apresentação da síntese por IA: prefixo i18n e a tradução de um
 * erro em chave de mensagem.
 *
 * Mesma divisão de responsabilidade do painel de infraestrutura — o serviço
 * classifica a falha, a camada de apresentação escolhe o texto.
 */

import { AiSummaryError } from './ai-summary.service';

/** Prefixo de todas as chaves i18n deste painel. */
export const I18N = 'evidencia.search.ai-summary';

/**
 * Mensagem específica por status HTTP; o resto cai na genérica. Cada mensagem
 * explica a causa **e** o próximo passo, como as chaves da aba de ingestão.
 */
const HTTP_ERROR_KEYS: Record<number, string> = {
  400: `${I18N}.error.bad-request`,
  401: `${I18N}.error.unauthorized`,
  403: `${I18N}.error.forbidden`,
  404: `${I18N}.error.notfound`,
  408: `${I18N}.error.timeout`,
  422: `${I18N}.error.unprocessable`,
  429: `${I18N}.error.throttled`,
  500: `${I18N}.error.server`,
  502: `${I18N}.error.gateway`,
  503: `${I18N}.error.gateway`,
  504: `${I18N}.error.timeout`,
};

/**
 * Erros em que insistir não adianta: a síntese fica **indisponível** em vez de
 * oferecer "tentar de novo".
 *
 * `404` é o caso que interessa hoje — a API publicada ainda não tem
 * `/api/search/summarize`, e é ele que faz a aba se esconder sozinha mesmo com a
 * configuração ligada por engano.
 */
const FATAL_STATUSES: readonly number[] = [400, 401, 403, 404, 405, 422];

/** Chave i18n da mensagem de erro. */
export function aiSummaryErrorKey(error: AiSummaryError | null): string {
  if (error === null) {
    return '';
  }
  if (error.kind === 'http') {
    return HTTP_ERROR_KEYS[error.status] ?? `${I18N}.error.http`;
  }
  return `${I18N}.error.${error.kind}`;
}

/** Vale oferecer nova tentativa para este erro? */
export function isRetryable(error: AiSummaryError | null): boolean {
  return error !== null && !FATAL_STATUSES.includes(error.status);
}

/**
 * O endpoint não existe nesta instalação? Nesse caso a aba some, em vez de ficar
 * exibindo erro a cada abertura.
 */
export function isUnavailable(error: AiSummaryError | null): boolean {
  return error !== null && error.kind === 'http' && (error.status === 404 || error.status === 501);
}
