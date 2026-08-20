import { Params } from '@angular/router';

import {
  IngestionJob,
  JOB_STATUSES,
  normalizeStatus,
  STAGES,
} from './ingestion-stages';

/** Painéis colapsáveis da aba, na ordem em que aparecem. */
export const PANEL_KEYS = ['active', 'succeeded', 'failures', 'lookup'] as const;
export type PanelKey = typeof PANEL_KEYS[number];

/** Quais painéis estão abertos. */
export type OpenPanels = Record<PanelKey, boolean>;

/** Só o primeiro painel abre por padrão: as APIs dos outros nem são chamadas. */
export const DEFAULT_OPEN_PANELS: OpenPanels = {
  active: true,
  succeeded: false,
  failures: false,
  lookup: false,
};

/** Marcador para "todos fechados", que é diferente de "sem parâmetro na URL". */
const NO_PANELS = 'none';

/** Ordenação disponível (pelo campo `updated_at`). */
export type IngestionSort = 'recent' | 'oldest';

/** Filtros compartilhados pelas três listas — nomes e comportamento idênticos. */
export interface IngestionFilters {
  /** Busca textual (job id, arquivo, item, mensagem de erro). */
  q: string;
  /** Situação canônica; '' = todas. */
  status: string;
  /** Estágio do pipeline; '' = todos. */
  stage: string;
  sort: IngestionSort;
}

export const DEFAULT_FILTERS: IngestionFilters = {
  q: '',
  status: '',
  stage: '',
  sort: 'recent',
};

/** Tamanhos de página. Teto de 50 para nunca renderizar listas longas de uma vez. */
export const PAGE_SIZES = [10, 25, 50];
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Limites pedidos à API. A API de ingestão só aceita `limit` (sem offset nem
 * filtro), então este é o conjunto de trabalho: busca, ordenação e paginação
 * acontecem sobre ele, e a UI mostra o limite explicitamente para não dar a
 * impressão de que a lista é completa.
 */
export const API_LIMITS = [50, 100, 200, 500];
export const DEFAULT_API_LIMIT = 100;

/** Uma página já recortada, com os números usados no rodapé. */
export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  /** Total após os filtros. */
  total: number;
  totalPages: number;
  /** Índice humano do primeiro item (1-based); 0 quando vazio. */
  from: number;
  to: number;
}

/** Um chip de filtro ativo, com a chave para removê-lo individualmente. */
export interface FilterChip {
  key: keyof IngestionFilters;
  /** Valor cru (para a busca) ou chave i18n (para os demais). */
  value: string;
  /** Se `value` deve passar pelo pipe translate. */
  translated: boolean;
}

export function filtersAreDefault(filters: IngestionFilters): boolean {
  return filters.q === DEFAULT_FILTERS.q
    && filters.status === DEFAULT_FILTERS.status
    && filters.stage === DEFAULT_FILTERS.stage
    && filters.sort === DEFAULT_FILTERS.sort;
}

/** Chips dos filtros ativos, na ordem em que aparecem na barra. */
export function activeFilterChips(filters: IngestionFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (filters.q.trim() !== '') {
    chips.push({ key: 'q', value: filters.q.trim(), translated: false });
  }
  if (filters.status !== '') {
    chips.push({ key: 'status', value: `health-page.ingestion.status.${filters.status}`, translated: true });
  }
  if (filters.stage !== '') {
    chips.push({ key: 'stage', value: `health-page.ingestion.stage.${filters.stage}`, translated: true });
  }
  if (filters.sort !== DEFAULT_FILTERS.sort) {
    chips.push({ key: 'sort', value: `health-page.ingestion.filters.sort.${filters.sort}`, translated: true });
  }
  return chips;
}

/** Limpa um filtro específico, mantendo os demais. */
export function clearFilter(filters: IngestionFilters, key: keyof IngestionFilters): IngestionFilters {
  return { ...filters, [key]: DEFAULT_FILTERS[key] };
}

