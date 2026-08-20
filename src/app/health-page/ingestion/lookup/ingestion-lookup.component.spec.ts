import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
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

import {
  IngestionService,
  JobResult,
  JobStatus,
} from '../ingestion.service';
import { IngestionLookupComponent } from './ingestion-lookup.component';

const DONE_STATUS: JobStatus = { job_id: 'job-1', status: 'concluido', filename: 'tese.pdf' };
const RESULT: JobResult = {
  job_id: 'job-1',
  status: 'concluido',
  documents: [{ document_id: 'doc-1', status: 'concluido', chunk_count: 4, indexed_count: 4 }],
};

describe('IngestionLookupComponent', () => {
  let component: IngestionLookupComponent;
  let fixture: ComponentFixture<IngestionLookupComponent>;
  let ingestion: jasmine.SpyObj<IngestionService>;

  function create(initialJobId = ''): void {
    ingestion = jasmine.createSpyObj('IngestionService', ['getStatus', 'getResult']);
    ingestion.getStatus.and.returnValue(of(DONE_STATUS));
    ingestion.getResult.and.returnValue(of(RESULT));

    TestBed.configureTestingModule({
      imports: [
        IngestionLookupComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
      providers: [
        { provide: IngestionService, useValue: ingestion },
        { provide: Router, useValue: new RouterStub() },
      ],
    });

    fixture = TestBed.createComponent(IngestionLookupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('initialJobId', initialJobId);
    // Painel aberto: o formulário só existe no corpo expandido do accordion.
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
  }

  function submit(value: string): void {
    const box: HTMLInputElement = fixture.nativeElement.querySelector('#ingestion-job-id');
    box.value = value;
    fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', new Event('submit'));
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    TestBed.resetTestingModule();
  });

  it('não consulta nada antes do envio', () => {
    create();

    expect(ingestion.getStatus).not.toHaveBeenCalled();
  });

  it('consulta o job da URL ao abrir a página', () => {
    create('job-1');

    expect(ingestion.getStatus).toHaveBeenCalledWith('job-1');
    expect(component.outcome().status).toEqual(DONE_STATUS);
  });

  it('valida o campo no envio, mantendo o botão habilitado', () => {
    create();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

    // dsBtnDisabled mantém o botão focável; a validação acontece no submit.
    expect(button.getAttribute('aria-disabled')).toBe('false');

    submit('   ');

    expect(component.invalid()).toBeTrue();
    expect(ingestion.getStatus).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('#ingestion-job-id-error')).not.toBeNull();
  });

  it('mostra o resultado de um job concluído', () => {
    create();

    submit('job-1');

    expect(component.outcome().result).toEqual(RESULT);
    expect(fixture.debugElement.queryAll(By.css('tbody tr')).length).toBe(1);
  });

  it('não pede o resultado de um job que ainda não terminou', () => {
    create();
    ingestion.getStatus.and.returnValue(of({ job_id: 'job-2', status: 'processando', stage: 'mineru' }));

    submit('job-2');

    expect(ingestion.getResult).not.toHaveBeenCalled();
    expect(component.outcome().resultKey).toBe('health-page.ingestion.lookup.result-pending');
  });

  it('trata 404 como "não encontrado", não como falha', () => {
    create();
    ingestion.getStatus.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    submit('job-x');

    expect(component.outcome().notFound).toBeTrue();
    expect(component.outcome().errorKey).toBe('health-page.ingestion.state.error.notfound');
  });

  it('explica 409 e 422 do resultado sem tratar como erro da consulta', () => {
    create();
    ingestion.getResult.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));

    submit('job-1');

    expect(component.outcome().status).toEqual(DONE_STATUS);
    expect(component.outcome().resultKey).toBe('health-page.ingestion.lookup.result-pending');

    ingestion.getResult.and.returnValue(throwError(() => new HttpErrorResponse({ status: 422 })));
    submit('job-1');

    expect(component.outcome().resultKey).toBe('health-page.ingestion.lookup.result-failed');
  });

  it('mostra mensagem específica para 401, 403, 429 e 500', () => {
    create();
    [
      { status: 401, key: 'health-page.ingestion.state.error.unauthorized' },
      { status: 403, key: 'health-page.ingestion.state.error.forbidden' },
      { status: 429, key: 'health-page.ingestion.state.error.throttled' },
      { status: 500, key: 'health-page.ingestion.state.error.server' },
    ].forEach((testCase: { status: number, key: string }) => {
      ingestion.getStatus.and.returnValue(throwError(() => new HttpErrorResponse({ status: testCase.status })));

      submit('job-1');

      expect(component.outcome().errorKey).withContext(`status ${testCase.status}`).toBe(testCase.key);
    });
  });

  it('mostra o esqueleto enquanto a resposta não chega', () => {
    create();
    const slow = new Subject<JobStatus>();
    ingestion.getStatus.and.returnValue(slow);

    submit('job-1');

    expect(component.loading()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.ingestion-lookup__skeleton')).not.toBeNull();

    slow.next(DONE_STATUS);
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
  });

  it('descarta a resposta de uma consulta anterior mais lenta', () => {
    create();
    const first = new Subject<JobStatus>();
    ingestion.getStatus.and.returnValue(first);
    submit('job-antigo');

    const second = new Subject<JobStatus>();
    ingestion.getStatus.and.returnValue(second);
    submit('job-novo');

    first.next({ job_id: 'job-antigo', status: 'concluido' });
    second.next({ job_id: 'job-novo', status: 'concluido' });
    fixture.detectChanges();

    expect(component.outcome().status.job_id).toBe('job-novo');
  });

  it('avisa quando o job concluiu sem documentos indexados', () => {
    create();
    ingestion.getResult.and.returnValue(of({ job_id: 'job-1', status: 'concluido', documents: [] }));

    submit('job-1');

    expect(fixture.nativeElement.querySelector('.ingestion-lookup__unavailable')).not.toBeNull();
  });

  it('recolhido, mantém o job consultado visível no cabeçalho', () => {
    create();
    submit('job-1');
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.ingestion-panel__badge code').textContent.trim())
      .toBe('job-1');
    // Sem destroyOnHide: o formulário sobrevive ao recolhimento (não perde o que
    // foi digitado). O accordion apenas o esconde.
    expect(fixture.nativeElement.querySelector('#ingestion-job-id')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.accordion-collapse.show')).toBeNull();
  });

  it('limpa a consulta e avisa o componente pai', () => {
    create();
    const emitted: string[] = [];
    component.jobIdChange.subscribe((id: string) => emitted.push(id));

    submit('job-1');
    component.clear();
    fixture.detectChanges();

    expect(emitted).toEqual(['job-1', '']);
    expect(component.outcome().status).toBeNull();
  });
});
