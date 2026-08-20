import { HttpErrorResponse } from '@angular/common/http';

/**
 * Estados que cada fonte de dados da aba de ingestão pode assumir. Cada seção é
 * independente: uma API fora do ar leva a seção dela para `error`/`unavailable`
 * sem afetar as demais.
 */
export type SectionStatus =
  /** Ainda não iniciada (API secundária adiada até a seção ficar visível). */
  | 'idle'
  /** Carregamento inicial, sem dados na tela. */
  | 'loading'
  /** Atualização em andamento, com dados anteriores ainda visíveis. */
  | 'refreshing'
  /** Sucesso com conteúdo. */
  | 'success'
  /** Sucesso sem conteúdo (a fonte respondeu, mas não há jobs). */
  | 'empty'
  /** Erro sem dados anteriores: nada a exibir. */
  | 'error'
  /** Erro com dados anteriores: exibição parcial/desatualizada. */
  | 'partial'
  /** Erro definitivo (permissão/endpoint): não vale reconectar. */
  | 'unavailable';

/** Erro de uma fonte, já traduzido para uma chave i18n com próximo passo. */
export interface SectionError {
  /** Status HTTP; 0 = falha de rede/CORS. */
  status: number;
  /** Chave i18n da mensagem (inclui o que fazer em seguida). */
  key: string;
  /** Se vale a pena tentar reconectar automaticamente. */
  retryable: boolean;
}

/** Estado completo de uma fonte de dados. */
export interface SectionState<T> {
  status: SectionStatus;
  /** Último payload bem-sucedido; preservado durante refresh e erro (dados parciais). */
  data: T | null;
  error: SectionError | null;
  /** Momento da última resposta bem-sucedida. */
  lastUpdated: Date | null;
  /** Falhas consecutivas (base do backoff). */
  attempts: number;
  /** Segundos restantes para a próxima tentativa automática. */
  retryInSeconds: number | null;
}

const ERROR_KEY_PREFIX = 'health-page.ingestion.state.error.';

/** Mensagem por status HTTP. Os demais caem em `unknown`. */
const ERROR_KEY_BY_STATUS: Record<number, string> = {
  0: `${ERROR_KEY_PREFIX}offline`,
  400: `${ERROR_KEY_PREFIX}bad-request`,
  401: `${ERROR_KEY_PREFIX}unauthorized`,
  403: `${ERROR_KEY_PREFIX}forbidden`,
  404: `${ERROR_KEY_PREFIX}notfound`,
  408: `${ERROR_KEY_PREFIX}timeout`,
  409: `${ERROR_KEY_PREFIX}conflict`,
  422: `${ERROR_KEY_PREFIX}unprocessable`,
  429: `${ERROR_KEY_PREFIX}throttled`,
  500: `${ERROR_KEY_PREFIX}server`,
  502: `${ERROR_KEY_PREFIX}gateway`,
  503: `${ERROR_KEY_PREFIX}gateway`,
  504: `${ERROR_KEY_PREFIX}timeout`,
};

/** Erros que não melhoram com nova tentativa: a seção fica "indisponível". */
const FATAL_STATUSES = [400, 401, 403, 404, 405, 422];

/** Primeiro intervalo de reconexão, em segundos. */
export const BASE_RETRY_SECONDS = 5;
/** Teto do backoff exponencial, em segundos. */
export const MAX_RETRY_SECONDS = 60;

export function idleSectionState<T>(): SectionState<T> {
  return {
    status: 'idle',
    data: null,
    error: null,
    lastUpdated: null,
    attempts: 0,
    retryInSeconds: null,
  };
}

/** Extrai o status HTTP de um erro desconhecido (0 quando não houver). */
export function errorStatus(err: unknown): number {
  const status = (err as HttpErrorResponse | null)?.status;
  return typeof status === 'number' && status > 0 ? status : 0;
}

/** Converte um erro HTTP no `SectionError` exibido pela seção. */
export function toSectionError(err: unknown): SectionError {
  const status = errorStatus(err);
  return {
    status,
    key: ERROR_KEY_BY_STATUS[status] ?? `${ERROR_KEY_PREFIX}unknown`,
    retryable: !FATAL_STATUSES.includes(status),
  };
}

/** Backoff exponencial com teto: 5s, 10s, 20s, 40s, 60s… */
export function retryDelaySeconds(attempts: number): number {
  const exponent = Math.max(0, attempts - 1);
  return Math.min(MAX_RETRY_SECONDS, BASE_RETRY_SECONDS * Math.pow(2, exponent));
}

/** Há dados anteriores para exibir (mesmo em erro). */
export function hasData<T>(state: SectionState<T>): boolean {
  return state.data !== null;
}

/** Uma requisição está em andamento. */
export function isBusy<T>(state: SectionState<T>): boolean {
  return state.status === 'loading' || state.status === 'refreshing';
}
