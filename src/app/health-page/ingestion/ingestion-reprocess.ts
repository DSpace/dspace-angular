/** Fase do reprocessamento de um job que falhou, por linha da tabela. */
export type ReprocessPhase = 'idle' | 'loading' | 'done' | 'error';

export interface ReprocessState {
  phase: ReprocessPhase;
  /** Chave i18n do erro quando `phase === 'error'`. */
  errorKey?: string;
}