/** Lê `?open=` — ausente devolve o padrão; `none` significa todos fechados. */
export function panelsFromParam(params: Params, hasJobLookup = false): OpenPanels {
  const raw = stringFromParam(params, 'open');
  if (raw === '') {
    return { ...DEFAULT_OPEN_PANELS, lookup: hasJobLookup };
  }
  const wanted = raw === NO_PANELS ? [] : raw.split(',').map((key: string) => key.trim());
  const open = {} as OpenPanels;
  PANEL_KEYS.forEach((key: PanelKey) => {
    open[key] = wanted.includes(key);
  });
  // Uma consulta na URL só faz sentido com o painel dela aberto.
  return hasJobLookup ? { ...open, lookup: true } : open;
}

/** Serializa os painéis abertos; `null` quando estão no padrão. */
export function panelsToParam(open: OpenPanels): string | null {
  const isDefault = PANEL_KEYS.every((key: PanelKey) => open[key] === DEFAULT_OPEN_PANELS[key]);
  if (isDefault) {
    return null;
  }
  const openKeys = PANEL_KEYS.filter((key: PanelKey) => open[key]);
  return openKeys.length === 0 ? NO_PANELS : openKeys.join(',');
}

/** Todos abertos ou todos fechados (botão "expandir/recolher tudo"). */
export function allPanels(value: boolean): OpenPanels {
  const open = {} as OpenPanels;
  PANEL_KEYS.forEach((key: PanelKey) => {
    open[key] = value;
  });
  return open;
}

function timestamp(job: IngestionJob): number {
  const value = job.updated_at;
  if (typeof value !== 'string' || value === '') {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function haystack(job: IngestionJob): string {
  const error = typeof job.error === 'string' ? job.error : '';
  return [job.job_id, job.filename ?? '', job.item_uuid ?? '', job.stage ?? '', error]
    .join(' ')
    .toLowerCase();
}

/** Um job atende à busca e aos filtros de situação/estágio. */
export function matchesFilters(job: IngestionJob, filters: IngestionFilters): boolean {
  const query = filters.q.trim().toLowerCase();
  if (query !== '' && !haystack(job).includes(query)) {
    return false;
  }
  if (filters.status !== '' && normalizeStatus(job.status) !== filters.status) {
    return false;
  }
  if (filters.stage !== '' && (job.stage ?? '').toLowerCase() !== filters.stage) {
    return false;
  }
  return true;
}

/** Aplica filtros e ordenação sem mutar a lista original. */
export function applyFilters<T extends IngestionJob>(jobs: T[], filters: IngestionFilters): T[] {
  const filtered = jobs.filter((job: T) => matchesFilters(job, filters));
  const direction = filters.sort === 'recent' ? -1 : 1;
  return filtered.sort((a: T, b: T) => (timestamp(a) - timestamp(b)) * direction);
}

/** Recorta a página pedida, corrigindo a página quando o conjunto encolhe. */
export function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * size;
  const slice = items.slice(start, start + size);
  return {
    items: slice,
    page: safePage,
    size,
    total,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
  };
}

/** Lê um parâmetro de query string como texto ('' quando ausente). */
export function stringFromParam(params: Params, name: string): string {
  const value = params[name];
  return typeof value === 'string' ? value : '';
}

/** Lê os filtros da query string (mantém o estado ao recarregar a página). */
export function filtersFromParams(params: Params): IngestionFilters {
  const status = stringFromParam(params, 'status');
  const stage = stringFromParam(params, 'stage');
  const sort = stringFromParam(params, 'sort');
  return {
    q: stringFromParam(params, 'q'),
    status: (JOB_STATUSES as readonly string[]).includes(status) ? status : '',
    stage: (STAGES as readonly string[]).includes(stage) ? stage : '',
    sort: sort === 'oldest' ? 'oldest' : 'recent',
  };
}

/** Serializa os filtros; `null` remove o parâmetro da URL. */
export function filtersToParams(filters: IngestionFilters): Params {
  return {
    q: filters.q.trim() === '' ? null : filters.q.trim(),
    status: filters.status === '' ? null : filters.status,
    stage: filters.stage === '' ? null : filters.stage,
    sort: filters.sort === DEFAULT_FILTERS.sort ? null : filters.sort,
  };
}

/** Lê um inteiro positivo da query string, com valor padrão. */
export function intFromParam(params: Params, name: string, fallback: number, allowed?: number[]): number {
  const raw = stringFromParam(params, name);
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  if (allowed && !allowed.includes(parsed)) {
    return fallback;
  }
  return parsed;
}
