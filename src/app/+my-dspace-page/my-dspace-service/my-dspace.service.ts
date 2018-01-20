import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../core/shared/page-info.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SearchService } from '../../+search-page/search-service/search.service';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { FilterType } from '../../+search-page/search-service/filter-type.model';
import { SearchOptions } from '../../+search-page/search-options.model';
import { SearchResult } from '../../+search-page/search-result.model';
import { WorkspaceitemDataService } from '../../core/data/workspaceitem-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RouteService } from '../../shared/route.service';
import { Workspaceitem } from '../../submission/models/workspaceitem.model';
import { MyDSpaceResult } from '../my-dspace-result.model';

@Injectable()
export class MyDspaceService extends SearchService implements OnDestroy {

  searchLink = '/mydspace';

  config: SearchFilterConfig[] = [
    Object.assign(new SearchFilterConfig(),
      {
        name: 'scope',
        type: FilterType.hierarchy,
        hasFacets: true,
        isOpenByDefault: true
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'author',
        type: FilterType.text,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'date',
        type: FilterType.range,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'subject',
        type: FilterType.text,
        hasFacets: false,
        isOpenByDefault: false
      })
  ];
  // searchOptions: BehaviorSubject<SearchOptions>;
  searchOptions: SearchOptions;

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

    const errorMessage = undefined;
    const statusCode = '200';
    const returningPageInfo = new PageInfo();

    if (isNotEmpty(searchOptions)) {
      returningPageInfo.elementsPerPage = searchOptions.pagination.pageSize;
      returningPageInfo.currentPage = searchOptions.pagination.currentPage;
    } else {
      returningPageInfo.elementsPerPage = 10;
      returningPageInfo.currentPage = 1;
    }

    const itemsObs = this.workspaceitemDataService.findAll({
      currentPage: returningPageInfo.currentPage,
      elementsPerPage: returningPageInfo.elementsPerPage
    }).do((rd) => console.log(rd));

    return itemsObs
      .filter((rd: RemoteData<Workspaceitem[]>) => rd.hasSucceeded)
      .startWith(new RemoteData(
        '',
        true,
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ));
  }

}
