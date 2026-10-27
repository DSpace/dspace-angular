import {
  DiskVolume,
  GpuDevice,
  PipelineCapability,
  PipelineComponent,
  PipelineStatusKind,
  PipelineStatusResponse,
} from './pipeline-status.model';
import {
  ageLabel,
  AlertView,
  BarView,
  bytes,
  CapabilityView,
  celsius,
  ComponentView,
  ConfigGroupView,
  decimal,
  DetailGroup,
  DetailRow,
  DetailView,
  FlowStepView,
  HeaderView,
  humanizeKey,
  I18N,
  i18nValue,
  int,
  labelFor,
  megabytes,
  MetricValue,
  MetricView,
  millis,
  NO_VALUE,
  percent,
  seconds,
  statusMeta,
  text,
  yesNo,
} from './pipeline-status.view';

/** Máximo de métricas no cartão fechado. */
const CARD_METRICS = 3;

/** Ícone (Font Awesome, já carregado pelo tema) de cada componente. */
const COMPONENT_ICONS: Record<string, string> = {
  qdrant: 'fa-cubes',
  embedder: 'fa-wave-square',
  mineru: 'fa-file-alt',
  minio: 'fa-hdd',
  redis: 'fa-bolt',
  celery: 'fa-gears',
  gpu: 'fa-microchip',
  llm_enrich: 'fa-magic',
  llm_visual: 'fa-image',
  dspace: 'fa-box-archive',
  flower: 'fa-chart-line',
  jobs: 'fa-tasks',
  disk: 'fa-database',
};

const CAPABILITY_ICONS: Record<string, string> = {
  busca: 'fa-search',
  ingestao: 'fa-file-import',
  extracao: 'fa-file-alt',
  indexacao: 'fa-project-diagram',
  enriquecimento_llm: 'fa-magic',
};

/** Etapas do fluxo, na ordem do pipeline. `component` liga a etapa à checagem. */
const FLOW_STEPS: { key: string, component: string | null, icon: string }[] = [
  { key: 'dspace', component: 'dspace', icon: 'fa-box-archive' },
  { key: 'mineru', component: 'mineru', icon: 'fa-file-alt' },
  { key: 'minio', component: 'minio', icon: 'fa-hdd' },
  { key: 'embedder', component: 'embedder', icon: 'fa-wave-square' },
  { key: 'qdrant', component: 'qdrant', icon: 'fa-cubes' },
  { key: 'search', component: null, icon: 'fa-search' },
];

// ------------------------------------------------------- Leitura defensiva
function detailOf(component: PipelineComponent | undefined): Record<string, unknown> {
  return component?.detail ?? {};
}

function pick(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((value: unknown, key: string) => {
    if (value === null || typeof value !== 'object') {
      return undefined;
    }
    return (value as Record<string, unknown>)[key];
  }, source);
}

function numAt(source: Record<string, unknown>, path: string): number | null {
  const value = pick(source, path);
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function strAt(source: Record<string, unknown>, path: string): string | null {
  const value = pick(source, path);
  return typeof value === 'string' && value !== '' ? value : null;
}

function boolAt(source: Record<string, unknown>, path: string): boolean | null {
  const value = pick(source, path);
  return typeof value === 'boolean' ? value : null;
}

function objAt(source: Record<string, unknown>, path: string): Record<string, unknown> | null {
  const value = pick(source, path);
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function arrAt(source: Record<string, unknown>, path: string): unknown[] {
  const value = pick(source, path);
  return Array.isArray(value) ? value : [];
}

/** Texto de um valor desconhecido, sem cair em `[object Object]`. */
function asText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value as string | number | boolean);
}

/** Métrica só entra na lista se o campo existir de fato. */
function metric(field: string, value: MetricValue | null): MetricView | null {
  if (value === null) {
    return null;
  }
  return { ...labelFor(field), value };
}

function compact(metrics: (MetricView | null)[]): MetricView[] {
  return metrics.filter((item: MetricView | null): boolean => item !== null);
}

