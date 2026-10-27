import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AiCitation } from './ai-summary.model';
import { AiSummaryPdfService } from './ai-summary-pdf.service';
import {
  BitstreamDataService,
  ItemDataService,
} from './host';

const CITATION: AiCitation = {
  n: 1,
  section: '4.1.2 Inclusão social',
  page: 31,
  snippet: 'trecho',
  title: 'Política de Desoneração do Biodiesel',
  itemUuid: 'uuid-1',
  itemHandle: '123456789/91',
};

/** `RemoteData` só com o que os operadores desta feature leem. */
function remote(hasSucceeded: boolean, payload: unknown = null): any {
  return { hasCompleted: true, hasSucceeded, payload };
}

/** Lista paginada de bitstreams, na forma que `RemoteData.payload` tem. */
function list(...names: string[]): any {
  return remote(true, {
    page: names.map((name: string) => ({ name, _links: { content: { href: `https://dspace.test/${name}` } } })),
  });
}

describe('AiSummaryPdfService', () => {
  let service: AiSummaryPdfService;
  let itemService: jasmine.SpyObj<ItemDataService>;
  let bitstreamService: jasmine.SpyObj<BitstreamDataService>;
  let router: jasmine.SpyObj<Router>;
  let opened: string[];

  beforeEach(() => {
    itemService = jasmine.createSpyObj('ItemDataService', ['findById']);
    bitstreamService = jasmine.createSpyObj('BitstreamDataService', ['findAllByItemAndBundleName']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    itemService.findById.and.returnValue(of(remote(true, { uuid: 'uuid-1' })));
    bitstreamService.findAllByItemAndBundleName.and.returnValue(of(list('relatorio.pdf')));

    TestBed.configureTestingModule({
      providers: [
        AiSummaryPdfService,
        { provide: ItemDataService, useValue: itemService },
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: Router, useValue: router },
      ],
    });
    service = TestBed.inject(AiSummaryPdfService);

    opened = [];
    spyOn(window, 'open').and.callFake((url?: string | URL) => {
      opened.push(`${url}`);
      return null;
    });
  });

  it('abre o PDF do bundle ORIGINAL na página citada', () => {
    service.open(CITATION);

    expect(bitstreamService.findAllByItemAndBundleName)
      .toHaveBeenCalledWith({ uuid: 'uuid-1' } as any, 'ORIGINAL', { elementsPerPage: 50 });
    expect(opened).toEqual(['https://dspace.test/relatorio.pdf#page=31']);
  });

  it('abre sem fragmento quando a citação não traz página', () => {
    service.open({ ...CITATION, page: null });

    expect(opened).toEqual(['https://dspace.test/relatorio.pdf']);
  });

  it('ignora anexo que não é PDF', () => {
    bitstreamService.findAllByItemAndBundleName.and.returnValue(of(list('planilha.xlsx', 'texto.pdf')));

    service.open(CITATION);

    expect(opened).toEqual(['https://dspace.test/texto.pdf#page=31']);
  });

  it('resolve o PDF uma vez só por item, ainda que a síntese o cite várias vezes', () => {
    service.open(CITATION);
    service.open({ ...CITATION, n: 2, page: 42 });

    expect(itemService.findById).toHaveBeenCalledTimes(1);
    expect(opened).toEqual([
      'https://dspace.test/relatorio.pdf#page=31',
      'https://dspace.test/relatorio.pdf#page=42',
    ]);
  });

  it('cai na página do item quando o bundle não tem PDF', () => {
    bitstreamService.findAllByItemAndBundleName.and.returnValue(of(list('planilha.xlsx')));

    service.open(CITATION);

    expect(opened).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith(['/items', 'uuid-1'], { queryParams: { page: 31 } });
  });

  it('cai na página do item quando o bundle falha, em vez de não fazer nada', () => {
    bitstreamService.findAllByItemAndBundleName.and.returnValue(of(remote(false)));

    service.open(CITATION);

    expect(router.navigate).toHaveBeenCalledWith(['/items', 'uuid-1'], { queryParams: { page: 31 } });
  });

  it('cai na página do item quando o item não é encontrado', () => {
    itemService.findById.and.returnValue(of(remote(false)));

    service.open(CITATION);

    expect(router.navigate).toHaveBeenCalledWith(['/items', 'uuid-1'], { queryParams: { page: 31 } });
  });

  it('usa o handle quando a citação não traz UUID', () => {
    service.open({ ...CITATION, itemUuid: null });

    expect(itemService.findById).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/handle', '123456789', '91'], { queryParams: { page: 31 } });
  });

  it('não oferece botão para citação sem item de origem', () => {
    expect(service.canOpen(CITATION)).toBeTrue();
    expect(service.canOpen({ ...CITATION, itemUuid: null, itemHandle: null })).toBeFalse();
  });
});
