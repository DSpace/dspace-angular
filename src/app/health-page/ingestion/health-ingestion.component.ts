import {
  DatePipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  merge,
  Subject,
  timer,
} from 'rxjs';
import {
  exhaustMap,
  filter,
  take,
  takeUntil,
} from 'rxjs/operators';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { IngestionFailuresTableComponent } from './failures/ingestion-failures-table.component';
import { IngestionFiltersComponent } from './filters/ingestion-filters.component';
import {
  ActiveJobsResponse,
  FailuresResponse,
  IngestionService,
  SucceededJobsResponse,
} from './ingestion.service';
import {
  allPanels,
  API_LIMITS,
  applyFilters,
  DEFAULT_API_LIMIT,
  DEFAULT_FILTERS,
  DEFAULT_OPEN_PANELS,
  DEFAULT_PAGE_SIZE,
  filtersAreDefault,
  filtersFromParams,
  filtersToParams,
  IngestionFilters,
  intFromParam,
  OpenPanels,
  PAGE_SIZES,
  paginate,
  PANEL_KEYS,
  PanelKey,
  panelsFromParam,
  panelsToParam,
  stringFromParam,
} from './ingestion-filters';
import { ReprocessState } from './ingestion-reprocess';
import {
  IngestionSource,
  TriggerReason,
} from './ingestion-source';
import {
  isBusy,
  SectionState,
  toSectionError,
} from './ingestion-state';
import { IngestionJobCardComponent } from './job-card/ingestion-job-card.component';
import { IngestionLookupComponent } from './lookup/ingestion-lookup.component';
import { IngestionPaginationComponent } from './pagination/ingestion-pagination.component';
import { IngestionSectionComponent } from './section/ingestion-section.component';
import { IngestionSucceededTableComponent } from './succeeded/ingestion-succeeded-table.component';

/** As três listas da aba, cada uma com sua própria fonte e paginação. */
type SectionKey = 'active' | 'succeeded' | 'failures';

/**
 * Aba "Ingestão" da health page: acompanha o pipeline de ingestão (evidencia_pipe).
 *
 * As três listas são fontes independentes — cada uma tem seu próprio ciclo de
 * carregamento, erro e reconexão, e uma API fora do ar só afeta a própria seção.
 * As chamadas são paralelas (nenhuma espera pela outra).
 *
 * Cada seção é um painel colapsável: **painel fechado não consome rede** (a API dele
 * nem é chamada até a primeira abertura, e o ciclo de 5 s ignora quem está recolhido).
 * Abrir um painel busca dados na hora. Painéis abertos, busca, filtros, ordenação e
 * paginação ficam na URL para sobreviver a um recarregamento.
 */
@Component({
  selector: 'ds-health-ingestion',
  templateUrl: './health-ingestion.component.html',
  styleUrls: ['./health-ingestion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BtnDisabledDirective,
    DatePipe,
    IngestionFailuresTableComponent,
    IngestionFiltersComponent,
    IngestionJobCardComponent,
    IngestionLookupComponent,
    IngestionPaginationComponent,
    IngestionSectionComponent,
    IngestionSucceededTableComponent,
    TranslatePipe,
  ],
})
export class HealthIngestionComponent implements OnInit, OnDestroy {

  /** Intervalo do auto-reload (ms). */
  readonly refreshMs = 5000;

