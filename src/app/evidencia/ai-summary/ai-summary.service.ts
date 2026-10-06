import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Observable,
  of,
  throwError,
  TimeoutError,
} from 'rxjs';
import {
  catchError,
  mergeMap,
  shareReplay,
  tap,
  timeout,
} from 'rxjs/operators';

import {
  AI_SUMMARY_DEFAULTS,
  aiSummaryEndpoint,
  resolveAiSummaryConfig,
} from './ai-summary.config';
import {
  AiSummaryResponse,
  isAiSummaryPayload,
  normalizeAiSummary,
} from './ai-summary.model';
import {
  AI_SUMMARY_STORAGE_KEYS,
  readStored,
  writeStored,
} from './ai-summary.storage';
import { APP_CONFIG } from './host';

/** Endpoint com a configuração padrão; o real é resolvido por chamada. */
export const AI_SUMMARY_ENDPOINT = aiSummaryEndpoint(AI_SUMMARY_DEFAULTS);

/** A síntese passa por um LLM: teto generoso, igual ao do painel de status. */
export const AI_SUMMARY_TIMEOUT_MS = AI_SUMMARY_DEFAULTS.timeoutMs;

/** Os dois modos de síntese do painel. */
export type AiSummaryMode = 'basic' | 'by_section';

/** Por que a consulta falhou — a UI mostra mensagens diferentes para cada caso. */
export type AiSummaryErrorKind = 'network' | 'http' | 'timeout' | 'invalid';

export interface AiSummaryError {
  kind: AiSummaryErrorKind;
  /** Status HTTP quando houver; 0 em falha de rede/CORS. */
  status: number;
}

/**
 * Um documento escolhido na lista de resultados. Com pelo menos um deles a
 * síntese deixa de varrer o acervo inteiro e passa a olhar só o que foi marcado.
 */
export interface AiSummaryDocument {
  /** UUID do item DSpace. É o que a API usa para achar os chunks. */
  uuid: string;
  /** Handle do item; a API aceita como alternativa ao UUID. `null` quando não se sabe. */
  handle: string | null;
}

/**
 * O que identifica uma síntese. São exatamente os campos que entram na chave de
 * cache: mudou qualquer um deles, é outra síntese.
 */
export interface AiSummaryParams {
  /** Consulta do usuário. */
  query: string;
  /** Modo de recuperação, espelhando o da busca (`hybrid`/`dense`/`sparse`). */
  searchType?: string;
  /** Síntese geral ou por seção do relatório. */
  mode: AiSummaryMode;
  /** Idioma pedido para o texto gerado (ex.: `pt-BR`). */
  language: string;
  /** Filtros facetados repassados à API, no formato dela. */
  filters?: Record<string, string>;
  /**
   * Documentos marcados na lista de resultados. Vazio = síntese sobre a busca
   * toda, que é o caminho `GET` de sempre; com seleção a chamada vira `POST` e a
   * API restringe a recuperação a esses documentos.
   */
  documents?: AiSummaryDocument[];
}

/**
 * Cliente de `/api/search/summarize`, nos dois modos que a API expõe:
 * `GET` para sintetizar a busca inteira e `POST` para restringir a síntese aos
 * documentos marcados na lista de resultados.
 *
 * Só transporte: valida o formato da resposta, classifica a falha e guarda o
 * resultado na sessão. Nenhuma regra de apresentação — quem escolhe mensagem e
 * layout é o componente.
 *
 * **Rota pública**: não exige sessão DSpace. Vale registrar, porém, que este
 * frontend não filtra header por host — o `AuthInterceptor` anexa o Bearer do
 * DSpace a qualquer destino e o `XsrfInterceptor` força `withCredentials` — então
 * a chamada sai com credenciais, como já acontece com `/api/files` e
 * `/api/search/semantic`. O CORS da API já aceita essa origem com credenciais.
 */
@Injectable({ providedIn: 'root' })
export class AiSummaryService {

