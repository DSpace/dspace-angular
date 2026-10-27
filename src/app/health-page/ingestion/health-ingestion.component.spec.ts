import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  DeferBlockState,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  of,
  Subject,
  throwError,
} from 'rxjs';

import { HealthIngestionComponent } from './health-ingestion.component';
import {
  ActiveJob,
  ActiveJobsResponse,
  FailuresResponse,
  IngestionService,
  SucceededJobsResponse,
} from './ingestion.service';

function activeJob(id: string, overrides: Partial<ActiveJob> = {}): ActiveJob {
  return {
    job_id: id,
    status: 'processando',
    stage: 'mineru',
    filename: `${id}.pdf`,
    updated_at: '2026-08-10T10:00:00Z',
    ...overrides,
  };
}

function activeResponse(jobs: ActiveJob[]): ActiveJobsResponse {
  return { count: jobs.length, job_ids: jobs.map((j: ActiveJob) => j.job_id), jobs };
}

const SUCCEEDED: SucceededJobsResponse = {
  count: 1,
  job_ids: ['s1'],
  jobs: [{ job_id: 's1', status: 'concluido', filename: 's1.pdf', item_uuid: 'uuid-1', chunk_count: 12, indexed_count: 12, updated_at: '2026-08-10T09:00:00Z' }],
};

const FAILURES: FailuresResponse = {
  count: 1,
  jobs: [{ job_id: 'f1', status: 'erro', stage: 'llm', filename: 'f1.pdf', error: 'timeout no LLM', updated_at: '2026-08-10T08:00:00Z' }],
};