/** Converte um valor cru do JSON em algo exibível, escolhendo a unidade. */
function autoValue(field: string, raw: unknown): MetricValue {
  if (raw === null || raw === undefined || raw === '') {
    return NO_VALUE;
  }
  if (typeof raw === 'boolean') {
    return yesNo(raw);
  }
  if (Array.isArray(raw)) {
    return raw.length === 0
      ? i18nValue(`${I18N}.value.empty-list`)
      : text(raw.map(asText).join(', '));
  }
  if (typeof raw === 'number') {
    if (field.endsWith('_percent') || field === 'free_percent_min') {
      return percent(raw);
    }
    if (field.endsWith('_bytes')) {
      return bytes(raw);
    }
    if (field.endsWith('_mb')) {
      return megabytes(raw);
    }
    if (field.endsWith('_gb')) {
      return decimal(raw);
    }
    if (field.endsWith('_ms')) {
      return millis(raw);
    }
    if (field.endsWith('_seconds')) {
      return seconds(raw);
    }
    if (field === 'temperature_celsius') {
      return celsius(raw);
    }
    return Number.isInteger(raw) ? int(raw) : decimal(raw);
  }
  return text(asText(raw));
}

// ------------------------------------------------------------------ Cabeçalho
export function buildHeader(response: PipelineStatusResponse): HeaderView {
  const summary = response.summary;
  const age = ageLabel(response.age_seconds);
  const criticalProblems = componentList(response).some((component: PipelineComponent) =>
    component.critical && (component.status === 'down' || component.status === 'degraded'));

  return {
    status: statusMeta(response.status),
    allCriticalOk: !criticalProblems,
    summary: [
      { labelKey: `${I18N}.status.ok`, count: summary?.ok ?? 0, modifier: 'is-ok' },
      { labelKey: `${I18N}.status.degraded`, count: summary?.degraded ?? 0, modifier: 'is-degraded' },
      { labelKey: `${I18N}.status.down`, count: summary?.down ?? 0, modifier: 'is-down' },
      { labelKey: `${I18N}.status.not_configured`, count: summary?.not_configured ?? 0, modifier: 'is-not-configured' },
    ],
    generatedAt: response.generated_at ?? null,
    ageKey: age.key,
    ageParams: age.params,
    tookMs: typeof response.took_ms === 'number' ? millis(response.took_ms) : NO_VALUE,
  };
}

// --------------------------------------------------------------- Capacidades
export function buildCapabilities(response: PipelineStatusResponse): CapabilityView[] {
  const capabilities = response.capabilities ?? {};
  return Object.keys(capabilities).map((key: string) => {
    const capability: PipelineCapability = capabilities[key];
    return {
      key,
      nameKey: `${I18N}.capability.${key}`,
      description: capability?.description ?? '',
      available: capability?.available === true,
      blockedBy: capability?.blocked_by ?? [],
      icon: CAPABILITY_ICONS[key] ?? 'fa-circle-check',
    };
  });
}

// -------------------------------------------------------------------- Fluxo
export function buildFlow(response: PipelineStatusResponse): FlowStepView[] {
  const components = response.components ?? {};
  return FLOW_STEPS.map((step: { key: string, component: string | null, icon: string }) => {
    const component = step.component === null ? undefined : components[step.component];
    return {
      key: step.key,
      nameKey: `${I18N}.flow.${step.key}.name`,
      roleKey: `${I18N}.flow.${step.key}.role`,
      icon: step.icon,
      status: step.component === null
        ? statusMeta(searchStatus(response))
        : statusMeta(component?.status),
      metrics: flowMetrics(step.key, component, response),
    };
  });
}

/** A busca não é um componente: o estado vem da capacidade `busca`. */
function searchStatus(response: PipelineStatusResponse): PipelineStatusKind {
  const capability = response.capabilities?.busca;
  if (capability === undefined) {
    return 'unknown';
  }
  return capability.available ? 'ok' : 'down';
}

