import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../core/shared/page-info.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

import { hasValue, isEmpty, isNotEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import { SearchService, shuffle } from '../../+search-page/search-service/search.service';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { FilterType } from '../../+search-page/search-service/filter-type.model';
import { SearchOptions } from '../../+search-page/search-options.model';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { MyDSpaceResult } from '../my-dspace-result.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { WorkspaceitemMyDSpaceResult } from '../../shared/object-collection/shared/workspaceitem-my-dspace-result.model';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { Metadatum } from '../../core/shared/metadatum.model';
import { Item } from '../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../shared/object-collection/shared/item-my-dspace-result.model';

@Injectable()
export class MyDspaceService extends SearchService implements OnDestroy {

  config: SearchFilterConfig[] = [
    Object.assign(new SearchFilterConfig(),
      {
        name: 'status',
        type: FilterType.hierarchy,
        hasFacets: true,
        isOpenByDefault: true
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'date_submitted',
        type: FilterType.range,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'date_issued',
        type: FilterType.range,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'type',
        type: FilterType.text,
        hasFacets: false,
        isOpenByDefault: false
      })
  ];
  // searchOptions: BehaviorSubject<SearchOptions>;
  searchOptions: SearchOptions;
  totalElements: number;

  constructor(protected workspaceitemDataService: WorkspaceitemDataService,
              protected itemDataService: ItemDataService,
              protected routeService: RouteService,
              protected route: ActivatedRoute,
              protected router: Router) {

    super(itemDataService, routeService, route, router);
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions): Observable<RemoteData<Array<MyDSpaceResult<DSpaceObject>>>> {
    this.searchOptions = searchOptions;
    let self = `https://dspace7.4science.it/dspace-spring-rest/api/search?query=${query}`;
    if (hasValue(scopeId)) {
      self += `&scope=${scopeId}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.pagination.currentPage)) {
      self += `&page=${searchOptions.pagination.currentPage}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.pagination.pageSize)) {
      self += `&pageSize=${searchOptions.pagination.pageSize}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.sort.direction)) {
      self += `&sortDirection=${searchOptions.sort.direction}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.sort.field)) {
      self += `&sortField=${searchOptions.sort.field}`;
    }

    const error = undefined;
    const returningPageInfo = new PageInfo();

    if (isNotEmpty(searchOptions)) {
      returningPageInfo.elementsPerPage = searchOptions.pagination.pageSize;
      returningPageInfo.currentPage = searchOptions.pagination.currentPage;
    } else {
      returningPageInfo.elementsPerPage = 10;
      returningPageInfo.currentPage = 1;
    }

    const filterConfig = this.config.find((config: SearchFilterConfig) => config.name === 'status');
    return this.routeService.getQueryParameterValues(filterConfig.paramName)
      .flatMap((status) => {
        let itemsObs: Observable<RemoteData<PaginatedList<Item>>>;
        let workspaceitemsObs: Observable<RemoteData<PaginatedList<Workspaceitem>>>;
        if ((isEmpty(status) || status.length > 1) && (returningPageInfo.currentPage * returningPageInfo.elementsPerPage < 41)) {
          itemsObs = this.itemDataService.findAll({
            scopeID: scopeId,
            currentPage: returningPageInfo.currentPage,
            elementsPerPage: (returningPageInfo.elementsPerPage / 2)
          }).filter((rd) => rd.hasSucceeded);

          workspaceitemsObs = this.workspaceitemDataService.findAll({
            scopeID: scopeId,
            currentPage: returningPageInfo.currentPage / 2,
            elementsPerPage: returningPageInfo.elementsPerPage
          }).filter((rd) => rd.hasSucceeded);
        } else if (status[0] === 'Accepted') {
          if ((returningPageInfo.currentPage * returningPageInfo.elementsPerPage < 41)) {
            itemsObs = this.itemDataService.findAll({
              scopeID: scopeId,
              currentPage: returningPageInfo.currentPage,
              elementsPerPage: (returningPageInfo.elementsPerPage)
            }).filter((rd) => rd.hasSucceeded);
          } else {
            itemsObs = Observable.of(new RemoteData(
              false,
              false,
              true,
              undefined,
              new PaginatedList(new PageInfo(), [])));
          }
          workspaceitemsObs = Observable.of(new RemoteData(
            false,
            false,
            true,
            undefined,
            new PaginatedList(new PageInfo(), [])));
        } else {
          itemsObs = Observable.of(new RemoteData(
            false,
            false,
            true,
            undefined,
            new PaginatedList(new PageInfo(), [])));

          workspaceitemsObs = this.workspaceitemDataService.findAll({
            scopeID: scopeId,
            currentPage: returningPageInfo.currentPage,
            elementsPerPage: returningPageInfo.elementsPerPage
          }).filter((rd) => rd.hasSucceeded);
        }

        return Observable.combineLatest(itemsObs, workspaceitemsObs)
          .first()
          .map(([rdi, rdw]) => {

            const totelItems = (isUndefined(rdi.payload.totalElements)) ? 0 : ((rdi.payload.totalElements < 41) ? rdi.payload.totalElements : 40);
            const totelWorkspace = (isNotUndefined(rdw.payload.totalElements)) ? rdw.payload.totalElements : 0;
            const totalElements = totelWorkspace + totelItems;

            const page = [];
            rdi.payload.page
              .forEach((item: Item, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new ItemMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                page.push(mockResult);
              });

            rdw.payload.page
              .forEach((item: Workspaceitem, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new WorkspaceitemMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                page.push(mockResult);
              });

            const shuffledPage = shuffle(page);
            const payload = Object.assign({}, rdw.payload, { totalElements: totalElements, page: shuffledPage });

            return new RemoteData(
              rdi.isRequestPending && rdw.isRequestPending,
              rdi.isResponsePending && rdw.isResponsePending,
              rdi.hasSucceeded && rdw.hasSucceeded,
              error,
              payload
            )
          }).startWith(new RemoteData(
            true,
            false,
            undefined,
            undefined,
            undefined
          ))
      });

  }

  getFacetValuesFor(searchFilterConfigName: string): Observable<RemoteData<FacetValue[]>> {
    const filterConfig = this.config.find((config: SearchFilterConfig) => config.name === searchFilterConfigName);
    return this.routeService.getQueryParameterValues(filterConfig.paramName)
      .flatMap((selectedValues: string[]) => {
        const itemsObs = this.itemDataService.findAll({
          currentPage: 1,
          elementsPerPage: 1
        });
        const workspaceitemsObs = this.workspaceitemDataService.findAll({
          currentPage: 1,
          elementsPerPage: 1
        });
        return Observable.combineLatest(itemsObs, workspaceitemsObs)
          .first()
          .map(([items, workspaceitem]) => {
            const payload: FacetValue[] = [];
            if (searchFilterConfigName === 'status') {
              const statusFilters = ['Accepted', 'In progress'];
              statusFilters.forEach((value) => {
                if (!selectedValues.includes(value)) {
                  payload.push({
                    value: value,
                    count: (value === 'In progress')
                      ? workspaceitem.payload.totalElements
                      : 40,
                    search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
                  })
                }
              });
            } else if (searchFilterConfigName === 'type') {
              const statusFilters = ['Article', 'Book', 'Conference material'];
              const totalFilters = 3;
              statusFilters.forEach((value, index) => {
                if (!selectedValues.includes(value)) {
                  payload.push({
                    value: value,
                    count: Math.floor(Math.random() * 20) + 20 * (totalFilters - index), // make sure first results have the highest (random) count,
                    search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
                  })
                }
              });
            } else {
              const totalFilters = 13;
              for (let i = 0; i < totalFilters; i++) {
                const value = searchFilterConfigName + ' ' + (i + 1);
                if (!selectedValues.includes(value)) {
                  payload.push({
                    value: value,
                    count: Math.floor(Math.random() * 20) + 20 * (totalFilters - i), // make sure first results have the highest (random) count
                    search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
                  });
                }
              }
            }
            const requestPending = false;
            const responsePending = false;
            const isSuccessful = true;
            const error = undefined;
            return new RemoteData(
              requestPending,
              responsePending,
              isSuccessful,
              error,
              payload);
          }
        )
      }
    )
  }
}
