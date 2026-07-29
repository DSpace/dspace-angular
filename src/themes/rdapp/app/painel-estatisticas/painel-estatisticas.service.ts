import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  catchError,
  EMPTY,
  expand,
  map,
  Observable,
  of,
  reduce,
} from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';

export interface FacetValue { label: string; count: number; }

// Campo do Solr para contar avaliacoes que POSSUEM ODS (query de presenca no indice).
// Deve casar com o campo de faceta gerado pelo Discovery para o filtro "ods".
// Confirme na instancia; se nao bater, troque para 'ods_filter'.
const CAMPO_ODS_SOLR = 'ods_keyword';

/**
 * Acesso aos dados do Painel de Estatisticas via API REST do DSpace (Discovery).
 * Recebe o sufixo de filtros ja montado (ver paramsFiltro no componente) e nao
 * guarda estado de selecao, para poder ser reutilizado pelas duas visoes da HU.
 */
@Injectable()
export class PainelEstatisticasService {

  private readonly restApi: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) appConfig: AppConfig,
  ) {
    this.restApi = `${appConfig.rest.baseUrl}/api`;
  }

  /** Base da API REST. Util para mensagens de diagnostico no componente. */
  get apiBase(): string { return this.restApi; }

  /** Total de avaliacoes (itens) no escopo dos filtros informados. */
  fetchTotalItens(filtrosParam = ''): Observable<number> {
    const url = `${this.restApi}/discover/search/objects?dsoType=item&size=1${filtrosParam}`;
    return this.http.get<any>(url).pipe(
      map((res) => res?._embedded?.searchResult?.page?.totalElements ?? 0),
      catchError(() => of(0)),
    );
  }

  /**
   * Avaliacoes que possuem ao menos um ODS informado. Contagem no servidor via
   * totalElements. Combinada com fetchTotalItens da o "Nao Informado" sem
   * depender do teto de paginacao de fetchItens.
   */
  fetchComOds(filtrosParam = ''): Observable<number> {
    const q = encodeURIComponent(`${CAMPO_ODS_SOLR}:[* TO *]`);
    const url = `${this.restApi}/discover/search/objects?dsoType=item&size=1&query=${q}${filtrosParam}`;
    return this.http.get<any>(url).pipe(
      map((res) => res?._embedded?.searchResult?.page?.totalElements ?? 0),
      catchError(() => of(0)),
    );
  }

  /** Itens do escopo (ate 20 paginas de 100). Usado nas agregacoes client-side. */
  fetchItens(filtrosParam = ''): Observable<any[]> {
    const base = `${this.restApi}/discover/search/objects?dsoType=item&size=100${filtrosParam}`;
    const pagina = (p: number) => this.http.get<any>(`${base}&page=${p}`);
    return pagina(0).pipe(
      expand((res: any) => {
        const pg = res?._embedded?.searchResult?.page;
        const atual = pg?.number ?? 0;
        const totalPaginas = pg?.totalPages ?? 1;
        return (atual + 1 < totalPaginas && atual + 1 < 20) ? pagina(atual + 1) : EMPTY;
      }),
      reduce((acc: any[], res: any) => {
        const objs = res?._embedded?.searchResult?._embedded?.objects ?? [];
        return acc.concat(objs.map((o: any) => o?._embedded?.indexableObject).filter((x: any) => !!x));
      }, [] as any[]),
      catchError(() => of([] as any[])),
    );
  }

  /** Facet do Discovery (ex: 'ods', 'instituicao'), ordenado do maior para o menor. */
  fetchFacet(name: string, filtrosParam = ''): Observable<FacetValue[]> {
    const url = `${this.restApi}/discover/facets/${name}?size=50${filtrosParam}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const values = res?._embedded?.values ?? [];
        return values
          .map((v: any) => ({ label: v.label, count: v.count } as FacetValue))
          .sort((a: FacetValue, b: FacetValue) => b.count - a.count);
      }),
      catchError(() => of([] as FacetValue[])),
    );
  }
}
