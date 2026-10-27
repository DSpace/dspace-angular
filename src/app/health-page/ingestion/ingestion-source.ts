import {
  signal,
  WritableSignal,
} from '@angular/core';
import {
  defer,
  Observable,
  of,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import {
  catchError,
  map,
  take,
} from 'rxjs/operators';

import {
  hasData,
  idleSectionState,
  retryDelaySeconds,
  SectionState,
  toSectionError,
} from './ingestion-state';

/** Motivo pelo qual uma carga foi disparada (usado só para telemetria/estado). */
export type TriggerReason = 'initial' | 'auto' | 'manual' | 'retry';

/**
 * Uma fonte de dados independente da aba de ingestão (jobs ativos, concluídos,
 * falhas). Encapsula o estado da seção, o mapeamento de erros e o backoff de
 * reconexão. Cada instância falha por conta própria: o erro de uma nunca derruba
 * as outras nem a página.
 */
export class IngestionSource<T> {

  /** Estado observável pela seção correspondente. */
  readonly state: WritableSignal<SectionState<T>> = signal(idleSectionState<T>());

  /** Emite quando o backoff decidiu que é hora de tentar novamente. */
  readonly retry$ = new Subject<TriggerReason>();

  private countdown: Subscription | null = null;
  private started = false;

  constructor(
    /** Faz a chamada HTTP com o limite pedido à API. */
    private readonly fetcher: (limit: number) => Observable<T>,
    /** Decide se o payload recebido conta como "vazio". */
    private readonly isEmpty: (data: T) => boolean,
    /** Se a reconexão automática está habilitada no momento. */
    private readonly autoRetryEnabled: () => boolean = () => true,
  ) {
  }

  /** A fonte já foi carregada ao menos uma vez (APIs adiadas começam `false`). */
  get isStarted(): boolean {
    return this.started;
  }

  /**
   * Executa uma carga. Nunca lança: o erro vira estado da própria seção.
   * O `defer` garante que o estado só muda quando alguém se inscreve.
   */
  run(reason: TriggerReason, limit: number): Observable<void> {
    return defer(() => {
      this.started = true;
      this.cancelCountdown();
      this.state.update((s) => ({
        ...s,
        status: hasData(s) ? 'refreshing' : 'loading',
        retryInSeconds: null,
      }));
      return this.fetcher(limit).pipe(
        map((data: T) => this.onData(data)),
        catchError((err: unknown) => {
          this.onError(err);
          return of(undefined);
        }),
      );
    });
  }

  /** Tentativa manual imediata (botão "Tentar de novo"). */
  retryNow(): void {
    this.cancelCountdown();
    this.retry$.next('manual');
  }

  /** Libera o contador de reconexão e fecha o canal de retry. */
  dispose(): void {
    this.cancelCountdown();
    this.retry$.complete();
  }

  private onData(data: T): void {
    this.state.set({
      status: this.isEmpty(data) ? 'empty' : 'success',
      data,
      error: null,
      lastUpdated: new Date(),
      attempts: 0,
      retryInSeconds: null,
    });
  }

  private onError(err: unknown): void {
    const error = toSectionError(err);
    this.state.update((s) => ({
      ...s,
      // Mantém `data` para exibição parcial: erro não apaga o que já funcionava.
      status: !error.retryable ? 'unavailable' : (hasData(s) ? 'partial' : 'error'),
      error,
      attempts: s.attempts + 1,
    }));
    if (error.retryable && this.autoRetryEnabled()) {
      this.scheduleRetry();
    }
  }

  /** Agenda a próxima tentativa e expõe a contagem regressiva para a UI. */
  private scheduleRetry(): void {
    const seconds = retryDelaySeconds(this.state().attempts);
    this.state.update((s) => ({ ...s, retryInSeconds: seconds }));
    this.countdown = timer(1000, 1000).pipe(take(seconds)).subscribe({
      next: (i: number) => this.state.update((s) => ({
        ...s,
        retryInSeconds: Math.max(0, seconds - i - 1),
      })),
      complete: () => {
        this.countdown = null;
        this.retry$.next('retry');
      },
    });
  }

  private cancelCountdown(): void {
    this.countdown?.unsubscribe();
    this.countdown = null;
  }
}
