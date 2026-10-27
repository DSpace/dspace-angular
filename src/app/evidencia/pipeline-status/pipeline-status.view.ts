import { PipelineStatusKind } from './pipeline-status.model';

/** Prefixo de todas as chaves i18n deste painel. */
export const I18N = 'health-page.pipeline';

/**
 * Um valor já classificado para exibição. O componente `ds-pipeline-value` cuida da
 * formatação (locale) e da tradução, para que nenhum template precise repetir isso.
 */
export interface MetricValue {
  kind: 'int' | 'decimal' | 'percent' | 'bytes' | 'megabytes' | 'ms' | 'seconds' | 'celsius' | 'text' | 'key' | 'none';
  num?: number;
  /** Valor cru preservado (modelo, coleção, estratégia) — não é traduzido. */
  text?: string;
  /** Chave i18n (sim/não, disponível/indisponível…). */
  key?: string;
}

export const NO_VALUE: MetricValue = { kind: 'none' };

export function int(num: number): MetricValue {
  return { kind: 'int', num };
}

export function decimal(num: number): MetricValue {
  return { kind: 'decimal', num };
}

export function percent(num: number): MetricValue {
  return { kind: 'percent', num };
}

export function bytes(num: number): MetricValue {
  return { kind: 'bytes', num };
}

export function megabytes(num: number): MetricValue {
  return { kind: 'megabytes', num };
}

export function millis(num: number): MetricValue {
  return { kind: 'ms', num };
}

export function seconds(num: number): MetricValue {
  return { kind: 'seconds', num };
}

export function celsius(num: number): MetricValue {
  return { kind: 'celsius', num };
}

export function text(value: string): MetricValue {
  return { kind: 'text', text: value };
}

export function i18nValue(key: string): MetricValue {
  return { kind: 'key', key };
}

/** Booleano como palavra, nunca como `true`/`false` na tela. */
export function yesNo(value: boolean): MetricValue {
  return i18nValue(`${I18N}.value.${value ? 'yes' : 'no'}`);
}

// ------------------------------------------------------------------ Estados
/** Como cada estado aparece: rótulo, ícone e classe. Nunca só cor. */
export interface StatusMeta {
  kind: PipelineStatusKind;
  labelKey: string;
  /** Classe do ícone (Font Awesome já vem no tema). */
  icon: string;
  modifier: string;
}

const STATUS_META: Record<PipelineStatusKind, StatusMeta> = {
  ok: { kind: 'ok', labelKey: `${I18N}.status.ok`, icon: 'fa-check-circle', modifier: 'is-ok' },
  degraded: { kind: 'degraded', labelKey: `${I18N}.status.degraded`, icon: 'fa-exclamation-triangle', modifier: 'is-degraded' },
  down: { kind: 'down', labelKey: `${I18N}.status.down`, icon: 'fa-times-circle', modifier: 'is-down' },
  not_configured: { kind: 'not_configured', labelKey: `${I18N}.status.not_configured`, icon: 'fa-info-circle', modifier: 'is-not-configured' },
  unknown: { kind: 'unknown', labelKey: `${I18N}.status.unknown`, icon: 'fa-question-circle', modifier: 'is-unknown' },
};

export function statusMeta(kind: PipelineStatusKind | string | undefined): StatusMeta {
  return STATUS_META[kind as PipelineStatusKind] ?? STATUS_META.unknown;
}

// ------------------------------------------------------- Blocos de exibição
/** Uma métrica rotulada. */
export interface MetricView {
  /** Chave i18n do rótulo, quando o campo é conhecido. */
  labelKey?: string;
  /** Rótulo já legível, para campos que a API pode acrescentar. */
  label?: string;
  /**
   * Caminho do campo dentro do `detail` ("Broker"), exibido antes do rótulo.
   * Mantém o rótulo do campo traduzido em vez de humanizar a chave inteira.
   */
  prefix?: string;
  value: MetricValue;
}

