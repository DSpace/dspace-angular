import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import {
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import {
  IngestionService,
  JobResult,
  JobStatus,
} from '../ingestion.service';
import { prefersReducedMotion } from '../ingestion-motion';
import {
  NON_SUCCESS,
  normalizeStatus,
  statusBadgeClass,
  statusLabelKey,
} from '../ingestion-stages';
import {
  errorStatus,
  toSectionError,
} from '../ingestion-state';
import { IngestionStepperComponent } from '../stepper/ingestion-stepper.component';

/** Resultado de uma consulta, já reduzido ao que o template precisa. */
interface LookupOutcome {
  status: JobStatus | null;
  result: JobResult | null;
  /** Motivo pelo qual o resultado não veio, sendo o job válido. */
  resultKey: string | null;
  errorKey: string | null;
  notFound: boolean;
}

const EMPTY_OUTCOME: LookupOutcome = {
  status: null,
  result: null,
  resultKey: null,
  errorKey: null,
  notFound: false,
};

/**
 * Consulta de um job pelo ID. Fonte independente das listas: um erro aqui não
 * afeta as demais seções. `switchMap` garante que uma consulta anterior mais
 * lenta não sobrescreva o resultado da consulta mais recente.
 */
@Component({
  selector: 'ds-ingestion-lookup',
  templateUrl: './ingestion-lookup.component.html',
  styleUrls: ['./ingestion-lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BtnDisabledDirective,
    IngestionStepperComponent,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    TranslatePipe,
  ],
})
export class IngestionLookupComponent implements OnInit {

  /** ID vindo da URL, para a consulta sobreviver a um recarregamento. */
  readonly initialJobId = input<string>('');
  /** Painel recolhido. O pai é o dono deste estado (ele vai para a URL). */
  readonly collapsed = input(true);

  readonly jobIdChange = output<string>();
  /** Abriu (`true`) ou recolheu (`false`) — só em mudança real de estado. */
  readonly openChange = output<boolean>();

  /** Animação do accordion desligada quando o sistema pede menos movimento. */
  readonly animated = !prefersReducedMotion(isPlatformBrowser(inject(PLATFORM_ID)));

  readonly loading = signal(false);
  readonly outcome = signal<LookupOutcome>(EMPTY_OUTCOME);
  /** Submissão sem ID: mensagem junto do campo. */
  readonly invalid = signal(false);
  readonly submittedId = signal('');

  private readonly ingestion = inject(IngestionService);
  private readonly box = viewChild<ElementRef<HTMLInputElement>>('jobIdBox');
  private readonly submit$ = new Subject<string>();

  constructor() {
    this.submit$.pipe(
      tap((id: string) => {
        this.loading.set(true);
        this.invalid.set(false);
        this.outcome.set(EMPTY_OUTCOME);
        this.submittedId.set(id);
      }),
      // switchMap: descarta a resposta da consulta anterior.
      switchMap((id: string) => this.ingestion.getStatus(id).pipe(
        switchMap((status: JobStatus) => {
          if (NON_SUCCESS.includes(normalizeStatus(status.status))) {
            // Job existe mas ainda não concluiu: não há resultado a pedir.
            return of({
              ...EMPTY_OUTCOME,
              status,
              resultKey: `health-page.ingestion.lookup.result-${normalizeStatus(status.status) === 'erro' ? 'failed' : 'pending'}`,
            });
          }
          return this.ingestion.getResult(id).pipe(
            map((result: JobResult) => ({ ...EMPTY_OUTCOME, status, result })),
            catchError((err: unknown) => of({
              ...EMPTY_OUTCOME,
              status,
              resultKey: this.resultErrorKey(err),
            })),
          );
        }),
        catchError((err: unknown) => of({
          ...EMPTY_OUTCOME,
          errorKey: toSectionError(err).key,
          notFound: errorStatus(err) === 404,
        })),
      )),
      takeUntilDestroyed(),
    ).subscribe((outcome: LookupOutcome) => {
      this.loading.set(false);
      this.outcome.set(outcome);
    });
  }

  ngOnInit(): void {
    const id = this.initialJobId().trim();
    if (id !== '') {
      this.submit$.next(id);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const id = (this.box()?.nativeElement.value ?? '').trim();
    if (id === '') {
      this.invalid.set(true);
      this.box()?.nativeElement.focus();
      return;
    }
    this.jobIdChange.emit(id);
    this.submit$.next(id);
  }

  retry(): void {
    const id = this.submittedId();
    if (id !== '') {
      this.submit$.next(id);
    }
  }

  clear(): void {
    const box = this.box()?.nativeElement;
    if (box) {
      box.value = '';
    }
    this.invalid.set(false);
    this.outcome.set(EMPTY_OUTCOME);
    this.submittedId.set('');
    this.jobIdChange.emit('');
  }

  badgeClass(status?: string): string {
    return statusBadgeClass(status);
  }

  statusKey(status?: string): string {
    return statusLabelKey(status);
  }

  /** 409 = ainda processando, 422 = terminou em erro: não são falhas da consulta. */
  private resultErrorKey(err: unknown): string {
    switch (errorStatus(err)) {
      case 409:
        return 'health-page.ingestion.lookup.result-pending';
      case 422:
        return 'health-page.ingestion.lookup.result-failed';
      case 404:
        return 'health-page.ingestion.lookup.result-missing';
      default:
        return toSectionError(err).key;
    }
  }
}