function flowMetrics(
  key: string,
  component: PipelineComponent | undefined,
  response: PipelineStatusResponse,
): MetricView[] {
  const detail = detailOf(component);
  switch (key) {
    case 'dspace':
      return compact([metric('http_status', numAt(detail, 'http_status') === null
        ? null
        : i18nValue(`${I18N}.flow.dspace.responding`))]);
    case 'mineru':
      return compact([
        metric('completed_tasks', mapNum(numAt(detail, 'completed_tasks'), int)),
        metric('processing_tasks', mapNum(numAt(detail, 'processing_tasks'), int)),
      ]);
    case 'minio':
      return compact([
        metric('documents', mapNum(numAt(detail, 'artifacts.documents'), int)),
        metric('objects', mapNum(numAt(detail, 'artifacts.objects'), int)),
        metric('size_gb', mapNum(numAt(detail, 'artifacts.size_bytes'), bytes)),
      ]);
    case 'embedder':
      return compact([
        metric('model', mapStr(strAt(detail, 'model_expected'), text)),
        metric('dense_dim', mapNum(response.config?.embedding?.dense_dim as number ?? null, int)),
        metric('dense', bothEndpoints(detail)),
      ]);
    case 'qdrant':
      return compact([
        metric('chunks', mapNum(numAt(detail, 'chunks'), int)),
        metric('indexed_vectors', mapNum(numAt(detail, 'indexed_vectors'), int)),
      ]);
    case 'search':
      return compact([{
        labelKey: `${I18N}.flow.search.capability`,
        value: i18nValue(response.capabilities?.busca?.available
          ? `${I18N}.value.available`
          : `${I18N}.value.unavailable`),
      }]);
    default:
      return [];
  }
}

/** "denso + esparso" quando os dois endpoints servem o modelo. */
function bothEndpoints(detail: Record<string, unknown>): MetricValue | null {
  const dense = boolAt(detail, 'dense.model_served');
  const sparse = boolAt(detail, 'sparse.model_served');
  if (dense === null && sparse === null) {
    return null;
  }
  if (dense && sparse) {
    return i18nValue(`${I18N}.value.dense-and-sparse`);
  }
  if (dense) {
    return i18nValue(`${I18N}.value.dense-only`);
  }
  if (sparse) {
    return i18nValue(`${I18N}.value.sparse-only`);
  }
  return i18nValue(`${I18N}.value.unavailable`);
}

function mapNum(value: number | null, factory: (num: number) => MetricValue): MetricValue | null {
  return value === null ? null : factory(value);
}

function mapStr(value: string | null, factory: (raw: string) => MetricValue): MetricValue | null {
  return value === null ? null : factory(value);
}

// -------------------------------------------------------------- Componentes
function componentList(response: PipelineStatusResponse): PipelineComponent[] {
  const components = response.components ?? {};
  return Object.keys(components).map((key: string) => components[key]).filter(Boolean);
}

/** Ordem de exibição: problemas primeiro, depois críticos, depois o resto. */
const STATUS_WEIGHT: Record<PipelineStatusKind, number> = {
  down: 0,
  degraded: 1,
  unknown: 2,
  ok: 3,
  not_configured: 4,
};

export function buildComponents(response: PipelineStatusResponse): ComponentView[] {
  const components = response.components ?? {};
  return Object.keys(components)
    .map((key: string) => buildComponent(key, components[key]))
    .sort((a: ComponentView, b: ComponentView) => {
      const byStatus = STATUS_WEIGHT[a.status.kind] - STATUS_WEIGHT[b.status.kind];
      if (byStatus !== 0) {
        return byStatus;
      }
      if (a.critical !== b.critical) {
        return a.critical ? -1 : 1;
      }
      return a.key.localeCompare(b.key);
    });
}

export function componentIcon(key: string): string {
  return COMPONENT_ICONS[key] ?? 'fa-server';
}

function buildComponent(key: string, component: PipelineComponent): ComponentView {
  const detail = detailOf(component);
  const status = statusMeta(component?.status);
  return {
    key,
    nameKey: `${I18N}.component.${key}`,
    role: component?.role ?? '',
    message: component?.message ?? '',
    status,
    critical: component?.critical === true,
    latency: typeof component?.latency_ms === 'number' ? millis(component.latency_ms) : NO_VALUE,
    hint: component?.hint ?? null,
    metrics: curatedMetrics(key, detail).slice(0, CARD_METRICS),
    bars: buildBars(key, detail),
    detail: buildDetail(detail, curatedFields(key)),
    optionalNotConfigured: component?.status === 'not_configured' && component?.critical !== true,
  };
}

