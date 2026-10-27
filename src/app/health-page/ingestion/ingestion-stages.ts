import {
  ActiveJob,
  FailedJob,
  JobStatus,
  SucceededJob,
} from './ingestion.service';

/** Qualquer job exibido pela aba, independente da fonte. */
export type IngestionJob = ActiveJob | SucceededJob | FailedJob | JobStatus;

/** Estágios do pipeline, em ordem (infográfico). `key` = sufixo i18n. */
export const STAGES = ['queued', 'download', 'mineru', 'llm', 'index', 'done'] as const;
export type StageKey = typeof STAGES[number];

/** Estado visual de um passo do stepper. */
export type StepState = 'done' | 'active' | 'error' | 'pending';

/** Mapeia o campo `stage` do job para o índice do passo em execução. */
const STAGE_TO_STEP: Record<string, number> = {
  queued: 0,
  download: 1,
  mineru: 2,
  extraction: 2,
  llm: 3,
  enrichment: 3,
  index: 4,
  indexing: 4,
  done: 5,
};

/** Situações canônicas usadas em badges e no filtro de situação. */
export const JOB_STATUSES = ['na_fila', 'processando', 'erro', 'concluido'] as const;
export type JobStatusKey = typeof JOB_STATUSES[number];

/** Situações que ainda não são "concluído com sucesso". */
export const NON_SUCCESS: string[] = ['processando', 'na_fila', 'erro'];

/** Normaliza as variações vindas da API para uma das situações canônicas. */
export function normalizeStatus(status?: string): JobStatusKey | '' {
  const value = (status ?? '').trim().toLowerCase();
  if (value === '') {
    return '';
  }
  if (value === 'na_fila' || value === 'queued' || value === 'na fila') {
    return 'na_fila';
  }
  if (value === 'processando' || value === 'processing' || value === 'running') {
    return 'processando';
  }
  if (value === 'erro' || value === 'error' || value === 'failed' || value === 'failure') {
    return 'erro';
  }
  return 'concluido';
}

/** Chave i18n do rótulo de uma situação. */
export function statusLabelKey(status?: string): string {
  const normalized = normalizeStatus(status);
  return normalized === '' ? 'health-page.ingestion.status.unknown' : `health-page.ingestion.status.${normalized}`;
}

/** Classe do badge de situação (usa as cores do tema via Bootstrap). */
export function statusBadgeClass(status?: string): string {
  switch (normalizeStatus(status)) {
    case 'processando':
      return 'badge bg-primary';
    case 'na_fila':
      return 'badge bg-info text-dark';
    case 'erro':
      return 'badge bg-danger';
    case 'concluido':
      return 'badge bg-success';
    default:
      return 'badge bg-secondary';
  }
}

/** O job terminou em erro. */
export function isErrorJob(job: IngestionJob | null | undefined): boolean {
  return normalizeStatus(job?.status) === 'erro';
}

/** Índice do passo atual (0..STAGES.length-1) a partir de situação e estágio. */
export function currentStep(job: IngestionJob | null | undefined): number {
  if (!job) {
    return 0;
  }
  const status = normalizeStatus(job.status);
  if (status === 'na_fila') {
    return 0;
  }
  if (status === 'concluido') {
    return STAGES.length - 1;
  }
  // processando | erro → posição vem do campo `stage`
  return STAGE_TO_STEP[(job.stage ?? '').toLowerCase()] ?? 0;
}

/** Estado visual de um passo do stepper para um job. */
export function stepState(job: IngestionJob, index: number): StepState {
  const current = currentStep(job);
  if (isErrorJob(job) && index === current) {
    return 'error';
  }
  if (index < current) {
    return 'done';
  }
  if (index === current) {
    return 'active';
  }
  return 'pending';
}

/** Chave i18n do rótulo de um estágio. */
export function stageLabelKey(stage: StageKey | string): string {
  return `health-page.ingestion.stage.${stage}`;
}
