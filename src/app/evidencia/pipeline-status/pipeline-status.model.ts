/**
 * Tipos da resposta de `GET /api/status` do `evidencia_pipe`.
 *
 * Os campos declarados são os que a UI realmente lê; o restante de cada `detail`
 * fica em `Record<string, unknown>` e é renderizado de forma genérica, sem que a
 * adição de um campo novo na API quebre a tela.
 */

/** Estado de um componente (e da plataforma como um todo). */
export type PipelineStatusKind = 'ok' | 'degraded' | 'down' | 'not_configured' | 'unknown';

/** Contagem de componentes por estado. */
export interface PipelineSummary {
  total: number;
  ok: number;
  degraded: number;
  down: number;
  not_configured: number;
  unknown: number;
}

/** Uma capacidade da plataforma (busca, ingestão, extração…). */
export interface PipelineCapability {
  available: boolean;
  /** Componentes que impedem a capacidade, quando indisponível. */
  blocked_by?: string[];
  description?: string;
}

/** Um componente da infraestrutura. */
export interface PipelineComponent {
  name: string;
  status: PipelineStatusKind;
  /** Crítico: a plataforma não funciona sem ele. */
  critical: boolean;
  role?: string;
  message?: string;
  latency_ms?: number | null;
  /** Orientação de próximo passo, quando a API tem algo a sugerir. */
  hint?: string;
  detail?: Record<string, unknown>;
}

// --------------------------------------------------------- Detalhes tipados
/** `gpu.detail.devices[]` */
export interface GpuDevice {
  index?: number;
  name?: string;
  memory_total_mb?: number;
  memory_used_mb?: number;
  memory_free_mb?: number;
  utilization_percent?: number;
  temperature_celsius?: number;
}

/** `disk.detail.<volume>` */
export interface DiskVolume {
  total_gb?: number;
  used_gb?: number;
  free_gb?: number;
  free_percent?: number;
}

/** `minio.detail.artifacts` */
export interface MinioArtifacts {
  objects?: number;
  size_bytes?: number;
  size_gb?: number;
  documents?: number;
  manifests?: number;
  pipeline_runs?: number;
  by_stage?: Record<string, number>;
  truncated?: boolean;
}

/** `embedder.detail.dense` / `.sparse` */
export interface EmbedderEndpoint {
  reachable?: boolean;
  model_served?: boolean;
  max_model_len?: number;
}

/** Configuração técnica publicada pela API. */
export interface PipelineConfig {
  pipeline_version?: string;
  embedding?: Record<string, unknown>;
  extraction?: Record<string, unknown>;
  chunking?: Record<string, unknown>;
  search?: Record<string, unknown>;
}

/** Identificação e tempo de atividade do serviço. */
export interface PipelineApiInfo {
  service?: string;
  pipeline_version?: string;
  uptime_seconds?: number;
  started_at?: string;
}

/** Resposta completa de `GET /api/status`. */
export interface PipelineStatusResponse {
  status: PipelineStatusKind;
  /** ISO 8601 do momento em que a checagem foi gerada. */
  generated_at?: string;
  /** Idade da resposta em segundos (a API pode servir de cache). */
  age_seconds?: number;
  took_ms?: number;
  detail_level?: string;
  probe?: boolean;
  summary?: PipelineSummary;
  /** Impedimentos que travam a plataforma. */
  blocking?: string[];
  warnings?: string[];
  capabilities?: Record<string, PipelineCapability>;
  components?: Record<string, PipelineComponent>;
  config?: PipelineConfig;
  api?: PipelineApiInfo;
}

/** Uma resposta é utilizável quando tem, no mínimo, o estado geral. */
export function isPipelineStatusResponse(payload: unknown): payload is PipelineStatusResponse {
  if (payload === null || typeof payload !== 'object') {
    return false;
  }
  const status: unknown = (payload as PipelineStatusResponse).status;
  return typeof status === 'string' && status.length > 0;
}
