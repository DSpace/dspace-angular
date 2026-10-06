import {
  inject,
  Injectable,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';

import { AiCitation } from './ai-summary.model';
import {
  Bitstream,
  BitstreamDataService,
  getFirstCompletedRemoteData,
  Item,
  ItemDataService,
  PaginatedList,
  RemoteData,
} from './host';

/**
 * Leva uma citação da síntese até a página do PDF que a sustenta.
 *
 * Mesmo caminho do botão "página N" de `ds-document-more-results`: o PDF do bundle
 * ORIGINAL, aberto em `#page=N`. A diferença é o ponto de partida — lá o item já
 * está em mãos, aqui a síntese só devolve o UUID, então o item é buscado antes.
 *
 * Quando não há PDF (item só com anexos de outro tipo, bitstream restrito,
 * bundle vazio), cai na página do item no DSpace: o usuário chega ao documento,
 * ainda que não direto na página.
 */
@Injectable({ providedIn: 'root' })
export class AiSummaryPdfService {

  private readonly itemService = inject(ItemDataService);
  private readonly bitstreamService = inject(BitstreamDataService);
  private readonly router = inject(Router);

  /**
   * Uma síntese cita o mesmo documento várias vezes, e resolver o PDF custa duas
   * requisições (item + bundle). Guarda o observable por UUID enquanto a sessão
   * dura — o bundle ORIGINAL de um item publicado não muda no meio de uma busca.
   */
  private readonly routes = new Map<string, Observable<string>>();

  /**
   * Abre a evidência: o PDF na página citada, em outra aba. Sem PDF ou sem página,
   * navega para o item.
   */
  open(citation: AiCitation): void {
    const uuid = citation.itemUuid;
    if (uuid === null) {
      this.openItemFallback(citation);
      return;
    }

    this.pdfHref(uuid).pipe(take(1)).subscribe((href: string) => {
      if (href === '' || typeof window === 'undefined') {
        this.openItemFallback(citation);
        return;
      }
      // `noopener`: a aba do PDF não recebe referência a esta janela.
      window.open(`${href}${this.pageFragment(citation.page)}`, '_blank', 'noopener');
    });
  }

  /** Há para onde levar esta citação? Governa a exibição do botão. */
  canOpen(citation: AiCitation): boolean {
    return citation.itemUuid !== null || citation.itemHandle !== null;
  }

  /** URL de download do PDF do item; `''` quando não há um. */
  private pdfHref(uuid: string): Observable<string> {
    const cached = this.routes.get(uuid);
    if (cached !== undefined) {
      return cached;
    }

    const href$ = this.itemService.findById(uuid).pipe(
      getFirstCompletedRemoteData(),
      switchMap((itemRd: RemoteData<Item>) => itemRd.hasSucceeded && itemRd.payload
        ? this.bitstreamService.findAllByItemAndBundleName(itemRd.payload, 'ORIGINAL', { elementsPerPage: 50 }).pipe(
          // Dado **completo**, não "bem-sucedido": um bundle que falha ainda
          // precisa emitir, ou o clique ficaria mudo em vez de cair no item.
          getFirstCompletedRemoteData(),
          map((listRd: RemoteData<PaginatedList<Bitstream>>) => listRd.hasSucceeded ? listRd.payload?.page ?? [] : []),
        )
        : of([] as Bitstream[])),
      map((bitstreams: Bitstream[]) => firstPdf(bitstreams)?._links?.content?.href ?? ''),
      // Item removido, bundle inacessível, rede fora: cai no fallback do item.
      catchError(() => of('')),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.routes.set(uuid, href$);
    return href$;
  }

  /** `#page=N` quando a citação traz página; nada quando não traz. */
  private pageFragment(page: number | null): string {
    return page === null ? '' : `#page=${page}`;
  }

  private openItemFallback(citation: AiCitation): void {
    const route = citation.itemUuid !== null
      ? ['/items', citation.itemUuid]
      : citation.itemHandle !== null ? ['/handle', ...citation.itemHandle.split('/')] : null;
    if (route !== null) {
      void this.router.navigate(route, { queryParams: pageParam(citation.page) });
    }
  }
}

/** O primeiro anexo `.pdf` do bundle — mesma escolha do `doc-more-results`. */
function firstPdf(bitstreams: Bitstream[]): Bitstream | undefined {
  return (bitstreams ?? []).find((bitstream: Bitstream) => `${bitstream?.name ?? ''}`.trim().toLowerCase().endsWith('.pdf'));
}

/** Página como query param, para a página do item ao menos saber onde parar. */
function pageParam(page: number | null): Record<string, number> {
  return page === null ? {} : { page };
}