describe('HealthIngestionComponent', () => {
  let component: HealthIngestionComponent;
  let fixture: ComponentFixture<HealthIngestionComponent>;
  let ingestion: jasmine.SpyObj<IngestionService>;
  let router: RouterStub;

  function setup(queryParams: Params = {}, overrides: Partial<jasmine.SpyObj<IngestionService>> = {}): void {
    ingestion = jasmine.createSpyObj('IngestionService', [
      'getActive', 'getSucceeded', 'getFailures', 'getStatus', 'getResult', 'reprocess',
    ]);
    ingestion.getActive.and.returnValue(of(activeResponse([activeJob('a'), activeJob('b')])));
    ingestion.getSucceeded.and.returnValue(of(SUCCEEDED));
    ingestion.getFailures.and.returnValue(of(FAILURES));
    ingestion.reprocess.and.returnValue(of({}));
    ingestion.getStatus.and.returnValue(of({ job_id: 'job-9', status: 'concluido' }));
    ingestion.getResult.and.returnValue(of({ job_id: 'job-9', status: 'concluido', documents: [] }));
    Object.assign(ingestion, overrides);
    router = new RouterStub();

    TestBed.configureTestingModule({
      imports: [
        HealthIngestionComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
      providers: [
        { provide: IngestionService, useValue: ingestion },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } },
      ],
    });

    fixture = TestBed.createComponent(HealthIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function cards(): number {
    return fixture.debugElement.queryAll(By.css('ds-ingestion-job-card')).length;
  }

  /** Primeira seção (jobs em andamento): as outras duas só carregam ao aparecer. */
  function activeSection(): HTMLElement {
    return fixture.nativeElement.querySelector('ds-ingestion-section');
  }

  afterEach(() => {
    fixture?.destroy();
    TestBed.resetTestingModule();
  });

  describe('componente isolado', () => {
    beforeEach(() => setup());

    it('renderiza as três seções e a consulta por ID', () => {
      expect(fixture.debugElement.queryAll(By.css('ds-ingestion-section')).length).toBe(3);
      expect(fixture.debugElement.query(By.css('ds-ingestion-lookup'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('ds-ingestion-filters'))).not.toBeNull();
    });

    it('usa uma grade responsiva para os cards, sem largura fixa', () => {
      const grid = fixture.debugElement.query(By.css('.ingestion__grid'));

      expect(grid).not.toBeNull();
      expect(grid.nativeElement.getAttribute('style')).toBeNull();
    });
  });

  describe('desempenho: carga sob demanda', () => {
    it('carrega apenas a lista principal no início', () => {
      setup();

      expect(ingestion.getActive).toHaveBeenCalledTimes(1);
      expect(ingestion.getSucceeded).not.toHaveBeenCalled();
      expect(ingestion.getFailures).not.toHaveBeenCalled();
    });

    it('busca a lista de um painel na primeira vez que ele é aberto', () => {
      setup();

      component.onPanelToggle('succeeded', true);

      expect(ingestion.getSucceeded).toHaveBeenCalledTimes(1);
      expect(ingestion.getFailures).not.toHaveBeenCalled();
    });

    it('ignora o evento de abertura de um painel que já estava aberto', () => {
      setup();

      component.onPanelToggle('active', true);

      expect(ingestion.getActive).toHaveBeenCalledTimes(1);
    });

    it('painel recolhido não gasta requisição no ciclo automático', () => {
      setup();
      component.onPanelToggle('failures', true);
      const calls = ingestion.getFailures.calls.count();

      component.onPanelToggle('failures', false);
      component.refreshNow();

      expect(ingestion.getFailures.calls.count()).toBe(calls);
      expect(ingestion.getActive.calls.count()).toBeGreaterThan(1);
    });

    it('reabrir um painel atualiza os dados (o ciclo estava pausado)', () => {
      setup();
      component.onPanelToggle('failures', true);
      component.onPanelToggle('failures', false);
      const calls = ingestion.getFailures.calls.count();

      component.onPanelToggle('failures', true);

      expect(ingestion.getFailures.calls.count()).toBe(calls + 1);
    });

    it('expandir tudo carrega as fontes que faltavam; recolher tudo fecha', () => {
      setup();

      component.toggleAllPanels();

      expect(component.allExpanded()).toBeTrue();
      expect(ingestion.getSucceeded).toHaveBeenCalledTimes(1);
      expect(ingestion.getFailures).toHaveBeenCalledTimes(1);

      component.toggleAllPanels();

      expect(component.allExpanded()).toBeFalse();
      expect(component.openPanels().active).toBeFalse();
    });

    it('pede à API apenas o limite escolhido', () => {
      setup();

      component.onLimitChange(50);

      expect(ingestion.getActive).toHaveBeenCalledWith(50);
    });
  });

  describe('independência entre as fontes', () => {
    it('erro em uma lista não derruba as outras', () => {
      setup({}, {
        getSucceeded: jasmine.createSpy('getSucceeded')
          .and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 }))),
      } as Partial<jasmine.SpyObj<IngestionService>>);

      component.onPanelToggle('succeeded', true);
      component.onPanelToggle('failures', true);
      fixture.detectChanges();

      expect(component.activeSource.state().status).toBe('success');
      expect(component.succeededSource.state().status).toBe('error');
      expect(component.failuresSource.state().status).toBe('success');
      expect(cards()).toBe(2);
    });

    it('mostra exibição parcial quando a atualização falha depois de já ter dados', () => {
      setup();
      ingestion.getActive.and.returnValue(throwError(() => new HttpErrorResponse({ status: 503 })));

      component.refreshNow();
      fixture.detectChanges();

      expect(component.activeSource.state().status).toBe('partial');
      expect(cards()).toBe(2);
      expect(fixture.nativeElement.querySelector('.alert-warning')).not.toBeNull();
    });

    it('avisa uma única vez quando nenhuma fonte responde', () => {
      setup({}, {
        getActive: jasmine.createSpy('getActive')
          .and.returnValue(throwError(() => new HttpErrorResponse({ status: 0 }))),
        getSucceeded: jasmine.createSpy('getSucceeded')
          .and.returnValue(throwError(() => new HttpErrorResponse({ status: 0 }))),
        getFailures: jasmine.createSpy('getFailures')
          .and.returnValue(throwError(() => new HttpErrorResponse({ status: 0 }))),
      } as Partial<jasmine.SpyObj<IngestionService>>);

      component.onPanelToggle('succeeded', true);
      component.onPanelToggle('failures', true);
      fixture.detectChanges();

      expect(component.allOffline()).toBeTrue();
    });
  });

  describe('estados de carregamento', () => {
    it('mostra esqueleto de altura reservada enquanto a resposta não chega', () => {
      const slow = new Subject<ActiveJobsResponse>();
      setup({}, {
        getActive: jasmine.createSpy('getActive').and.returnValue(slow),
      } as Partial<jasmine.SpyObj<IngestionService>>);

      expect(component.activeSource.state().status).toBe('loading');
      expect(activeSection().querySelector('.ingestion-section__skeleton')).not.toBeNull();

      slow.next(activeResponse([activeJob('a')]));
      fixture.detectChanges();

      expect(activeSection().querySelector('.ingestion-section__skeleton')).toBeNull();
      expect(cards()).toBe(1);
    });

    it('mostra mensagem própria quando a lista vem vazia', () => {
      setup({}, {
        getActive: jasmine.createSpy('getActive').and.returnValue(of(activeResponse([]))),
      } as Partial<jasmine.SpyObj<IngestionService>>);

      expect(component.activeSource.state().status).toBe('empty');
      expect(activeSection().querySelector('.ingestion-section__empty')).not.toBeNull();
    });

    it('sobrevive a uma resposta incompleta (sem a lista de jobs)', () => {
      setup({}, {
        getActive: jasmine.createSpy('getActive').and.returnValue(of({ count: 3 } as ActiveJobsResponse)),
      } as Partial<jasmine.SpyObj<IngestionService>>);

      expect(component.activeSource.state().status).toBe('empty');
      expect(cards()).toBe(0);
    });
  });

  describe('erros por código HTTP', () => {
    [
      { status: 401, key: 'health-page.ingestion.state.error.unauthorized', retryable: false },
      { status: 403, key: 'health-page.ingestion.state.error.forbidden', retryable: false },
      { status: 404, key: 'health-page.ingestion.state.error.notfound', retryable: false },
      { status: 429, key: 'health-page.ingestion.state.error.throttled', retryable: true },
      { status: 500, key: 'health-page.ingestion.state.error.server', retryable: true },
    ].forEach((testCase: { status: number, key: string, retryable: boolean }) => {
      it(`explica o erro ${testCase.status} na própria seção`, fakeAsync(() => {
        setup({}, {
          getActive: jasmine.createSpy('getActive')
            .and.returnValue(throwError(() => new HttpErrorResponse({ status: testCase.status }))),
        } as Partial<jasmine.SpyObj<IngestionService>>);
        fixture.detectChanges();

        const state = component.activeSource.state();

        expect(state.error.key).toBe(testCase.key);
        expect(state.status).toBe(testCase.retryable ? 'error' : 'unavailable');
        // Erro definitivo não oferece "tentar de novo" nem agenda reconexão.
        expect(state.retryInSeconds !== null).toBe(testCase.retryable);

        component.ngOnDestroy();
      }));
    });

    it('permite nova tentativa manual de uma seção específica', () => {
      setup({}, {
        getActive: jasmine.createSpy('getActive')
          .and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 }))),
      } as Partial<jasmine.SpyObj<IngestionService>>);
      const calls = ingestion.getActive.calls.count();

      component.retrySection('active');

      expect(ingestion.getActive.calls.count()).toBe(calls + 1);
      component.ngOnDestroy();
    });
  });

  describe('busca, filtros e paginação', () => {
    beforeEach(() => {
      const jobs = Array.from({ length: 23 }, (_, i: number) =>
        activeJob(`job-${i}`, { filename: i === 0 ? 'tese-unica.pdf' : `arquivo-${i}.pdf` }));
      setup();
      ingestion.getActive.and.returnValue(of(activeResponse(jobs)));
      component.refreshNow();
      fixture.detectChanges();
    });

    it('mostra apenas uma página por vez', () => {
      expect(component.activePage().total).toBe(23);
      expect(cards()).toBe(10);
    });

    it('navega entre as páginas', () => {
      component.onPageChange('active', 3);
      fixture.detectChanges();

      expect(cards()).toBe(3);
      expect(component.activePage().from).toBe(21);
    });

    it('respeita o tamanho de página escolhido', () => {
      component.onPageSizeChange(25);
      fixture.detectChanges();

      expect(cards()).toBe(23);
    });

    it('aplica a busca textual com debounce', fakeAsync(() => {
      const box: HTMLInputElement = fixture.nativeElement.querySelector('#ingestion-search');
      box.value = 'tese-unica';
      box.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Antes do debounce, a lista não muda.
      expect(cards()).toBe(10);

      tick(300);
      fixture.detectChanges();

      expect(cards()).toBe(1);
      component.ngOnDestroy();
    }));

    it('Enter aplica a busca sem esperar o debounce', () => {
      const box: HTMLInputElement = fixture.nativeElement.querySelector('#ingestion-search');
      box.value = 'tese-unica';
      fixture.debugElement.query(By.css('form[role="search"]'))
        .triggerEventHandler('submit', new Event('submit'));
      fixture.detectChanges();

      expect(cards()).toBe(1);
    });

    it('volta para a primeira página quando o filtro muda', () => {
      component.onPageChange('active', 3);
      component.onFiltersChange({ q: 'arquivo', status: '', stage: '', sort: 'recent' });
      fixture.detectChanges();

      expect(component.activePage().page).toBe(1);
    });

    it('mostra chips dos filtros ativos e permite limpar tudo', () => {
      component.onFiltersChange({ q: 'tese', status: 'erro', stage: '', sort: 'recent' });
      fixture.detectChanges();

      const chips = fixture.debugElement.queryAll(By.css('.ingestion-chip'));

      expect(chips.length).toBe(2);
      expect(chips[0].nativeElement.getAttribute('aria-label')).toBeTruthy();

      component.clearFilters();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('.ingestion-chip')).length).toBe(0);
      expect(component.hasActiveFilters()).toBeFalse();
    });

    it('explica quando os filtros excluem todos os registros', () => {
      component.onFiltersChange({ q: 'nada-corresponde', status: '', stage: '', sort: 'recent' });
      fixture.detectChanges();

      expect(component.activeFiltered().length).toBe(0);
      expect(cards()).toBe(0);
      expect(fixture.nativeElement.querySelector('.ingestion-section__empty')).not.toBeNull();
    });
  });

  describe('estado na URL', () => {
    it('restaura busca, filtros, paginação e limite ao recarregar', () => {
      setup({ q: 'tese', status: 'erro', sort: 'oldest', size: '25', limit: '200', pa: '2', auto: '0', job: 'job-9' });

      expect(component.filters()).toEqual({ q: 'tese', status: 'erro', stage: '', sort: 'oldest' });
      expect(component.pageSize()).toBe(25);
      expect(component.apiLimit()).toBe(200);
      expect(component.pages().active).toBe(2);
      expect(component.autoReload()).toBeFalse();
      expect(component.lookupJobId()).toBe('job-9');
      expect(ingestion.getActive).toHaveBeenCalledWith(200);
      expect(ingestion.getStatus).toHaveBeenCalledWith('job-9');
    });

    it('restaura os painéis abertos e abre o de consulta quando há job na URL', () => {
      setup({ open: 'failures', job: 'job-9' });

      expect(component.openPanels().active).toBeFalse();
      expect(component.openPanels().failures).toBeTrue();
      expect(component.openPanels().lookup).toBeTrue();
      // Painel fechado não busca: a lista principal não foi consultada.
      expect(ingestion.getActive).not.toHaveBeenCalled();
      expect(ingestion.getFailures).toHaveBeenCalledTimes(1);
    });

    it('trata open=none como todos recolhidos', () => {
      setup({ open: 'none' });

      expect(component.allExpanded()).toBeFalse();
      expect(component.openPanels().active).toBeFalse();
      expect(ingestion.getActive).not.toHaveBeenCalled();
    });

    it('escreve o estado na query string', () => {
      setup();

      component.onFiltersChange({ q: 'tese', status: '', stage: 'llm', sort: 'recent' });
      component.onPageChange('failures', 3);
      fixture.detectChanges();

      const params = router.navigate.calls.mostRecent().args[1].queryParams as Params;

      expect(params.q).toBe('tese');
      expect(params.stage).toBe('llm');
      expect(params.pf).toBe(3);
      // Valores padrão saem da URL.
      expect(params.status).toBeNull();
      expect(params.sort).toBeNull();
      expect(params.open).toBeNull();

      component.onPanelToggle('failures', true);
      fixture.detectChanges();

      expect(router.navigate.calls.mostRecent().args[1].queryParams.open).toBe('active,failures');
    });
  });

  describe('atualização automática', () => {
    it('desliga e liga o ciclo automático, atualizando ao ligar', () => {
      setup();
      const calls = ingestion.getActive.calls.count();

      component.toggleAutoReload();

      expect(component.autoReload()).toBeFalse();
      expect(ingestion.getActive.calls.count()).toBe(calls);

      component.toggleAutoReload();

      expect(component.autoReload()).toBeTrue();
      expect(ingestion.getActive.calls.count()).toBe(calls + 1);
    });

    it('não atualiza (nem anuncia) quando nenhuma lista está aberta', () => {
      setup({ open: 'none' });

      component.refreshNow();

      expect(ingestion.getActive).not.toHaveBeenCalled();
      expect(component.announcement()).toBe('');
      expect(component.anyListOpen()).toBeFalse();
    });

    it('anuncia o fim de uma atualização manual (e só dela)', () => {
      setup();

      expect(component.announcement()).toBe('');

      component.refreshNow();
      fixture.detectChanges();

      expect(component.announcement()).toBe('health-page.ingestion.state.updated');
    });
  });

  describe('reprocessamento', () => {
    it('registra o andamento por linha e atualiza a lista ao concluir', () => {
      setup();
      component.onPanelToggle('failures', true);

      component.reprocess('f1');

      expect(ingestion.reprocess).toHaveBeenCalledWith('f1');
      expect(component.reprocessStates().f1.phase).toBe('done');
    });

    it('mostra o erro da linha quando o reprocessamento falha', () => {
      setup();
      ingestion.reprocess.and.returnValue(throwError(() => new HttpErrorResponse({ status: 403 })));

      component.reprocess('f1');

      expect(component.reprocessStates().f1.phase).toBe('error');
      expect(component.reprocessStates().f1.errorKey).toBe('health-page.ingestion.state.error.forbidden');
    });
  });

  describe('tabelas adiadas', () => {
    it('renderiza a tabela de concluídos quando o painel abre e o bloco adiado entra', async () => {
      setup();
      component.onPanelToggle('succeeded', true);
      fixture.detectChanges();

      const blocks = await fixture.getDeferBlocks();
      await blocks[0].render(DeferBlockState.Complete);

      expect(fixture.debugElement.query(By.css('ds-ingestion-succeeded-table'))).not.toBeNull();
    });
  });

  describe('teclado', () => {
    beforeEach(() => setup());

    it('usa apenas controles nativos para as ações', () => {
      const interactive: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('[role="switch"], .btn, .ingestion-chip'),
      );

      interactive.forEach((el: HTMLElement) => {
        expect(['BUTTON', 'A', 'INPUT', 'SELECT'])
          .withContext(el.outerHTML.slice(0, 80))
          .toContain(el.tagName);
      });
    });

    it('associa rótulo a todos os campos de formulário', () => {
      const fields: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('input, select'),
      );

      expect(fields.length).toBeGreaterThan(0);
      fields.forEach((field: HTMLElement) => {
        const hasLabel = field.id !== ''
          && fixture.nativeElement.querySelector(`label[for="${field.id}"]`) !== null;

        expect(hasLabel || field.getAttribute('aria-label') !== null)
          .withContext(field.outerHTML.slice(0, 80))
          .toBeTrue();
      });
    });

    it('mantém o campo de busca focável', () => {
      const box: HTMLInputElement = fixture.nativeElement.querySelector('#ingestion-search');
      box.focus();

      expect(document.activeElement).toBe(box);
    });
  });

  describe('ciclo de vida', () => {
    it('para o polling e libera as fontes ao destruir', () => {
      setup();

      component.ngOnDestroy();
      const calls = ingestion.getActive.calls.count();
      component.refreshNow();

      expect(ingestion.getActive.calls.count()).toBe(calls);
    });
  });
});