/** Barra de proporção (memória, disco). */
export interface BarView {
  labelKey: string;
  /** 0–100. */
  percent: number;
  /** Legenda ao lado da barra (ex.: "40,2 GB de 48 GB"). */
  captionKey?: string;
  captionParams?: Record<string, string>;
  /** `true` pinta a barra como alerta. */
  warning?: boolean;
}

export type DetailRow = MetricView;

/** Um sub-objeto do `detail`, virado em grupo de linhas. */
export interface DetailGroup {
  labelKey?: string;
  label?: string;
  rows: DetailRow[];
}

export interface DetailView {
  rows: DetailRow[];
  groups: DetailGroup[];
}

export interface ComponentView {
  key: string;
  nameKey: string;
  role: string;
  message: string;
  status: StatusMeta;
  critical: boolean;
  latency: MetricValue;
  hint: string | null;
  /** Até três métricas de destaque no cartão fechado. */
  metrics: MetricView[];
  bars: BarView[];
  detail: DetailView;
  /** Opcional e desligado: informativo, não erro. */
  optionalNotConfigured: boolean;
}

export interface CapabilityView {
  key: string;
  nameKey: string;
  description: string;
  available: boolean;
  blockedBy: string[];
  icon: string;
}

export interface FlowStepView {
  key: string;
  nameKey: string;
  roleKey: string;
  icon: string;
  status: StatusMeta;
  metrics: MetricView[];
}

export type AlertSeverity = 'danger' | 'warning' | 'info';

export interface AlertView {
  kind: 'blocking' | 'warning' | 'down' | 'degraded' | 'jobs' | 'queues' | 'optional';
  severity: AlertSeverity;
  /** Texto cru da API (já em português), quando houver. */
  text?: string;
  textKey?: string;
  textParams?: Record<string, string | number>;
  hint?: string;
}

export interface ConfigGroupView {
  labelKey: string;
  rows: DetailRow[];
}

export interface HeaderView {
  status: StatusMeta;
  allCriticalOk: boolean;
  summary: { labelKey: string, count: number, modifier: string }[];
  generatedAt: string | null;
  ageKey: string;
  ageParams: Record<string, number>;
  tookMs: MetricValue;
}

// ---------------------------------------------------------------- Rótulos
/**
 * Campos da API com rótulo traduzido. O que não estiver aqui cai em
 * `humanizeKey`, então um campo novo na API aparece legível em vez de sumir.
 */