  private readonly http = inject(HttpClient);
  /**
   * Opcional de propósito: a pasta funciona numa instalação que não provê
   * `APP_CONFIG` (e nos testes, que não o provêem).
   */
  private readonly appConfig = inject(APP_CONFIG, { optional: true });

  /**
   * Cache da sessão. Alternar entre "Resultados" e "Síntese por IA" não pode
   * disparar de novo uma chamada que custa uma inferência de LLM; enquanto
   * consulta, filtros, modo e idioma não mudarem, a resposta é a mesma.
   *
   * Guarda o **observable** (com `shareReplay`), não o valor: duas aberturas quase
   * simultâneas compartilham uma requisição só.
   */
  private readonly cache = new Map<string, Observable<AiSummaryResponse>>();

  /**
   * Configuração resolvida uma vez: o app config não muda em tempo de execução, e
   * `enabled` é consultado a cada verificação de mudanças do template.
   */
  private readonly config = resolveAiSummaryConfig(this.appConfig);

  /** A aba deve aparecer nesta instalação? */
  get enabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Quantos documentos a API aceita numa síntese por seleção. Acima disso ela
   * responde 422 na validação do corpo — o painel prefere avisar antes de gastar
   * a viagem.
   */
  get maxDocuments(): number {
    return this.config.maxDocuments;
  }