/** Campos que já aparecem como métrica/barra e não se repetem em "ver detalhes". */
function curatedFields(key: string): string[] {
  switch (key) {
    case 'qdrant':
      return ['chunks', 'indexed_vectors', 'segments'];
    case 'embedder':
      return ['model_expected', 'max_tokens'];
    case 'mineru':
      return ['queued_tasks', 'processing_tasks', 'completed_tasks', 'failed_tasks'];
    case 'minio':
      return [];
    case 'redis':
      return ['connected_clients', 'used_memory_mb', 'backlog_total'];
    case 'celery':
      return ['workers_online', 'concurrency_total', 'active_tasks'];
    case 'gpu':
      return ['queue_size', 'locked'];
    case 'llm_enrich':
      return ['provider', 'model', 'model_served'];
    case 'llm_visual':
      return ['enabled', 'model'];
    case 'dspace':
      return ['http_status'];
    case 'jobs':
      return ['active', 'succeeded', 'failed'];
    case 'disk':
      return ['free_percent_min'];
    default:
      return [];
  }
}

/** As métricas de destaque de cada componente, na ordem que faz sentido ler. */
function curatedMetrics(key: string, detail: Record<string, unknown>): MetricView[] {
  switch (key) {
    case 'qdrant':
      return compact([
        metric('chunks', mapNum(numAt(detail, 'chunks'), int)),
        metric('indexed_vectors', mapNum(numAt(detail, 'indexed_vectors'), int)),
        metric('segments', mapNum(numAt(detail, 'segments'), int)),
      ]);
    case 'embedder':
      return compact([
        metric('model_expected', mapStr(strAt(detail, 'model_expected'), text)),
        metric('max_tokens', mapNum(numAt(detail, 'max_tokens'), int)),
        metric('dense', bothEndpoints(detail)),
      ]);
    case 'mineru':
      return compact([
        metric('completed_tasks', mapNum(numAt(detail, 'completed_tasks'), int)),
        metric('processing_tasks', mapNum(numAt(detail, 'processing_tasks'), int)),
        metric('queued_tasks', mapNum(numAt(detail, 'queued_tasks'), int)),
        metric('failed_tasks', mapNum(numAt(detail, 'failed_tasks'), int)),
      ]);
    case 'minio':
      return compact([
        metric('documents', mapNum(numAt(detail, 'artifacts.documents'), int)),
        metric('objects', mapNum(numAt(detail, 'artifacts.objects'), int)),
        metric('size_bytes', mapNum(numAt(detail, 'artifacts.size_bytes'), bytes)),
      ]);
    case 'redis':
      return compact([
        metric('connected_clients', mapNum(numAt(detail, 'connected_clients'), int)),
        metric('used_memory_mb', mapNum(numAt(detail, 'used_memory_mb'), megabytes)),
        metric('backlog_total', mapNum(numAt(detail, 'backlog_total'), int)),
      ]);
    case 'celery':
      return compact([
        metric('workers_online', mapNum(numAt(detail, 'workers_online'), int)),
        metric('concurrency_total', mapNum(numAt(detail, 'concurrency_total'), int)),
        metric('active_tasks', mapNum(numAt(detail, 'active_tasks'), int)),
      ]);
    case 'gpu':
      return compact([
        metric('utilization_percent', mapNum(numAt(detail, 'devices.0.utilization_percent'), percent)),
        metric('temperature_celsius', mapNum(numAt(detail, 'devices.0.temperature_celsius'), celsius)),
        metric('locked', lockValue(detail)),
      ]);
    case 'llm_enrich':
      return compact([
        metric('provider', mapStr(strAt(detail, 'provider'), text)),
        metric('model', mapStr(strAt(detail, 'model'), text)),
        metric('model_served', boolAt(detail, 'model_served') === null
          ? null
          : yesNo(boolAt(detail, 'model_served'))),
      ]);
    case 'llm_visual':
      return compact([
        metric('enabled', boolAt(detail, 'enabled') === null ? null : yesNo(boolAt(detail, 'enabled'))),
        metric('model', mapStr(strAt(detail, 'model'), text)),
      ]);
    case 'dspace':
      return compact([metric('http_status', mapNum(numAt(detail, 'http_status'), int))]);
    case 'jobs':
      return compact([
        metric('active', mapNum(numAt(detail, 'active'), int)),
        metric('succeeded', mapNum(numAt(detail, 'succeeded'), int)),
        metric('failed', mapNum(numAt(detail, 'failed'), int)),
      ]);
    case 'disk':
      return compact([
        metric('free_gb', mapNum(numAt(detail, 'temp.free_gb'), decimal)),
        metric('total_gb', mapNum(numAt(detail, 'temp.total_gb'), decimal)),
        metric('free_percent', mapNum(numAt(detail, 'free_percent_min'), percent)),
      ]);
    default:
      return [];
  }
}