export const FIELD_LABELS: Record<string, string> = {
  active: 'active',
  active_tasks: 'active_tasks',
  artifacts: 'artifacts',
  auto_after_index: 'auto_after_index',
  backend: 'backend',
  backlog_total: 'backlog_total',
  batch_size: 'batch_size',
  broker: 'broker',
  bucket_exists: 'bucket_exists',
  by_stage: 'by_stage',
  chunks: 'chunks',
  collection: 'collection',
  collection_status: 'collection_status',
  collections_total: 'collections_total',
  completed_tasks: 'completed_tasks',
  concurrency_total: 'concurrency_total',
  connected_clients: 'connected_clients',
  dense: 'dense',
  dense_dim: 'dense_dim',
  dense_vector: 'dense_vector',
  devices: 'devices',
  distance: 'distance',
  documents: 'documents',
  enabled: 'enabled',
  failed: 'failed',
  failed_tasks: 'failed_tasks',
  free_gb: 'free_gb',
  free_percent: 'free_percent',
  free_percent_min: 'free_percent_min',
  gpu_manager: 'gpu_manager',
  holder_service: 'holder_service',
  http_status: 'http_status',
  indexed_vectors: 'indexed_vectors',
  job_store: 'job_store',
  keys: 'keys',
  lang: 'lang',
  latency: 'latency',
  locked: 'locked',
  lock_ttl_seconds: 'lock_ttl_seconds',
  manager_enabled: 'manager_enabled',
  manifests: 'manifests',
  max_chars: 'max_chars',
  max_concurrent_requests: 'max_concurrent_requests',
  max_model_len: 'max_model_len',
  max_tokens: 'max_tokens',
  memory_free_mb: 'memory_free_mb',
  memory_total_mb: 'memory_total_mb',
  memory_used_mb: 'memory_used_mb',
  method: 'method',
  min_free_percent_threshold: 'min_free_percent_threshold',
  min_tokens: 'min_tokens',
  model: 'model',
  model_expected: 'model_expected',
  model_served: 'model_served',
  name: 'name',
  objects: 'objects',
  optimizer_status: 'optimizer_status',
  output: 'output',
  overlap_tokens: 'overlap_tokens',
  pipeline_runs: 'pipeline_runs',
  pipeline_version: 'pipeline_version',
  present: 'present',
  primary_source: 'primary_source',
  processing_tasks: 'processing_tasks',
  provider: 'provider',
  queue_size: 'queue_size',
  queued_tasks: 'queued_tasks',
  queues: 'queues',
  queues_covered: 'queues_covered',
  queues_expected: 'queues_expected',
  queues_missing: 'queues_missing',
  readable: 'readable',
  reachable: 'reachable',
  resource: 'resource',
  review_threshold: 'review_threshold',
  reserved_tasks: 'reserved_tasks',
  same_instance: 'same_instance',
  segments: 'segments',
  service: 'service',
  size: 'size',
  size_bytes: 'size_bytes',
  size_gb: 'size_gb',
  sparse: 'sparse',
  sparse_vector: 'sparse_vector',
  started_at: 'started_at',
  storage: 'storage',
  strategy: 'strategy',
  succeeded: 'succeeded',
  target_tokens: 'target_tokens',
  temp: 'temp',
  temperature_celsius: 'temperature_celsius',
  text_field: 'text_field',
  timeout_seconds: 'timeout_seconds',
  tokenizer: 'tokenizer',
  total_gb: 'total_gb',
  truncated: 'truncated',
  ttl_seconds: 'ttl_seconds',
  uptime_seconds: 'uptime_seconds',
  used_gb: 'used_gb',
  used_memory_mb: 'used_memory_mb',
  utilization_percent: 'utilization_percent',
  version: 'version',
  writable: 'writable',
  write_probe_enabled: 'write_probe_enabled',
};

/** Chave i18n do rótulo de um campo, ou `undefined` se não houver tradução. */
export function fieldLabelKey(field: string): string | undefined {
  const known = FIELD_LABELS[field];
  return known === undefined ? undefined : `${I18N}.field.${known}`;
}

/** `used_memory_mb` → `Used memory mb`. Só para campos sem tradução. */
export function humanizeKey(field: string): string {
  const spaced = field.replace(/[_.]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Rótulo de um campo: traduzido quando conhecido, legível quando não. */
export function labelFor(field: string): Pick<MetricView, 'labelKey' | 'label'> {
  const key = fieldLabelKey(field);
  return key === undefined ? { label: humanizeKey(field) } : { labelKey: key };
}

/** ngx-translate não pluraliza: uma chave para singular, outra para plural. */
function plural(unit: string, count: number): { key: string, params: Record<string, number> } {
  const suffix = count === 1 ? '-one' : '';
  return { key: `${I18N}.age.${unit}${suffix}`, params: { count } };
}

/** `age_seconds` como texto amigável: poucos segundos, minutos, horas, dias. */
export function ageLabel(ageSeconds: number | null | undefined): { key: string, params: Record<string, number> } {
  const age = Math.max(0, Math.round(ageSeconds ?? 0));
  if (ageSeconds === null || ageSeconds === undefined) {
    return { key: `${I18N}.age.unknown`, params: {} };
  }
  if (age < 45) {
    return { key: `${I18N}.age.just-now`, params: {} };
  }
  if (age < 5400) {
    return plural('minutes', Math.round(age / 60));
  }
  if (age < 172800) {
    return plural('hours', Math.round(age / 3600));
  }
  return plural('days', Math.round(age / 86400));
}