  // ------------------------------------------------------------ Estado da UI
  readonly filters = signal<IngestionFilters>({ ...DEFAULT_FILTERS });
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);
  /** Limite pedido à API (a API não oferece offset nem filtro server-side). */
  readonly apiLimit = signal(DEFAULT_API_LIMIT);
  readonly pages = signal<Record<SectionKey, number>>({ active: 1, succeeded: 1, failures: 1 });
  readonly autoReload = signal(true);
  /** Quais painéis estão abertos (só o primeiro, por padrão). */
  readonly openPanels = signal<OpenPanels>({ ...DEFAULT_OPEN_PANELS });
  readonly lookupJobId = signal('');
  readonly reprocessStates = signal<Record<string, ReprocessState>>({});
  /** Chave i18n anunciada por leitores de tela após uma atualização manual. */
  readonly announcement = signal('');

  private readonly ingestion = inject(IngestionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroy$ = new Subject<void>();
  /** Ticks compartilhados (timer + botão "Atualizar agora"). */
  private readonly tick$ = new Subject<TriggerReason>();
  /** Uma atualização manual está em curso (para anunciar quando terminar). */
  private readonly manualPending = signal(false);

  // ---------------------------------------------------------------- Fontes
  readonly activeSource = new IngestionSource<ActiveJobsResponse>(
    (limit: number) => this.ingestion.getActive(limit),
    (data: ActiveJobsResponse) => (data.jobs ?? []).length === 0,
    () => this.autoReload() && this.openPanels().active,
  );

  readonly succeededSource = new IngestionSource<SucceededJobsResponse>(
    (limit: number) => this.ingestion.getSucceeded(limit),
    (data: SucceededJobsResponse) => (data.jobs ?? []).length === 0,
    () => this.autoReload() && this.openPanels().succeeded,
  );

  readonly failuresSource = new IngestionSource<FailuresResponse>(
    (limit: number) => this.ingestion.getFailures(limit),
    (data: FailuresResponse) => (data.jobs ?? []).length === 0,
    () => this.autoReload() && this.openPanels().failures,
  );

  // ------------------------------------------------- Listas já filtradas
  readonly activeFiltered = computed(() =>
    applyFilters(this.activeSource.state().data?.jobs ?? [], this.filters()));
  readonly succeededFiltered = computed(() =>
    applyFilters(this.succeededSource.state().data?.jobs ?? [], this.filters()));
  readonly failuresFiltered = computed(() =>
    applyFilters(this.failuresSource.state().data?.jobs ?? [], this.filters()));

  readonly activePage = computed(() =>
    paginate(this.activeFiltered(), this.pages().active, this.pageSize()));
  readonly succeededPage = computed(() =>
    paginate(this.succeededFiltered(), this.pages().succeeded, this.pageSize()));
  readonly failuresPage = computed(() =>
    paginate(this.failuresFiltered(), this.pages().failures, this.pageSize()));

  // ------------------------------------------------------- Estado agregado
  readonly hasActiveFilters = computed(() => !filtersAreDefault(this.filters()));

  readonly allExpanded = computed(() =>
    PANEL_KEYS.every((key: PanelKey) => this.openPanels()[key]));

  /** Há alguma lista aberta para atualizar (painel fechado não busca). */
  readonly anyListOpen = computed(() => {
    const panels = this.openPanels();
    return panels.active || panels.succeeded || panels.failures;
  });

  readonly busy = computed(() => isBusy(this.activeSource.state())
    || isBusy(this.succeededSource.state())
    || isBusy(this.failuresSource.state()));

  readonly lastUpdated = computed<Date | null>(() => {
    const stamps = this.states()
      .map((state: SectionState<unknown>) => state.lastUpdated)
      .filter((date: Date | null): boolean => date !== null)
      .map((date: Date) => date.getTime());
    return stamps.length === 0 ? null : new Date(Math.max(...stamps));
  });

  /** Nenhuma fonte iniciada respondeu e todas falharam por rede/CORS. */
  readonly allOffline = computed(() => {
    const started = this.states().filter((state: SectionState<unknown>) => state.status !== 'idle');
    return started.length > 0
      && started.every((state: SectionState<unknown>) => state.error?.status === 0);
  });

  constructor() {
    // Anuncia só o fim de atualizações manuais: ligar o live region ao ciclo
    // automático faria o leitor de tela falar a cada 5 segundos.
    effect(() => {
      if (!this.busy() && this.manualPending()) {
        this.manualPending.set(false);
        this.announcement.set('health-page.ingestion.state.updated');
      }
    });

    // Espelha o estado na URL: recarregar a página mantém busca, filtros,
    // ordenação, paginação, limite e a consulta por ID.
    effect(() => {
      const queryParams: Params = {
        ...filtersToParams(this.filters()),
        size: this.pageSize() === DEFAULT_PAGE_SIZE ? null : this.pageSize(),
        limit: this.apiLimit() === DEFAULT_API_LIMIT ? null : this.apiLimit(),
        auto: this.autoReload() ? null : '0',
        pa: this.pageOrNull('active'),
        ps: this.pageOrNull('succeeded'),
        pf: this.pageOrNull('failures'),
        open: panelsToParam(this.openPanels()),
        job: this.lookupJobId() === '' ? null : this.lookupJobId(),
      };
      if (this.isBrowser) {
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  ngOnInit(): void {
    this.readStateFromUrl();
    if (!this.isBrowser) {
      // Não consulta a API externa durante o SSR.
      return;
    }
    // Só as fontes dos painéis abertos são buscadas; as demais esperam a abertura.
    this.startOpenPanels(false);

    timer(this.refreshMs, this.refreshMs).pipe(
      filter(() => this.autoReload()),
      takeUntil(this.destroy$),
    ).subscribe(() => this.tick$.next('auto'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tick$.complete();
    this.activeSource.dispose();
    this.succeededSource.dispose();
    this.failuresSource.dispose();
  }

  // ------------------------------------------------------------- Comandos
  /**
   * Painel abriu ou recolheu. Abrir busca os dados (primeira vez) ou atualiza
   * (o ciclo automático ignora painel recolhido, então o conteúdo estaria velho).
   */
  onPanelToggle(key: PanelKey, open: boolean): void {
    if (this.openPanels()[key] === open) {
      // Evento do estado inicial: já está refletido.
      return;
    }
    this.openPanels.update((panels: OpenPanels) => ({ ...panels, [key]: open }));
    if (open) {
      this.loadPanel(key, true);
    }
  }

  /** Abre ou recolhe todos os painéis de uma vez. */
  toggleAllPanels(): void {
    const open = !this.allExpanded();
    this.openPanels.set(allPanels(open));
    if (open) {
      // Sem forçar atualização: o próximo tick cuida de quem já tinha dados.
      this.startOpenPanels(false);
    }
  }

  refreshNow(): void {
    if (!this.anyListOpen()) {
      return;
    }
    this.manualPending.set(true);
    this.announcement.set('health-page.ingestion.state.refreshing');
    this.tick$.next('manual');
  }

  /** Nova tentativa de uma seção específica, sem esperar o backoff. */
  retrySection(key: SectionKey): void {
    if (key === 'succeeded') {
      this.succeededSource.retryNow();
    } else if (key === 'failures') {
      this.failuresSource.retryNow();
    } else {
      this.activeSource.retryNow();
    }
  }

  toggleAutoReload(): void {
    this.autoReload.update((on: boolean) => !on);
    if (this.autoReload()) {
      this.refreshNow();
    }
  }

  onFiltersChange(filters: IngestionFilters): void {
    this.filters.set(filters);
    // Filtro novo: volta para a primeira página de todas as listas.
    this.pages.set({ active: 1, succeeded: 1, failures: 1 });
  }

  clearFilters(): void {
    this.onFiltersChange({ ...DEFAULT_FILTERS });
  }

  onLimitChange(limit: number): void {
    this.apiLimit.set(limit);
    this.refreshNow();
  }

  onPageChange(key: SectionKey, page: number): void {
    this.pages.update((pages: Record<SectionKey, number>) => ({ ...pages, [key]: page }));
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.pages.set({ active: 1, succeeded: 1, failures: 1 });
  }

  onLookupJobIdChange(jobId: string): void {
    this.lookupJobId.set(jobId);
  }

  /** Re-enfileira um job que falhou (já confirmado pela tabela). */
  reprocess(jobId: string): void {
    this.setReprocessState(jobId, { phase: 'loading' });
    this.ingestion.reprocess(jobId).pipe(
      take(1),
      takeUntil(this.destroy$),
    ).subscribe({
      next: () => {
        this.setReprocessState(jobId, { phase: 'done' });
        this.refreshNow();
      },
      error: (err: unknown) => this.setReprocessState(jobId, {
        phase: 'error',
        errorKey: toSectionError(err).key,
      }),
    });
  }

  // ------------------------------------------------------------- Internos
  /** Carrega as fontes de todos os painéis abertos. */
  private startOpenPanels(refreshIfStarted: boolean): void {
    PANEL_KEYS.forEach((key: PanelKey) => {
      if (this.openPanels()[key]) {
        this.loadPanel(key, refreshIfStarted);
      }
    });
  }

  /** Despacha para a fonte do painel (o de consulta por ID cuida de si mesmo). */
  private loadPanel(key: PanelKey, refreshIfStarted: boolean): void {
    switch (key) {
      case 'active':
        this.startOrRefresh('active', this.activeSource, refreshIfStarted);
        break;
      case 'succeeded':
        this.startOrRefresh('succeeded', this.succeededSource, refreshIfStarted);
        break;
      case 'failures':
        this.startOrRefresh('failures', this.failuresSource, refreshIfStarted);
        break;
      default:
        break;
    }
  }

  private startOrRefresh<T>(key: SectionKey, source: IngestionSource<T>, refreshIfStarted: boolean): void {
    if (!this.isBrowser) {
      return;
    }
    if (!source.isStarted) {
      this.startSource(key, source);
      source.run('initial', this.apiLimit()).pipe(take(1)).subscribe();
    } else if (refreshIfStarted) {
      // Passa pelo mesmo `exhaustMap`, então não concorre com uma carga em voo.
      source.retryNow();
    }
  }

  private startSource<T>(key: SectionKey, source: IngestionSource<T>): void {
    merge(this.tick$, source.retry$).pipe(
      // Painel recolhido não gasta requisição: ao abrir, `onPanelToggle` atualiza.
      filter(() => this.openPanels()[key]),
      // exhaustMap: enquanto uma carga está em voo, ticks novos são ignorados —
      // sem fila de requisições e sem resposta antiga sobrescrevendo a recente.
      exhaustMap((reason: TriggerReason) => source.run(reason, this.apiLimit())),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  private states(): SectionState<unknown>[] {
    return [
      this.activeSource.state(),
      this.succeededSource.state(),
      this.failuresSource.state(),
    ];
  }

  private pageOrNull(key: SectionKey): number | null {
    const page = this.pages()[key];
    return page === 1 ? null : page;
  }

  private setReprocessState(jobId: string, state: ReprocessState): void {
    this.reprocessStates.update((states: Record<string, ReprocessState>) => ({
      ...states,
      [jobId]: state,
    }));
  }

  private readStateFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    this.filters.set(filtersFromParams(params));
    this.pageSize.set(intFromParam(params, 'size', DEFAULT_PAGE_SIZE, PAGE_SIZES));
    this.apiLimit.set(intFromParam(params, 'limit', DEFAULT_API_LIMIT, API_LIMITS));
    this.pages.set({
      active: intFromParam(params, 'pa', 1),
      succeeded: intFromParam(params, 'ps', 1),
      failures: intFromParam(params, 'pf', 1),
    });
    this.autoReload.set(stringFromParam(params, 'auto') !== '0');
    const job = stringFromParam(params, 'job');
    this.lookupJobId.set(job);
    this.openPanels.set(panelsFromParam(params, job !== ''));
  }
}
