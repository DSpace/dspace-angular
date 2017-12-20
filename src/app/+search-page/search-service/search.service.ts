import { Injectable, OnDestroy } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { SearchResult } from '../search-result.model';
import { ItemDataService } from '../../core/data/item-data.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchOptions } from '../search-options.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Metadatum } from '../../core/shared/metadatum.model';
import { Item } from '../../core/shared/item.model';
import { ItemSearchResult } from '../../object-list/search-result-list-element/item-search-result/item-search-result.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { FilterType } from './filter-type.model';
import { FacetValue } from './facet-value.model';
import { ViewMode } from '../../+search-page/search-options.model';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RouteService } from '../../shared/route.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';

function shuffle(array: any[]) {
  let i = 0;
  let j = 0;
  let temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

@Injectable()
export class SearchService implements OnDestroy {

  totalPages = 5;
  mockedHighlights: string[] = new Array(
    'This is a <em>sample abstract</em>.',
    'This is a sample abstractabstractabstractabstractabstractabstractabstractabstract. But, to fill up some space, here\'s <em>"Hello"</em> in several different languages : ',
    'This is a Sample HTML webpage including several <em>images</em> and styles (CSS).',
    'This is <em>really</em> just a sample abstract. But, Í’vé thrown ïn a cõuple of spëciâl charactèrs för êxtrå fuñ!',
    'This abstract is <em>really quite great</em>',
    'The solution structure of the <em>bee</em> venom neurotoxin',
    'BACKGROUND: The <em>Open Archive Initiative (OAI)</em> refers to a movement started around the \'90 s to guarantee free access to scientific information',
    'The collision fault detection of a <em>XXY</em> stage is proposed for the first time in this paper',
    '<em>This was blank in the actual item, no abstract</em>',
    '<em>The QSAR DataBank (QsarDB) repository</em>',
  );
  private sub;
  searchLink = '/search';

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

  constructor(private itemDataService: ItemDataService,
              private routeService: RouteService,
              private route: ActivatedRoute,
              private router: Router) {

    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions();
    this.searchOptions = { pagination: pagination, sort: sort };
    // this.searchOptions = new BehaviorSubject<SearchOptions>(searchOptions);
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions): Observable<RemoteData<Array<SearchResult<DSpaceObject>>>> {
    this.searchOptions = this.searchOptions;
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

    const itemsObs = this.itemDataService.findAll({
      scopeID: scopeId,
      currentPage: returningPageInfo.currentPage,
      elementsPerPage: returningPageInfo.elementsPerPage
    });

    return itemsObs
      .filter((rd: RemoteData<Item[]>) => rd.hasSucceeded)
      .map((rd: RemoteData<Item[]>) => {

        const totalElements = rd.pageInfo.totalElements > 20 ? 20 : rd.pageInfo.totalElements;
        const pageInfo = Object.assign({}, rd.pageInfo, { totalElements: totalElements });

        const payload = shuffle(rd.payload)
          .map((item: Item, index: number) => {
            const mockResult: SearchResult<DSpaceObject> = new ItemSearchResult();
            mockResult.dspaceObject = item;
            const highlight = new Metadatum();
            highlight.key = 'dc.description.abstract';
            highlight.value = this.mockedHighlights[index % this.mockedHighlights.length];
            mockResult.hitHighlights = new Array(highlight);
            return mockResult;
          });

        return new RemoteData(
          self,
          rd.isRequestPending,
          rd.isResponsePending,
          rd.hasSucceeded,
          errorMessage,
          statusCode,
          pageInfo,
          payload
        )
      }).startWith(new RemoteData(
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

  getConfig(): Observable<RemoteData<SearchFilterConfig[]>> {
    const requestPending = false;
    const responsePending = false;
    const isSuccessful = true;
    const errorMessage = undefined;
    const statusCode = '200';
    const returningPageInfo = new PageInfo();
    return Observable.of(new RemoteData(
      'https://dspace7.4science.it/dspace-spring-rest/api/search',
      requestPending,
      responsePending,
      isSuccessful,
      errorMessage,
      statusCode,
      returningPageInfo,
      this.config
    ));
  }

  getFacetValuesFor(searchFilterConfigName: string): Observable<RemoteData<FacetValue[]>> {
    const filterConfig = this.config.find((config: SearchFilterConfig) => config.name === searchFilterConfigName);
    return this.routeService.getQueryParameterValues(filterConfig.paramName).map((selectedValues: string[]) => {
        const values: FacetValue[] = [];
        const totalFilters = 13;
        for (let i = 0; i < totalFilters; i++) {
          const value = searchFilterConfigName + ' ' + (i + 1);
          if (!selectedValues.includes(value)) {
            values.push({
              value: value,
              count: Math.floor(Math.random() * 20) + 20 * (totalFilters - i), // make sure first results have the highest (random) count
              search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
            });
          }
        }
        const requestPending = false;
        const responsePending = false;
        const isSuccessful = true;
        const errorMessage = undefined;
        const statusCode = '200';
        const returningPageInfo = new PageInfo();
        return new RemoteData(
          'https://dspace7.4science.it/dspace-spring-rest/api/search',
          requestPending,
          responsePending,
          isSuccessful,
          errorMessage,
          statusCode,
          returningPageInfo,
          values
        )
      }
    )
  }

  getViewMode(): Observable<ViewMode> {
    return this.route.queryParams.map((params) => {
      if (isNotEmpty(params.view) && hasValue(params.view)) {
        return params.view;
      } else {
        return ViewMode.List;
      }
    });
  }

  setViewMode(viewMode: ViewMode) {
    const navigationExtras: NavigationExtras = {
      queryParams: { view: viewMode },
      queryParamsHandling: 'merge'
    };

    this.router.navigate([this.searchLink], navigationExtras);
  }

  getClearFiltersQueryParams(): any {
    const params = {};
    this.sub = this.route.queryParamMap
      .subscribe((map) => {
        map.keys
          .filter((key) => this.config
            .findIndex((conf: SearchFilterConfig) => conf.paramName === key) < 0)
          .forEach((key) => {
            params[key] = map.get(key);
          })
      });
    return params;
  }

  getSearchLink() {
    return this.searchLink;
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}
