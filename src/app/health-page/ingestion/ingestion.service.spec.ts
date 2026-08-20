import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  INGESTION_API_BASE,
  IngestionService,
} from './ingestion.service';

describe('IngestionService', () => {
  let service: IngestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IngestionService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(IngestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('busca os jobs em andamento com o limite pedido', () => {
    service.getActive(50).subscribe();

    const req = httpMock.expectOne(`${INGESTION_API_BASE}/api/files/active?limit=50`);

    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, job_ids: [], jobs: [] });
  });

  it('busca as falhas com o limite pedido', () => {
    service.getFailures(200).subscribe();

    const req = httpMock.expectOne(`${INGESTION_API_BASE}/api/files/failures?limit=200`);

    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, jobs: [] });
  });

  it('busca os concluídos com o limite pedido', () => {
    service.getSucceeded(100).subscribe();

    const req = httpMock.expectOne(`${INGESTION_API_BASE}/api/files/succeeded?limit=100`);

    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, job_ids: [], jobs: [] });
  });

  it('escapa o id do job na consulta de status', () => {
    service.getStatus('a b/c').subscribe();

    const req = httpMock.expectOne(`${INGESTION_API_BASE}/api/files/status/a%20b%2Fc`);

    expect(req.request.method).toBe('GET');
    req.flush({ job_id: 'a b/c', status: 'concluido' });
  });

  it('pede o resultado de um job', () => {
    service.getResult('job-1').subscribe();

    const req = httpMock.expectOne(`${INGESTION_API_BASE}/api/files/result/job-1`);

    expect(req.request.method).toBe('GET');
    req.flush({ job_id: 'job-1', status: 'concluido', documents: [] });
  });

  it('re-enfileira um job com force=true', () => {
    service.reprocess('job-1').subscribe();

    const req = httpMock.expectOne(`${INGESTION_API_BASE}/api/files/reprocess/job-1?force=true`);

    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  [401, 403, 404, 429, 500].forEach((status: number) => {
    it(`propaga o erro ${status} para quem chamou`, () => {
      let received: number | null = null;
      service.getActive().subscribe({
        error: (err: unknown) => received = (err as { status: number }).status,
      });

      httpMock.expectOne(`${INGESTION_API_BASE}/api/files/active?limit=100`)
        .flush('erro', { status, statusText: 'erro' });

      expect(received).toBe(status);
    });
  });

  it('entrega resposta incompleta sem inventar campos', () => {
    let payload: unknown;
    service.getActive().subscribe((data: unknown) => payload = data);

    httpMock.expectOne(`${INGESTION_API_BASE}/api/files/active?limit=100`).flush({ count: 3 });

    expect(payload).toEqual({ count: 3 });
  });
});
