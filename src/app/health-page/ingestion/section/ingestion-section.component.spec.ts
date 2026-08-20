import {
  Component,
  signal,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import {
  SectionState,
  SectionStatus,
} from '../ingestion-state';
import { IngestionSectionComponent } from './ingestion-section.component';

/** Hospedeiro para conferir que o conteúdo só é projetado quando há o que mostrar. */
@Component({
  selector: 'ds-test-host',
  template: `
    <ds-ingestion-section sectionId="active"
                          headingKey="heading"
                          emptyKey="empty"
                          [state]="state()"
                          [count]="count()"
                          [visibleCount]="visibleCount()"
                          [hasActiveFilters]="hasActiveFilters()"
                          [collapsed]="collapsed()"
                          (openChange)="opened.push($event)">
      <p class="projected">conteúdo</p>
    </ds-ingestion-section>`,
  imports: [
    IngestionSectionComponent,
  ],
})
class TestHostComponent {
  readonly state = signal<SectionState<unknown>>(state('idle'));
  readonly count = signal<number | null>(null);
  readonly visibleCount = signal<number | null>(null);
  readonly hasActiveFilters = signal(false);
  readonly collapsed = signal(false);
  readonly opened: boolean[] = [];
}

function state(status: SectionStatus, overrides: Partial<SectionState<unknown>> = {}): SectionState<unknown> {
  return {
    status,
    data: null,
    error: null,
    lastUpdated: null,
    attempts: 0,
    retryInSeconds: null,
    ...overrides,
  };
}

describe('IngestionSectionComponent', () => {
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function has(selector: string): boolean {
    return fixture.debugElement.query(By.css(selector)) !== null;
  }

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[ngbAccordionButton]');
  }

  describe('painel colapsável', () => {
    it('monta um item de accordion com o título no cabeçalho', () => {
      expect(has('.accordion .accordion-item')).toBeTrue();
      expect(button().textContent.trim()).toContain('heading');
    });

    it('recolhido, não renderiza o corpo', () => {
      host.collapsed.set(true);
      fixture.detectChanges();

      expect(button().getAttribute('aria-expanded')).toBe('false');
      expect(has('.projected')).toBeFalse();
    });

    it('avisa o pai ao recolher e ao abrir', () => {
      // A abertura inicial (collapsed=false na primeira ligação) já emite `true`;
      // o pai ignora esse evento porque o painel já consta como aberto.
      expect(host.opened).toEqual([true]);

      button().click();
      fixture.detectChanges();

      expect(host.opened).toEqual([true, false]);

      button().click();
      fixture.detectChanges();

      expect(host.opened).toEqual([true, false, true]);
    });

    it('recolher tira o conteúdo do DOM, não só esconde', () => {
      host.state.set(state('success', { data: { jobs: [1] } }));
      host.visibleCount.set(1);
      fixture.detectChanges();

      expect(has('.projected')).toBeTrue();

      // Com animação, o corpo só sai do DOM quando a transição termina. Desligar a
      // animação (o mesmo que acontece com prefers-reduced-motion) torna a remoção
      // síncrona e o teste determinístico.
      const section = fixture.debugElement.query(By.directive(IngestionSectionComponent));
      (section.componentInstance as { animated: boolean }).animated = false;
      host.collapsed.set(true);
      fixture.detectChanges();

      expect(has('.projected')).toBeFalse();
    });

    it('liga o botão ao corpo por aria-controls', () => {
      const controls = button().getAttribute('aria-controls');

      expect(controls).toBeTruthy();
      expect(fixture.nativeElement.querySelector(`#${controls}`)).not.toBeNull();
    });

    it('mostra o total no cabeçalho, com rótulo acessível', () => {
      host.state.set(state('success', { data: { jobs: [1] } }));
      host.count.set(7);
      fixture.detectChanges();

      const badge = fixture.debugElement.query(By.css('.ingestion-panel__count'));

      expect(badge.nativeElement.textContent.trim()).toBe('7');
      expect(badge.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('denuncia erro no cabeçalho mesmo recolhido', () => {
      host.collapsed.set(true);
      host.state.set(state('error', { error: { status: 500, key: 'erro.server', retryable: true } }));
      fixture.detectChanges();

      expect(has('.ingestion-panel__badge .bg-danger')).toBeTrue();
      expect(has('.projected')).toBeFalse();
    });

    it('sinaliza dados desatualizados e indisponibilidade no cabeçalho', () => {
      host.collapsed.set(true);
      host.state.set(state('partial', {
        data: { jobs: [1] },
        error: { status: 503, key: 'erro.gateway', retryable: true },
      }));
      fixture.detectChanges();

      expect(has('.ingestion-panel__badge .bg-warning')).toBeTrue();

      host.state.set(state('unavailable', {
        error: { status: 403, key: 'erro.forbidden', retryable: false },
      }));
      fixture.detectChanges();

      expect(has('.ingestion-panel__badge .bg-secondary')).toBeTrue();
    });

    it('mostra o spinner no cabeçalho durante a atualização', () => {
      host.state.set(state('refreshing', { data: { jobs: [] } }));
      fixture.detectChanges();

      expect(has('.ingestion-panel__badge .spinner-border')).toBeTrue();
    });
  });

  describe('estados do corpo', () => {
    it('carregamento inicial: esqueleto, sem conteúdo, aria-busy', () => {
      host.state.set(state('loading'));
      fixture.detectChanges();

      expect(has('.ingestion-section__skeleton')).toBeTrue();
      expect(has('.projected')).toBeFalse();
      expect(fixture.debugElement.query(By.css('.ingestion-section')).nativeElement.getAttribute('aria-busy')).toBe('true');
    });

    it('atualização: mantém o conteúdo na tela', () => {
      host.state.set(state('refreshing', { data: { jobs: [] }, lastUpdated: new Date() }));
      host.visibleCount.set(3);
      fixture.detectChanges();

      expect(has('.projected')).toBeTrue();
    });

    it('sucesso com conteúdo: mostra o corpo', () => {
      host.state.set(state('success', { data: { jobs: [1] } }));
      host.visibleCount.set(1);
      fixture.detectChanges();

      expect(has('.projected')).toBeTrue();
    });

    it('resultado vazio: mensagem da seção, sem conteúdo', () => {
      host.state.set(state('empty', { data: { jobs: [] } }));
      host.visibleCount.set(0);
      fixture.detectChanges();

      expect(has('.ingestion-section__empty')).toBeTrue();
      expect(has('.projected')).toBeFalse();
    });

    it('sem correspondência: oferece limpar os filtros', () => {
      host.state.set(state('success', { data: { jobs: [1] } }));
      host.visibleCount.set(0);
      host.hasActiveFilters.set(true);
      fixture.detectChanges();

      expect(has('.ingestion-section__empty button')).toBeTrue();
      expect(has('.projected')).toBeFalse();
    });

    it('erro sem dados: alerta com nova tentativa e contagem regressiva', () => {
      host.state.set(state('error', {
        error: { status: 500, key: 'erro.server', retryable: true },
        retryInSeconds: 5,
      }));
      fixture.detectChanges();

      const alert = fixture.debugElement.query(By.css('.alert-danger'));

      expect(alert.nativeElement.getAttribute('role')).toBe('alert');
      expect(has('.ingestion-section__countdown')).toBeTrue();
      expect(has('.ingestion-section__banner-actions button')).toBeTrue();
    });

    it('dados parciais: avisa que está desatualizado sem esconder o conteúdo', () => {
      host.state.set(state('partial', {
        data: { jobs: [1] },
        lastUpdated: new Date(),
        error: { status: 503, key: 'erro.gateway', retryable: true },
      }));
      host.visibleCount.set(1);
      fixture.detectChanges();

      expect(has('.alert-warning')).toBeTrue();
      expect(has('.ingestion-section__stale')).toBeTrue();
      expect(has('.projected')).toBeTrue();
    });

    it('indisponível: explica e não oferece nova tentativa', () => {
      host.state.set(state('unavailable', {
        error: { status: 403, key: 'erro.forbidden', retryable: false },
      }));
      fixture.detectChanges();

      expect(has('.alert-secondary')).toBeTrue();
      expect(has('.ingestion-section__banner-actions')).toBeFalse();
    });

    it('emite retry quando o usuário pede nova tentativa', () => {
      host.state.set(state('error', { error: { status: 500, key: 'erro.server', retryable: true } }));
      fixture.detectChanges();

      const section = fixture.debugElement.query(By.directive(IngestionSectionComponent));
      let retried = false;
      section.componentInstance.retry.subscribe(() => retried = true);
      fixture.debugElement.query(By.css('.ingestion-section__banner-actions button')).nativeElement.click();

      expect(retried).toBeTrue();
    });
  });
});
