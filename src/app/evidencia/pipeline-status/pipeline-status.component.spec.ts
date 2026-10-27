import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  of,
  Subject,
  throwError,
} from 'rxjs';

import { PipelineStatusComponent } from './pipeline-status.component';
import { PIPELINE_STATUS_MOCK } from './pipeline-status.mock';
import { PipelineStatusResponse } from './pipeline-status.model';
import {
  PipelineStatusError,
  PipelineStatusService,
} from './pipeline-status.service';
import { PipelineStatusTranslateLoaderStub } from './testing/pipeline-status.testing';

function response(): PipelineStatusResponse {
  return JSON.parse(JSON.stringify(PIPELINE_STATUS_MOCK)) as PipelineStatusResponse;
}

describe('PipelineStatusComponent', () => {
  let component: PipelineStatusComponent;
  let fixture: ComponentFixture<PipelineStatusComponent>;
  let service: jasmine.SpyObj<PipelineStatusService>;

  function setup(getStatus = of(response())): void {
    service = jasmine.createSpyObj('PipelineStatusService', ['getStatus']);
    service.getStatus.and.returnValue(getStatus);

    TestBed.configureTestingModule({
      imports: [
        PipelineStatusComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: PipelineStatusTranslateLoaderStub },
        }),
      ],
      providers: [
        { provide: PipelineStatusService, useValue: service },
      ],
    });

    fixture = TestBed.createComponent(PipelineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function has(selector: string): boolean {
    return fixture.debugElement.query(By.css(selector)) !== null;
  }

  afterEach(() => {
    fixture?.destroy();
    TestBed.resetTestingModule();
  });

  describe('carregamento com sucesso', () => {
    beforeEach(() => setup());

    it('consulta a API uma vez ao abrir', () => {
      expect(service.getStatus).toHaveBeenCalledTimes(1);
    });

    it('monta o cabeçalho, capacidades, fluxo, componentes e configuração', () => {
      expect(has('ds-pipeline-health-header')).toBeTrue();
      expect(has('ds-pipeline-capabilities')).toBeTrue();
      expect(has('ds-pipeline-flow')).toBeTrue();
      expect(has('ds-pipeline-config')).toBeTrue();
      expect(fixture.debugElement.queryAll(By.css('ds-pipeline-component-card')).length).toBe(13);
    });

    it('mostra as seis etapas do fluxo, do DSpace à busca', () => {
      const steps = fixture.debugElement.queryAll(By.css('.pipeline-flow__step'));

      expect(steps.length).toBe(6);
      expect(component.flow().map((step) => step.key))
        .toEqual(['dspace', 'mineru', 'minio', 'embedder', 'qdrant', 'search']);
    });

    it('não mostra esqueleto nem erro', () => {
      expect(has('.pipeline-skeleton')).toBeFalse();
      expect(has('.pipeline-error')).toBeFalse();
      expect(has('.pipeline-stale')).toBeFalse();
    });

    it('mostra alertas porque a fixture tem 1 job com falha e 2 opcionais', () => {
      expect(has('ds-pipeline-alerts')).toBeTrue();
      expect(component.alerts().length).toBe(3);
    });

    it('anuncia a atualização para leitores de tela', () => {
      const live = fixture.debugElement.query(By.css('[role="status"][aria-live="polite"]'));

      expect(live).not.toBeNull();
      expect(component.announcement()).toBe('health-page.pipeline.state.updated');
    });

    it('atualiza ao pedir de novo, sem apagar o que está na tela', () => {
      component.reload();
      fixture.detectChanges();

      expect(service.getStatus).toHaveBeenCalledTimes(2);
      expect(has('ds-pipeline-health-header')).toBeTrue();
    });
  });

  describe('carregamento inicial', () => {
    it('mostra esqueleto enquanto a resposta não chega', () => {
      const slow = new Subject<PipelineStatusResponse>();
      setup(slow);

      expect(component.firstLoad()).toBeTrue();
      expect(has('.pipeline-skeleton')).toBeTrue();
      expect(has('ds-pipeline-health-header')).toBeFalse();

      slow.next(response());
      fixture.detectChanges();

      expect(has('.pipeline-skeleton')).toBeFalse();
      expect(has('ds-pipeline-health-header')).toBeTrue();
    });

    it('mantém os dados na tela durante a atualização', () => {
      setup();
      const slow = new Subject<PipelineStatusResponse>();
      service.getStatus.and.returnValue(slow);

      component.reload();
      fixture.detectChanges();

      expect(component.refreshing()).toBeTrue();
      expect(component.firstLoad()).toBeFalse();
      expect(has('ds-pipeline-health-header')).toBeTrue();
    });
  });

  describe('falhas', () => {
    it('mostra mensagem amigável e botão de nova tentativa', () => {
      setup(throwError(() => ({ kind: 'network', status: 0 } as PipelineStatusError)));

      expect(component.blankError()).toBeTrue();
      expect(has('.pipeline-error')).toBeTrue();
      expect(component.errorKey()).toBe('health-page.pipeline.error.network');
      expect(fixture.debugElement.query(By.css('.pipeline-error')).nativeElement.getAttribute('role'))
        .toBe('alert');
    });

    it('tenta de novo quando o usuário pede', () => {
      setup(throwError(() => ({ kind: 'network', status: 0 } as PipelineStatusError)));
      service.getStatus.and.returnValue(of(response()));

      fixture.debugElement.query(By.css('.pipeline-error button')).nativeElement.click();
      fixture.detectChanges();

      expect(has('ds-pipeline-health-header')).toBeTrue();
      expect(has('.pipeline-error')).toBeFalse();
    });

    it('diferencia mensagens por tipo de falha e por status HTTP', () => {
      ([
        [{ kind: 'timeout', status: 0 }, 'health-page.pipeline.error.timeout'],
        [{ kind: 'invalid', status: 200 }, 'health-page.pipeline.error.invalid'],
        [{ kind: 'http', status: 403 }, 'health-page.pipeline.error.forbidden'],
        [{ kind: 'http', status: 500 }, 'health-page.pipeline.error.server'],
        [{ kind: 'http', status: 418 }, 'health-page.pipeline.error.http'],
      ] as [PipelineStatusError, string][]).forEach(([error, key]) => {
        setup(throwError(() => error));

        expect(component.errorKey()).withContext(JSON.stringify(error)).toBe(key);

        fixture.destroy();
        TestBed.resetTestingModule();
      });
    });

    it('preserva a última resposta válida quando a atualização falha', () => {
      setup();
      service.getStatus.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 500 }) as unknown as PipelineStatusError));

      component.reload();
      fixture.detectChanges();

      expect(component.staleData()).toBeTrue();
      expect(has('.pipeline-stale')).toBeTrue();
      // O painel anterior continua na tela.
      expect(has('ds-pipeline-health-header')).toBeTrue();
      expect(component.components().length).toBe(13);
    });
  });

  describe('resposta incompleta', () => {
    it('funciona com resposta mínima (só o estado)', () => {
      setup(of({ status: 'ok' } as PipelineStatusResponse));

      expect(has('ds-pipeline-health-header')).toBeTrue();
      expect(has('ds-pipeline-capabilities')).toBeFalse();
      expect(has('ds-pipeline-alerts')).toBeFalse();
      expect(has('.pipeline-empty')).toBeTrue();
    });

    it('não quebra com componente sem detail nem mensagem', () => {
      const payload = response();
      payload.components.qdrant = { name: 'qdrant', status: 'ok', critical: true };
      setup(of(payload));

      expect(fixture.debugElement.queryAll(By.css('ds-pipeline-component-card')).length).toBe(13);
    });
  });
});
