import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { PIPELINE_STATUS_MOCK } from './pipeline-status.mock';
import { PipelineStatusResponse } from './pipeline-status.model';
import {
  PIPELINE_STATUS_ENDPOINT,
  PIPELINE_STATUS_TIMEOUT_MS,
  PipelineStatusError,
  PipelineStatusService,
} from './pipeline-status.service';

describe('PipelineStatusService', () => {
  let service: PipelineStatusService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PipelineStatusService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PipelineStatusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const url = `${PIPELINE_STATUS_ENDPOINT}?fresh=false&probe=false&artifacts=true`;

  it('consulta o endpoint com fresh=false, probe=false e artifacts=true', () => {
    let received: PipelineStatusResponse;
    service.getStatus().subscribe((response: PipelineStatusResponse) => received = response);

    const req = httpMock.expectOne(url);

    expect(req.request.method).toBe('GET');
    req.flush(PIPELINE_STATUS_MOCK);

    expect(received.status).toBe('ok');
    expect(Object.keys(received.components).length).toBe(13);
  });

  it('permite pedir uma checagem nova', () => {
    service.getStatus({ fresh: true }).subscribe();

    const req = httpMock.expectOne(`${PIPELINE_STATUS_ENDPOINT}?fresh=true&probe=false&artifacts=true`);
    req.flush(PIPELINE_STATUS_MOCK);

    expect(req.request.method).toBe('GET');
  });

  it('classifica falha de rede (status 0) como network', () => {
    let error: PipelineStatusError;
    service.getStatus().subscribe({ error: (err: unknown) => error = err as PipelineStatusError });

    httpMock.expectOne(url).error(new ProgressEvent('error'), { status: 0 });

    expect(error).toEqual({ kind: 'network', status: 0 });
  });

  [401, 403, 404, 429, 500, 503].forEach((status: number) => {
    it(`classifica o erro ${status} como http`, () => {
      let error: PipelineStatusError;
      service.getStatus().subscribe({ error: (err: unknown) => error = err as PipelineStatusError });

      httpMock.expectOne(url).flush('erro', { status, statusText: 'erro' });

      expect(error).toEqual({ kind: 'http', status });
    });
  });

  it('entrega o relatório quando a API sinaliza a queda pelo 503 e manda o corpo', () => {
    // A API responde 503 quando um componente crítico cai (`status: 'down'`), mas
    // com o relatório completo — é o caso que o painel mais precisa mostrar.
    const down: PipelineStatusResponse = { ...PIPELINE_STATUS_MOCK, status: 'down' };
    let received: PipelineStatusResponse;
    let errored = false;
    service.getStatus().subscribe({
      next: (response: PipelineStatusResponse) => received = response,
      error: () => errored = true,
    });

    httpMock.expectOne(url).flush(down, { status: 503, statusText: 'Service Unavailable' });

    expect(errored).toBeFalse();
    expect(received.status).toBe('down');
    expect(Object.keys(received.components).length).toBe(13);
  });

  it('mantém o erro quando o 503 não traz relatório', () => {
    let error: PipelineStatusError;
    service.getStatus().subscribe({ error: (err: unknown) => error = err as PipelineStatusError });

    httpMock.expectOne(url).flush({ detail: 'indisponível' }, { status: 503, statusText: 'erro' });

    expect(error).toEqual({ kind: 'http', status: 503 });
  });

  it('classifica resposta 200 fora do formato como inválida', () => {
    let error: PipelineStatusError;
    service.getStatus().subscribe({ error: (err: unknown) => error = err as PipelineStatusError });

    httpMock.expectOne(url).flush({ mensagem: 'não é o status' });

    expect(error).toEqual({ kind: 'invalid', status: 200 });
  });

  it('classifica resposta vazia como inválida', () => {
    let error: PipelineStatusError;
    service.getStatus().subscribe({ error: (err: unknown) => error = err as PipelineStatusError });

    httpMock.expectOne(url).flush(null);

    expect(error).toEqual({ kind: 'invalid', status: 200 });
  });

  it('desiste depois do tempo limite', fakeAsync(() => {
    let error: PipelineStatusError;
    service.getStatus().subscribe({ error: (err: unknown) => error = err as PipelineStatusError });
    httpMock.expectOne(url);

    tick(PIPELINE_STATUS_TIMEOUT_MS + 1);

    expect(error).toEqual({ kind: 'timeout', status: 0 });
  }));
});
