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

import { AI_SUMMARY_DEFAULTS } from './ai-summary.config';
import {
  AI_SUMMARY_ENDPOINT,
  AI_SUMMARY_STORED_RESPONSES,
  AI_SUMMARY_TIMEOUT_MS,
  AiSummaryDocument,
  AiSummaryError,
  AiSummaryParams,
  AiSummaryService,
  cacheKey,
  toApiSearchType,
} from './ai-summary.service';
import { AI_SUMMARY_STORAGE_KEYS } from './ai-summary.storage';

describe('AiSummaryService', () => {
  let service: AiSummaryService;
  let httpMock: HttpTestingController;

  const params: AiSummaryParams = {
    query: 'educacao',
    searchType: 'hybrid',
    mode: 'basic',
    language: 'pt-BR',
  };

  const documents: AiSummaryDocument[] = [
    { uuid: 'uuid-1', handle: '123456789/150' },
    { uuid: 'uuid-2', handle: null },
  ];

  const body = {
    summary: 'Principais evidências [1]',
    citations: [{ n: 1, section: '5.1', page: 138, snippet: 'trecho', item_uuid: 'uuid-1' }],
    evidence_count: 10,
  };

  beforeEach(() => {
    // O cache persiste no sessionStorage do navegador do Karma: sem limpar, cada
    // teste herdaria a síntese gravada pelo anterior e nem chamaria a API.
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AiSummaryService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AiSummaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('pede a síntese com consulta, modo, idioma e tipo de busca', () => {
    service.summarize(params).subscribe();

    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('educacao');
    expect(req.request.params.get('focus')).toBe('achados');
    expect(req.request.params.get('language')).toBe('pt-BR');
    expect(req.request.params.get('type')).toBe('hybrid');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(body);
  });

  it('traduz o tipo de busca do DSpace para o vocabulário da API', () => {
    service.summarize({ ...params, searchType: 'lexical' }).subscribe();

    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    // `lexical` cru cairia no ramo dense do `_query_points`, o oposto do pedido.
    expect(req.request.params.get('type')).toBe('sparse');
    req.flush(body);
  });

  it('omite o tipo desconhecido e deixa a API usar o default dela', () => {
    service.summarize({ ...params, searchType: '' }).subscribe();

    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    expect(req.request.params.has('type')).toBeFalse();
    req.flush(body);
  });

  it('envia os filtros preenchidos e descarta os vazios', () => {
    service.summarize({ ...params, filters: { year: '2024', ods: '  ' } }).subscribe();

    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    expect(req.request.params.get('year')).toBe('2024');
    expect(req.request.params.has('ods')).toBeFalse();
    req.flush(body);
  });

  it('normaliza a resposta da API', () => {
    let received;
    service.summarize(params).subscribe((response) => received = response);
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

    expect(received.evidenceCount).toBe(10);
    expect(received.citations[0].itemUuid).toBe('uuid-1');
  });

  it('não repete a chamada enquanto consulta, modo e idioma não mudam', () => {
    service.summarize(params).subscribe();
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

    service.summarize(params).subscribe();

    expect(httpMock.match((request) => request.url === AI_SUMMARY_ENDPOINT).length).toBe(0);
  });

  it('refaz a chamada quando o modo muda', () => {
    service.summarize(params).subscribe();
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

    service.summarize({ ...params, mode: 'by_section' }).subscribe();
    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    expect(req.request.params.get('focus')).toBe('recomendacoes');
    req.flush(body);
  });

  it('esquece a síntese quando pedem para gerar de novo', () => {
    service.summarize(params).subscribe();
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

    service.forget(params);
    service.summarize(params).subscribe();
    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    expect(req.request.method).toBe('GET');
    req.flush(body);
  });

  describe('depois de um F5', () => {

    /** Um serviço novo, como o que o app recria ao recarregar a página. */
    function reloadedService(): AiSummaryService {
      return TestBed.runInInjectionContext(() => new AiSummaryService());
    }

    it('serve a síntese guardada sem chamar a API de novo', () => {
      service.summarize(params).subscribe();
      httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

      let summary = '';
      reloadedService().summarize(params).subscribe((response) => summary = response.summary);

      expect(httpMock.match((request) => request.url === AI_SUMMARY_ENDPOINT).length).toBe(0);
      expect(summary).toBe('Principais evidências [1]');
    });

    it('esquece também a cópia guardada ao gerar de novo', () => {
      service.summarize(params).subscribe();
      httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

      service.forget(params);
      reloadedService().summarize(params).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);
      expect(req.request.method).toBe('GET');
      req.flush(body);
    });

    it('guarda só as sínteses mais recentes', () => {
      for (let i = 0; i <= AI_SUMMARY_STORED_RESPONSES; i++) {
        service.summarize({ ...params, query: `consulta ${i}` }).subscribe();
        httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);
      }

      const stored = JSON.parse(sessionStorage.getItem(AI_SUMMARY_STORAGE_KEYS.responses));
      expect(stored.length).toBe(AI_SUMMARY_STORED_RESPONSES);
      // A primeira saiu: pedir de novo vai à API.
      reloadedService().summarize({ ...params, query: 'consulta 0' }).subscribe();
      httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);
    });

    it('ignora uma cópia guardada que não tem a forma de síntese', () => {
      sessionStorage.setItem(AI_SUMMARY_STORAGE_KEYS.responses, JSON.stringify([
        { key: cacheKey(params), response: { summary: 'velho' } },
      ]));

      service.summarize(params).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);
      expect(req.request.method).toBe('GET');
      req.flush(body);
    });

    it('não guarda erro para o F5', () => {
      service.summarize(params).subscribe({ error: () => undefined });
      httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush('falhou', { status: 503, statusText: 'erro' });

      expect(sessionStorage.getItem(AI_SUMMARY_STORAGE_KEYS.responses)).toBeNull();
    });
  });

  it('não guarda erro em cache: a próxima abertura tenta de novo', () => {
    service.summarize(params).subscribe({ error: () => undefined });
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush('falhou', { status: 503, statusText: 'erro' });

    service.summarize(params).subscribe({ error: () => undefined });
    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    expect(req.request.method).toBe('GET');
    req.flush(body);
  });

  it('classifica falha de rede (status 0) como network', () => {
    let error: AiSummaryError;
    service.summarize(params).subscribe({ error: (err: unknown) => error = err as AiSummaryError });
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).error(new ProgressEvent('error'), { status: 0 });

    expect(error).toEqual({ kind: 'network', status: 0 });
  });

  [400, 401, 403, 404, 429, 500, 503].forEach((status: number) => {
    it(`classifica o erro ${status} como http`, () => {
      let error: AiSummaryError;
      service.summarize(params).subscribe({ error: (err: unknown) => error = err as AiSummaryError });
      httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush('erro', { status, statusText: 'erro' });

      expect(error).toEqual({ kind: 'http', status });
    });
  });

  it('trata 200 com corpo inesperado como resposta inválida', () => {
    let error: AiSummaryError;
    service.summarize(params).subscribe({ error: (err: unknown) => error = err as AiSummaryError });
    httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush({ detail: 'Not Found' });

    expect(error).toEqual({ kind: 'invalid', status: 200 });
  });

  it('desiste quando a síntese passa do tempo limite', fakeAsync(() => {
    let error: AiSummaryError;
    service.summarize(params).subscribe({ error: (err: unknown) => error = err as AiSummaryError });
    const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

    tick(AI_SUMMARY_TIMEOUT_MS + 1);

    // A requisicao foi cancelada pelo timeout: nao ha resposta para entregar.
    expect(error).toEqual({ kind: 'timeout', status: 0 });
    expect(req.cancelled).toBeTrue();
  }));

  describe('com documentos selecionados', () => {

    it('troca o GET por um POST com a lista de documentos', () => {
      service.summarize({ ...params, documents }).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        q: 'educacao',
        limit: AI_SUMMARY_DEFAULTS.limitPerDocument,
        focus: 'achados',
        language: 'pt-BR',
        // Sem handle conhecido o campo nao vai: a API acha o item pelo UUID.
        documents: [{ uuid: 'uuid-1', handle: '123456789/150' }, { uuid: 'uuid-2' }],
        type: 'hybrid',
      });
      req.flush(body);
    });

    it('leva os filtros preenchidos no corpo, como o GET faz na query', () => {
      service.summarize({ ...params, documents, filters: { year: '2024', ods: '  ' } }).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

      expect(req.request.body.year).toBe('2024');
      expect('ods' in req.request.body).toBeFalse();
      req.flush(body);
    });

    it('descarta uuid vazio e nao conta o mesmo item duas vezes', () => {
      const repeated: AiSummaryDocument[] = [
        { uuid: 'uuid-1', handle: '123456789/150' },
        { uuid: '  ', handle: null },
        { uuid: 'uuid-1', handle: '123456789/150' },
      ];
      service.summarize({ ...params, documents: repeated }).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

      expect(req.request.body.documents).toEqual([{ uuid: 'uuid-1', handle: '123456789/150' }]);
      req.flush(body);
    });

    it('traduz o tipo de busca tambem no corpo do POST', () => {
      service.summarize({ ...params, documents, searchType: 'semantic' }).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

      expect(req.request.body.type).toBe('dense');
      req.flush(body);
    });

    it('volta ao GET quando a selecao esvazia', () => {
      service.summarize({ ...params, documents: [] }).subscribe();

      const req = httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT);

      expect(req.request.method).toBe('GET');
      req.flush(body);
    });

    it('guarda em cache a sintese da selecao, como a da busca inteira', () => {
      service.summarize({ ...params, documents }).subscribe();
      httpMock.expectOne((request) => request.url === AI_SUMMARY_ENDPOINT).flush(body);

      service.summarize({ ...params, documents }).subscribe();

      expect(httpMock.match((request) => request.url === AI_SUMMARY_ENDPOINT).length).toBe(0);
    });
  });

  describe('toApiSearchType', () => {

    it('mapeia o vocabulario do DSpace no da API', () => {
      expect(toApiSearchType('hybrid')).toBe('hybrid');
      expect(toApiSearchType('semantic')).toBe('dense');
      expect(toApiSearchType('lexical')).toBe('sparse');
    });

    it('devolve null para o que a API nao conhece', () => {
      expect(toApiSearchType('')).toBeNull();
      expect(toApiSearchType(undefined)).toBeNull();
      expect(toApiSearchType('bm25')).toBeNull();
    });
  });

  describe('cacheKey', () => {

    it('ignora a ordem em que os filtros foram escolhidos', () => {
      const a = cacheKey({ ...params, filters: { year: '2024', ods: '4' } });
      const b = cacheKey({ ...params, filters: { ods: '4', year: '2024' } });

      expect(a).toBe(b);
    });

    it('distingue idiomas', () => {
      expect(cacheKey(params)).not.toBe(cacheKey({ ...params, language: 'en' }));
    });

    it('distingue a busca inteira de uma selecao de documentos', () => {
      expect(cacheKey(params)).not.toBe(cacheKey({ ...params, documents }));
    });

    it('ignora a ordem em que os documentos foram marcados', () => {
      const a = cacheKey({ ...params, documents });
      const b = cacheKey({ ...params, documents: [...documents].reverse() });

      expect(a).toBe(b);
    });
  });
});