function lockValue(detail: Record<string, unknown>): MetricValue | null {
  const locked = boolAt(detail, 'locked');
  if (locked === null) {
    return null;
  }
  return i18nValue(`${I18N}.value.${locked ? 'locked' : 'unlocked'}`);
}

/** Barras de proporção: só onde "usado de um total" é a leitura natural. */
function buildBars(key: string, detail: Record<string, unknown>): BarView[] {
  if (key === 'gpu') {
    const device = arrAt(detail, 'devices')[0] as GpuDevice | undefined;
    const total = device?.memory_total_mb;
    const used = device?.memory_used_mb;
    if (typeof total !== 'number' || total <= 0 || typeof used !== 'number') {
      return [];
    }
    const ratio = Math.min(100, Math.round((used / total) * 100));
    return [{
      labelKey: `${I18N}.bar.gpu-memory`,
      percent: ratio,
      captionKey: `${I18N}.bar.of-total`,
      captionParams: { used: formatGigabytes(used / 1024), total: formatGigabytes(total / 1024) },
      warning: ratio >= 90,
    }];
  }

  if (key === 'disk') {
    const volume = objAt(detail, 'temp') as DiskVolume | null;
    const freePercent = numAt(detail, 'free_percent_min') ?? volume?.free_percent;
    if (typeof freePercent !== 'number') {
      return [];
    }
    const threshold = numAt(detail, 'min_free_percent_threshold') ?? 10;
    const used = Math.min(100, Math.max(0, Math.round(100 - freePercent)));
    return [{
      labelKey: `${I18N}.bar.disk-used`,
      percent: used,
      captionKey: `${I18N}.bar.of-total`,
      captionParams: {
        used: formatGigabytes(volume?.used_gb),
        total: formatGigabytes(volume?.total_gb),
      },
      warning: freePercent <= threshold,
    }];
  }

  return [];
}

function formatGigabytes(value: number | undefined): string {
  return typeof value === 'number' ? `${value.toFixed(1)} GB` : '—';
}

// ------------------------------------------------------------ Ver detalhes
/**
 * O resto do `detail`, achatado em linhas e grupos. Nunca imprime um objeto
 * direto: sub-objetos viram grupos e objetos de 3º nível viram linhas com rótulo
 * composto.
 */
export function buildDetail(detail: Record<string, unknown>, skip: string[] = []): DetailView {
  const rows: DetailRow[] = [];
  const groups: DetailGroup[] = [];

  Object.keys(detail).forEach((field: string) => {
    if (skip.includes(field)) {
      return;
    }
    const raw = detail[field];

    if (Array.isArray(raw) && raw.some((item: unknown) => item !== null && typeof item === 'object')) {
      raw.forEach((item: unknown, index: number) => {
        groups.push({
          label: `${humanizeKey(field)} ${index}`,
          rows: flatten(item as Record<string, unknown>),
        });
      });
      return;
    }

    if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) {
      const nested = flatten(raw as Record<string, unknown>);
      if (nested.length > 0) {
        groups.push({ ...labelFor(field), rows: nested });
      }
      return;
    }

    rows.push({ ...labelFor(field), value: autoValue(field, raw) });
  });

  return { rows, groups };
}

/**
 * Achata um sub-objeto. Um nível mais fundo mantém o rótulo traduzido do campo e
 * ganha o caminho como prefixo ("Broker · Chaves"), em vez de virar uma chave crua.
 */
