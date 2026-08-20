import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import {
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  exhaustMap,
  tap,
} from 'rxjs/operators';

import { PipelineAlertsComponent } from './alerts/pipeline-alerts.component';
import { PipelineCapabilitiesComponent } from './capabilities/pipeline-capabilities.component';
import { PipelineComponentCardComponent } from './card/pipeline-component-card.component';
import { PipelineConfigComponent } from './config/pipeline-config.component';
import { PipelineFlowComponent } from './flow/pipeline-flow.component';
import { PipelineHealthHeaderComponent } from './header/pipeline-health-header.component';
import { PipelineStatusResponse } from './pipeline-status.model';
import {
  buildAlerts,
  buildCapabilities,
  buildComponents,
  buildConfig,
  buildFlow,
  buildHeader,
} from './pipeline-status.presenter';
import {
  PipelineStatusError,
  PipelineStatusService,
  toPipelineStatusError,
} from './pipeline-status.service';
import { I18N } from './pipeline-status.view';

/** Mensagem específica por status HTTP; o resto cai na genérica. */
const HTTP_ERROR_KEYS: Record<number, string> = {
  401: `${I18N}.error.unauthorized`,
  403: `${I18N}.error.forbidden`,
  404: `${I18N}.error.notfound`,
  429: `${I18N}.error.throttled`,
  500: `${I18N}.error.server`,
  502: `${I18N}.error.gateway`,
  503: `${I18N}.error.gateway`,
  504: `${I18N}.error.timeout`,
};

/**
 * Painel de saúde da plataforma evidencIA/RDAPP: transforma `GET /api/status` em
 * uma leitura visual — estado geral, capacidades, fluxo do pipeline, componentes
 * e alertas — em vez de JSON cru.
 *
 * A tradução da resposta em rótulos, ícones e métricas fica no
 * `pipeline-status.presenter` (funções puras, testáveis sem DOM); aqui ficam só o
 * ciclo da requisição e a composição das seções.
 */
@Component({
  selector: 'ds-pipeline-status',
  templateUrl: './pipeline-status.component.html',
  styleUrls: ['./pipeline-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PipelineAlertsComponent,
    PipelineCapabilitiesComponent,
    PipelineComponentCardComponent,
    PipelineConfigComponent,
    PipelineFlowComponent,
    PipelineHealthHeaderComponent,
    TranslatePipe,
  ],
})
export class PipelineStatusComponent implements OnInit {

  /** Última resposta válida. Sobrevive a uma falha de atualização. */
  readonly data = signal<PipelineStatusResponse | null>(null);
  readonly error = signal<PipelineStatusError | null>(null);
  readonly loading = signal(false);
  /** Chave i18n anunciada para leitores de tela. */
  readonly announcement = signal('');

  private readonly service = inject(PipelineStatusService);
  private readonly reload$ = new Subject<void>();

  /** Carregamento inicial: ainda não há nada na tela. */
  readonly firstLoad = computed(() => this.loading() && this.data() === null);
  /** Atualização: mantém o painel visível. */
  readonly refreshing = computed(() => this.loading() && this.data() !== null);
  /** Falhou e não há resposta anterior para mostrar. */
  readonly blankError = computed(() => this.error() !== null && this.data() === null);
  /** Falhou na atualização, mas o painel anterior continua válido. */
  readonly staleData = computed(() => this.error() !== null && this.data() !== null);

  readonly errorKey = computed(() => {
    const error = this.error();
    if (error === null) {
      return '';
    }
    if (error.kind === 'http') {
      return HTTP_ERROR_KEYS[error.status] ?? `${I18N}.error.http`;
    }
    return `${I18N}.error.${error.kind}`;
  });

  readonly header = computed(() => this.withData(buildHeader));
  readonly capabilities = computed(() => this.withData(buildCapabilities) ?? []);
  readonly flow = computed(() => this.withData(buildFlow) ?? []);
  readonly components = computed(() => this.withData(buildComponents) ?? []);
  readonly alerts = computed(() => this.withData(buildAlerts) ?? []);
  readonly config = computed(() => this.withData(buildConfig) ?? []);

  constructor() {
    this.reload$.pipe(
      tap(() => {
        this.loading.set(true);
        this.announcement.set(`${I18N}.state.loading`);
      }),
      // exhaustMap: clique repetido não empilha requisição nem deixa resposta
      // antiga sobrescrever a mais recente.
      exhaustMap(() => this.service.getStatus().pipe(
        tap((response: PipelineStatusResponse) => {
          this.data.set(response);
          this.error.set(null);
          this.announcement.set(`${I18N}.state.updated`);
        }),
        catchError((err: unknown) => {
          this.error.set(toPipelineStatusError(err));
          this.announcement.set(`${I18N}.state.failed`);
          return of(null);
        }),
      )),
      tap(() => this.loading.set(false)),
      takeUntilDestroyed(),
    ).subscribe();
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.reload$.next();
  }

  private withData<T>(build: (response: PipelineStatusResponse) => T): T | null {
    const response = this.data();
    return response === null ? null : build(response);
  }
}
