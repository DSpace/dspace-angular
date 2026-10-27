/**
 * Resolução do endpoint e das opções da síntese por IA.
 *
 * Funções puras (testáveis sem `TestBed`), no mesmo molde de
 * `pipeline-status.config`. A configuração da aplicação é lida de forma
 * **estrutural**, sem importar o tipo `AppConfig`: assim esta pasta compila numa
 * instalação que não declarou a seção `aiSummary` — ela cai nos defaults.
 */

import { EVIDENCIA_API_BASE } from './host';

export interface AiSummaryConfig {
  /** A aba fica visível? */
  enabled: boolean;
  /** Base da API. Pode incluir prefixo de path. */
  baseUrl: string;
  /** Caminho do endpoint de síntese, concatenado a `baseUrl`. */
  summarizePath: string;
  /** Teto da requisição. A síntese passa por um LLM, então é lenta por natureza. */
  timeoutMs: number;
  /** Quantas evidências a API deve considerar ao sintetizar. */
  limit: number;
  /**
   * Quantas evidências por documento quando a síntese é restrita a uma seleção
   * da lista de resultados. Ali o `limit` deixa de ser o total e passa a ser o
   * `k` de cada documento — dez trechos de cada um de cinco relatórios é mais
   * evidência do que o LLM precisa (e do que a janela comporta).
   */
  limitPerDocument: number;
  /**
   * Teto de documentos numa síntese por seleção. Espelha o `SUMMARY_MAX_DOCUMENTS`
   * da API (20 por padrão): acima disso ela responde 422 já na validação, antes de
   * consultar o índice — são N consultas ao Qdrant numa requisição síncrona.
   */
  maxDocuments: number;
}

/**
 * Defaults. Ao contrário do painel de infraestrutura — que aponta para a própria
 * origem — aqui o host já vem do `EVIDENCIA_API_BASE`, a mesma constante que a
 * ingestão usa: a síntese mora no mesmo serviço, e `config/config.prod.yml` não é
 * versionado, então depender dele para o host tornaria a feature invisível numa
 * instalação nova. Quem precisar de outro host declara a seção `aiSummary`.
 *
 * `enabled: true` porque `GET /api/search/summarize` já está publicado na API. Uma
 * instalação sem o endpoint desliga a aba pela seção `aiSummary` do config.
 *
 * `timeoutMs` folgado de propósito: medido contra a API publicada, uma síntese com
 * `limit: 10` leva ~13s (recuperação no Qdrant + inferência do LLM). Um teto de
 * 20s cortaria a resposta sempre que a GPU estivesse ocupada com a ingestão.
 */
export const AI_SUMMARY_DEFAULTS: Readonly<AiSummaryConfig> = {
  enabled: true,
  baseUrl: EVIDENCIA_API_BASE,
  summarizePath: '/api/search/summarize',
  timeoutMs: 45000,
  limit: 10,
  limitPerDocument: 5,
  maxDocuments: 20,
};

/**
 * Faixa que a API aceita em `limit` (`ge=1, le=20` nas duas rotas). Um valor fora
 * dela é 422 na validação — erro fatal, sem "tentar de novo", com uma mensagem que
 * não diz que o problema está no `config.yml`. Melhor prender aqui.
 */
const LIMIT_MIN = 1;
const LIMIT_MAX = 20;

function clampLimit(value: number): number {
  return Math.min(Math.max(Math.trunc(value), LIMIT_MIN), LIMIT_MAX);
}

/** Overrides pontuais (vindos dos `@Input`); `null`/`undefined` = "não opinou". */
export type AiSummaryOverrides = Partial<Record<keyof AiSummaryConfig, unknown>>;

/** Nome da seção esperada no `AppConfig` da aplicação hospedeira. */
const CONFIG_SECTION = 'aiSummary';

function readSection(appConfig: unknown): Record<string, unknown> {
  if (appConfig === null || typeof appConfig !== 'object') {
    return {};
  }
  const section = (appConfig as Record<string, unknown>)[CONFIG_SECTION];
  return section !== null && typeof section === 'object' ? section as Record<string, unknown> : {};
}

function pickString(...candidates: unknown[]): string | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate.trim();
    }
  }
  return null;
}

function pickNumber(...candidates: unknown[]): number | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }
  }
  return null;
}

function pickBoolean(...candidates: unknown[]): boolean | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'boolean') {
      return candidate;
    }
  }
  return null;
}

/**
 * Cascata de precedência, campo por campo:
 * `@Input` → `AppConfig.aiSummary` → `AI_SUMMARY_DEFAULTS`.
 *
 * Um campo ausente num nível não apaga os demais: uma seção de config pela metade
 * continua válida.
 */
export function resolveAiSummaryConfig(
  appConfig: unknown,
  overrides: AiSummaryOverrides = {},
): AiSummaryConfig {
  const section = readSection(appConfig);
  return {
    enabled: pickBoolean(overrides.enabled, section.enabled) ?? AI_SUMMARY_DEFAULTS.enabled,
    baseUrl: pickString(overrides.baseUrl, section.baseUrl) ?? AI_SUMMARY_DEFAULTS.baseUrl,
    summarizePath: pickString(overrides.summarizePath, section.summarizePath) ?? AI_SUMMARY_DEFAULTS.summarizePath,
    timeoutMs: pickNumber(overrides.timeoutMs, section.timeoutMs) ?? AI_SUMMARY_DEFAULTS.timeoutMs,
    limit: clampLimit(pickNumber(overrides.limit, section.limit) ?? AI_SUMMARY_DEFAULTS.limit),
    limitPerDocument: clampLimit(
      pickNumber(overrides.limitPerDocument, section.limitPerDocument) ?? AI_SUMMARY_DEFAULTS.limitPerDocument,
    ),
    maxDocuments: pickNumber(overrides.maxDocuments, section.maxDocuments) ?? AI_SUMMARY_DEFAULTS.maxDocuments,
  };
}

/**
 * Junta base e caminho **por string**. `new URL(path, base)` descartaria um prefixo
 * de path da base (`new URL('/api/search/summarize', 'https://h/pipe/')` →
 * `https://h/api/search/summarize`), o que quebraria instalações que servem a API
 * sob um prefixo.
 */
export function aiSummaryEndpoint(config: AiSummaryConfig): string {
  const base = config.baseUrl.replace(/\/+$/, '');
  const path = config.summarizePath.startsWith('/') ? config.summarizePath : `/${config.summarizePath}`;
  return `${base}${path}`;
}
