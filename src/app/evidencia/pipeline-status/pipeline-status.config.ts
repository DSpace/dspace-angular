/**
 * Resolução do endpoint da API de status.
 *
 * Funções puras (testáveis sem `TestBed`, no mesmo espírito do `pipeline-status.presenter`).
 * A configuração da aplicação é lida de forma **estrutural**, sem importar o tipo
 * `AppConfig`: assim esta pasta compila numa instalação DSpace que não declarou a
 * seção `pipelineStatus` — ela simplesmente cai nos defaults.
 */

export interface PipelineStatusConfig {
  /** Base da API. `'/'` = mesma origem da UI. Pode incluir prefixo de path. */
  baseUrl: string;
  /** Caminho do endpoint agregado, concatenado a `baseUrl`. */
  statusPath: string;
  /** Teto da requisição; a checagem completa é lenta (varre MinIO, consulta o Celery). */
  timeoutMs: number;
  /** Probes de escrita (mais lento). */
  probe: boolean;
  /** Varredura de artefatos do MinIO. */
  artifacts: boolean;
}

/**
 * Defaults neutros: apontam para a **própria origem**, nunca para o host de outra
 * instituição. Sem configurar nada, a instalação recebe 404 em `/api/status` e o
 * painel mostra a mensagem própria para isso — falha visível em vez de silenciosa.
 */
export const PIPELINE_STATUS_DEFAULTS: Readonly<PipelineStatusConfig> = {
  baseUrl: '/',
  statusPath: '/api/status',
  timeoutMs: 20000,
  probe: false,
  artifacts: true,
};

/** Overrides pontuais (vindos dos `@Input`); `null`/`undefined` = "não opinou". */
export type PipelineStatusOverrides = Partial<Record<keyof PipelineStatusConfig, unknown>>;

/** Nome da seção esperada no `AppConfig` da aplicação hospedeira. */
const CONFIG_SECTION = 'pipelineStatus';

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
 * `@Input` → `AppConfig.pipelineStatus` → `PIPELINE_STATUS_DEFAULTS`.
 *
 * Um campo ausente num nível não apaga os demais: uma seção de config pela metade
 * continua válida.
 */
export function resolvePipelineStatusConfig(
  appConfig: unknown,
  overrides: PipelineStatusOverrides = {},
): PipelineStatusConfig {
  const section = readSection(appConfig);
  return {
    baseUrl: pickString(overrides.baseUrl, section.baseUrl) ?? PIPELINE_STATUS_DEFAULTS.baseUrl,
    statusPath: pickString(overrides.statusPath, section.statusPath) ?? PIPELINE_STATUS_DEFAULTS.statusPath,
    timeoutMs: pickNumber(overrides.timeoutMs, section.timeoutMs) ?? PIPELINE_STATUS_DEFAULTS.timeoutMs,
    probe: pickBoolean(overrides.probe, section.probe) ?? PIPELINE_STATUS_DEFAULTS.probe,
    artifacts: pickBoolean(overrides.artifacts, section.artifacts) ?? PIPELINE_STATUS_DEFAULTS.artifacts,
  };
}

/**
 * Junta base e caminho **por string**. `new URL(path, base)` descartaria um prefixo
 * de path da base (`new URL('/api/status', 'https://h/pipe/')` → `https://h/api/status`),
 * o que quebraria instalações que servem a API sob um prefixo.
 */
export function pipelineStatusEndpoint(config: PipelineStatusConfig): string {
  const base = config.baseUrl.replace(/\/+$/, '');
  const path = config.statusPath.startsWith('/') ? config.statusPath : `/${config.statusPath}`;
  return `${base}${path}`;
}