function flatten(source: Record<string, unknown>, path: string[] = []): DetailRow[] {
  const rows: DetailRow[] = [];
  Object.keys(source ?? {}).forEach((field: string) => {
    const raw = source[field];
    if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) {
      rows.push(...flatten(raw as Record<string, unknown>, [...path, field]));
      return;
    }
    rows.push({
      ...labelFor(field),
      prefix: path.length === 0 ? undefined : path.map(humanizeKey).join(' · '),
      value: autoValue(field, raw),
    });
  });
  return rows;
}

// ----------------------------------------------------------------- Alertas
export function buildAlerts(response: PipelineStatusResponse): AlertView[] {
  const alerts: AlertView[] = [];
  const components = response.components ?? {};

  (response.blocking ?? []).forEach((message: string) => {
    alerts.push({ kind: 'blocking', severity: 'danger', text: message });
  });

  (response.warnings ?? []).forEach((message: string) => {
    alerts.push({ kind: 'warning', severity: 'warning', text: message });
  });

  Object.keys(components).forEach((key: string) => {
    const component = components[key];
    const params = { name: key };

    if (component.status === 'down') {
      alerts.push({
        kind: 'down',
        severity: 'danger',
        textKey: `${I18N}.alert.down`,
        textParams: params,
        hint: component.hint,
      });
      return;
    }
    if (component.status === 'degraded') {
      alerts.push({
        kind: 'degraded',
        severity: 'warning',
        textKey: `${I18N}.alert.degraded`,
        textParams: params,
        hint: component.hint,
      });
      return;
    }
    if (component.status === 'not_configured') {
      alerts.push({
        kind: 'optional',
        // Crítico e não configurado é problema; opcional é só informação.
        severity: component.critical ? 'danger' : 'info',
        textKey: component.critical
          ? `${I18N}.alert.critical-not-configured`
          : `${I18N}.alert.optional-not-configured`,
        textParams: params,
        hint: component.hint,
      });
    }
  });

  const failedJobs = numAt(detailOf(components.jobs), 'failed');
  if (failedJobs !== null && failedJobs > 0) {
    alerts.push({
      kind: 'jobs',
      severity: 'warning',
      // Uma chave por número: "Há 1 job com falha" x "Há 3 jobs com falhas".
      textKey: `${I18N}.alert.jobs-failed${failedJobs === 1 ? '-one' : ''}`,
      textParams: { count: failedJobs },
      hint: components.jobs?.hint,
    });
  }

  const missingQueues = arrAt(detailOf(components.celery), 'queues_missing');
  if (missingQueues.length > 0) {
    alerts.push({
      kind: 'queues',
      severity: 'warning',
      textKey: `${I18N}.alert.queues-missing`,
      textParams: { queues: missingQueues.map(asText).join(', ') },
    });
  }

  return alerts;
}

// --------------------------------------------------------------- Configuração
export function buildConfig(response: PipelineStatusResponse): ConfigGroupView[] {
  const config = response.config ?? {};
  const api = response.api ?? {};
  const groups: ConfigGroupView[] = [];

  const version = config.pipeline_version ?? api.pipeline_version;
  const service: DetailRow[] = compact([
    metric('service', mapStr(api.service ?? null, text)),
    metric('pipeline_version', version === undefined ? null : text(String(version))),
    metric('uptime_seconds', typeof api.uptime_seconds === 'number' ? seconds(api.uptime_seconds) : null),
    metric('started_at', mapStr(api.started_at ?? null, text)),
  ]);
  if (service.length > 0) {
    groups.push({ labelKey: `${I18N}.config.service`, rows: service });
  }

  ([
    ['embedding', config.embedding],
    ['extraction', config.extraction],
    ['chunking', config.chunking],
    ['search', config.search],
  ] as [string, Record<string, unknown> | undefined][]).forEach(([key, section]) => {
    if (section === undefined || section === null) {
      return;
    }
    const rows = flatten(section);
    if (rows.length > 0) {
      groups.push({ labelKey: `${I18N}.config.${key}`, rows });
    }
  });

  return groups;
}