  summarize(params: AiSummaryParams): Observable<AiSummaryResponse> {
    const key = cacheKey(params);
    const cached = this.cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    // Depois de um F5 o `Map` volta vazio, mas a resposta pode ter sobrevivido
    // no `sessionStorage`: servi-la de lá poupa uma inferência inteira.
    const stored = readStoredResponse(key);
    if (stored !== null) {
      const stored$ = of(stored);
      this.cache.set(key, stored$);
      return stored$;
    }

    const config = this.config;
    const endpoint = aiSummaryEndpoint(config);
    const documents = readDocuments(params.documents);
    // Sem seleção o contrato é o de sempre (`GET` com query string); com seleção
    // a lista de documentos não caberia bem numa URL, e a API pede `POST`.
    const call$ = documents.length > 0
      ? this.http.post<unknown>(endpoint, buildBody(params, documents, config.limitPerDocument))
      : this.http.get<unknown>(endpoint, { params: buildParams(params, config.limit) });

    const request$ = call$.pipe(
      timeout(config.timeoutMs),
      mergeMap((payload: unknown) => isAiSummaryPayload(payload)
        ? of(normalizeAiSummary(payload))
        // Resposta 200 com corpo inesperado (proxy, página de erro, HTML).
        : throwError(() => ({ kind: 'invalid', status: 200 } as AiSummaryError))),
      tap((response: AiSummaryResponse) => storeResponse(key, response)),
      catchError((err: unknown) => {
        // Erro não fica em cache: a próxima abertura da aba tenta de novo.
        this.cache.delete(key);
        return throwError(() => toAiSummaryError(err));
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.set(key, request$);
    return request$;
  }

  /** Descarta o que está guardado (usado pelo botão "Gerar de novo"). */
  forget(params: AiSummaryParams): void {
    const key = cacheKey(params);
    this.cache.delete(key);
    forgetStoredResponse(key);
  }
}

/**
 * Quantas sínteses ficam guardadas para o F5. Cada uma pesa dezenas de KB e a
 * cota do `sessionStorage` é de ~5 MB por origem, dividida com o resto do DSpace;
 * cinco cobrem ir e voltar entre as buscas recentes.
 */
export const AI_SUMMARY_STORED_RESPONSES = 5;

interface StoredResponse {
  key: string;
  response: AiSummaryResponse;
}

function readStoredResponses(): StoredResponse[] {
  const stored = readStored<StoredResponse[]>(AI_SUMMARY_STORAGE_KEYS.responses);
  return Array.isArray(stored) ? stored : [];
}

/**
 * A resposta guardada para `key`, se ainda tiver a forma que o painel espera. Um
 * deploy pode mudar o modelo entre o F5 e a leitura: melhor pedir de novo que
 * desenhar um objeto pela metade.
 */
function readStoredResponse(key: string): AiSummaryResponse | null {
  const response = readStoredResponses().find((entry: StoredResponse) => entry?.key === key)?.response;
  const usable = response !== undefined && response !== null
    && typeof response.summary === 'string'
    && Array.isArray(response.sections)
    && Array.isArray(response.citations)
    && Array.isArray(response.filtersUsed)
    && typeof response.evidenceCount === 'number';
  return usable ? response : null;
}

/** Guarda a resposta como a mais recente, descartando as mais antigas além do teto. */
function storeResponse(key: string, response: AiSummaryResponse): void {
  const others = readStoredResponses().filter((entry: StoredResponse) => entry.key !== key);
  writeStored(
    AI_SUMMARY_STORAGE_KEYS.responses,
    [...others, { key, response }].slice(-AI_SUMMARY_STORED_RESPONSES),
  );
}

function forgetStoredResponse(key: string): void {
  writeStored(
    AI_SUMMARY_STORAGE_KEYS.responses,
    readStoredResponses().filter((entry: StoredResponse) => entry.key !== key),
  );
}

/**
 * Chave estável da síntese: o assunto (`subjectKey`) mais o modo. Mudou qualquer
 * um dos dois, é outra síntese e outra chamada.
 */
export function cacheKey(params: AiSummaryParams): string {
  return [
    subjectKey(params),
    params.mode,
  ].join('|');
}

/**
 * O que a síntese é **sobre**, sem o modo: consulta + filtros + idioma + tipo de
 * busca.
 *
 * Trocar de modo pede outra chamada — `cacheKey` muda —, mas continua falando da
 * mesma coisa. O painel usa isto para distinguir os dois casos: mudou o assunto,
 * a síntese anterior sai da tela; mudou só o modo, ela fica até a nova chegar,
 * em vez de a página perder mil pixels de altura no meio da leitura.
 */
export function subjectKey(params: AiSummaryParams): string {
  return [
    params.query.trim(),
    toApiSearchType(params.searchType) ?? '',
    params.language,
    serializeFilters(params.filters),
    serializeDocuments(params.documents),
  ].join('|');
}

/**
 * Os documentos selecionados em texto estável: sem repetição e ordenados, para
 * que marcar os mesmos itens em outra ordem não gere uma segunda chamada.
 */
function serializeDocuments(documents: AiSummaryDocument[] | undefined): string {
  return readDocuments(documents)
    .map((document: AiSummaryDocument) => document.uuid)
    .sort()
    .join(',');
}

/**
 * A seleção como a API a recebe: só documentos com UUID, sem repetição e na ordem
 * em que foram marcados.
 */
function readDocuments(documents: AiSummaryDocument[] | undefined): AiSummaryDocument[] {
  const seen = new Set<string>();
  const out: AiSummaryDocument[] = [];

  for (const document of documents ?? []) {
    const uuid = `${document?.uuid ?? ''}`.trim();
    // O mesmo item marcado duas vezes (paginação, item repetido na lista) não
    // vira duas entradas: a API contaria a evidência dele em dobro.
    if (uuid === '' || seen.has(uuid)) {
      continue;
    }
    seen.add(uuid);
    const handle = `${document.handle ?? ''}`.trim();
    out.push({ uuid, handle: handle === '' ? null : handle });
  }
  return out;
}

/**
 * Os filtros em texto estável: ordenados, para que a mesma seleção feita em
 * outra ordem não gere uma segunda chamada.
 */
function serializeFilters(filters: Record<string, string> | undefined): string {
  return Object.entries(filters ?? {})
    .filter(([, value]: [string, string]) => `${value}`.trim() !== '')
    .map(([key, value]: [string, string]) => `${key}=${`${value}`.trim()}`)
    .sort()
    .join('&');
}

/**
 * Traduz o tipo de busca do DSpace para o vocabulário da API de síntese.
 *
 * As duas pontas usam palavras diferentes para a mesma ideia: o frontend fala
 * `lexical`/`semantic`/`hybrid` (é o que está na URL da busca e nos rótulos da
 * tela), a API fala `hybrid`/`dense`/`sparse`. E ela não valida o campo: qualquer
 * palavra que não seja `hybrid` nem `sparse` cai no ramo **dense** do
 * `_query_points`. Mandar `lexical` cru, portanto, não dava erro nenhum — dava
 * uma recuperação densa, o oposto do que a tela dizia estar fazendo, e sem sinal
 * algum de que algo tinha se perdido no caminho.
 *
 * Palavra desconhecida vira `null` e o campo não vai: aí vale o default da API,
 * que é `hybrid`.
 */
/**
 * Traduz o modo do painel para o `focus` que a API de síntese entende.
 *
 * A API não tem campo `mode`: o que escolhe entre resumo geral e resumo de
 * recomendações é o `focus`, com três valores — `achados`, `recomendacoes` e
 * `ambas`. O painel mapeia seus dois botões assim: "Resumo geral" pede `achados`
 * (síntese dos chunks de achados), e "Resumo de recomendações" pede `recomendacoes`.
 */
export function toApiFocus(mode: AiSummaryMode): string {
  return mode === 'by_section' ? 'recomendacoes' : 'achados';
}

export function toApiSearchType(searchType: string | undefined): string | null {
  switch (searchType) {
    case 'hybrid':
      return 'hybrid';
    // Busca por significado: o lado denso do índice.
    case 'semantic':
      return 'dense';
    // Busca por palavra-chave: o lado esparso (os pesos lexicais do bge-m3).
    case 'lexical':
      return 'sparse';
    default:
      return null;
  }
}

/** Classifica um erro de consulta: rede, HTTP, timeout ou resposta inválida. */
export function toAiSummaryError(err: unknown): AiSummaryError {
  if (isAiSummaryError(err)) {
    return err;
  }
  if (err instanceof TimeoutError) {
    return { kind: 'timeout', status: 0 };
  }
  const status = err instanceof HttpErrorResponse ? err.status : 0;
  // status 0 = pedido nunca chegou (rede, DNS, CORS, servidor fora do ar).
  return status > 0 ? { kind: 'http', status } : { kind: 'network', status: 0 };
}

function isAiSummaryError(err: unknown): err is AiSummaryError {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const kind = (err as AiSummaryError).kind;
  return kind === 'network' || kind === 'http' || kind === 'timeout' || kind === 'invalid';
}

/**
 * Corpo do `POST`, usado quando há documentos marcados.
 *
 * Espelha o `GET` campo a campo — `q`, `limit`, `focus`, `language`, `type` e os
 * filtros — e acrescenta `documents`. Aqui `limit` é o `k` de **cada** documento,
 * não o total, que é por isso que ele vem de `limitPerDocument`.
 */
function buildBody(
  params: AiSummaryParams,
  documents: AiSummaryDocument[],
  limit: number,
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    q: params.query.trim(),
    limit,
    focus: toApiFocus(params.mode),
    language: params.language,
    // `handle` só entra quando se sabe qual é: mandar `null` faria a API validar
    // um campo que ela não precisa para achar o documento.
    documents: documents.map((document: AiSummaryDocument) => document.handle === null
      ? { uuid: document.uuid }
      : { uuid: document.uuid, handle: document.handle }),
  };

  const type = toApiSearchType(params.searchType);
  if (type !== null) {
    body.type = type;
  }
  for (const [key, value] of Object.entries(params.filters ?? {})) {
    if (`${value}`.trim() !== '') {
      body[key] = `${value}`.trim();
    }
  }
  return body;
}

function buildParams(params: AiSummaryParams, limit: number): HttpParams {
  let httpParams = new HttpParams()
    .set('q', params.query.trim())
    .set('limit', String(limit))
    .set('focus', toApiFocus(params.mode))
    .set('language', params.language);

  const type = toApiSearchType(params.searchType);
  if (type !== null) {
    httpParams = httpParams.set('type', type);
  }
  for (const [key, value] of Object.entries(params.filters ?? {})) {
    if (`${value}`.trim() !== '') {
      httpParams = httpParams.set(key, `${value}`.trim());
    }
  }
  return httpParams;
}
