/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  take,
} from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { AppliedFilter } from '../../../shared/search/models/applied-filter.model';
import { FacetValue } from '../../../shared/search/models/facet-value.model';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '../../../shared/search/models/search-filter-config.model';
import { SearchObjects } from '../../../shared/search/models/search-objects.model';
import { SearchFacetDataService } from '../../../shared/search/services/search-facet.data.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { RequestParam } from '../../cache/models/request-param.model';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { PaginatedList } from '../../data/paginated-list.model';
import { RemoteData } from '../../data/remote-data';
import { RequestService } from '../../data/request.service';
import { PaginationService } from '../../pagination/pagination.service';
import { RouteService } from '../../services/route.service';
import { DSpaceObject } from '../dspace-object.model';
import { HALEndpointService } from '../hal-endpoint.service';
import { ViewMode } from '../view-mode.model';
import { SearchConfigurationService } from './search-configuration.service';

/**
 * Service that performs all general actions that have to do with the search page
 */
@Injectable({ providedIn: 'root' })
export class SearchService {

  public appliedFilters$: BehaviorSubject<AppliedFilter[]> = new BehaviorSubject([]);

  constructor(
    private routeService: RouteService,
    protected requestService: RequestService,
    private rdb: RemoteDataBuildService,
    private halService: HALEndpointService,
    private dspaceObjectService: DSpaceObjectDataService,
    private paginationService: PaginationService,
    private searchConfigurationService: SearchConfigurationService,
    private angulartics2: Angulartics2,
    private searchFacetService: SearchFacetDataService,
  ) {
  }

  /**
   * Get the currently {@link AppliedFilter}s for the given filter.
   *
   * @param filterName The name of the filter
   */
  getSelectedValuesForFilter(filterName: string): Observable<AppliedFilter[]> {
    return this.appliedFilters$.pipe(
      map((appliedFilters: AppliedFilter[]) => appliedFilters.filter((appliedFilter: AppliedFilter) => appliedFilter.filter === filterName)),
      distinctUntilChanged((previous: AppliedFilter[], next: AppliedFilter[]) => JSON.stringify(previous) === JSON.stringify(next)),
    );
  }


  /**
   * Method to request a single page of filter values for a given value
   * @param {SearchFilterConfig} filterConfig The filter config for which we want to request filter values
   * @param {number} valuePage The page number of the filter values
   * @param {SearchOptions} searchOptions The search configuration for the current search
   * @param {string} filterQuery The optional query used to filter out filter values
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @returns {Observable<RemoteData<PaginatedList<FacetValue>>>} Emits the given page of facet values
   */
  getFacetValuesFor(filterConfig: SearchFilterConfig, valuePage: number, searchOptions?: PaginatedSearchOptions, filterQuery?: string, useCachedVersionIfAvailable = true): Observable<RemoteData<PaginatedList<FacetValue>>> {
    if (hasValue(searchOptions)) {
      searchOptions = Object.assign(new PaginatedSearchOptions({}), searchOptions, {
        pagination: Object.assign({}, searchOptions.pagination, {
          currentPage: valuePage,
          pageSize: filterConfig.pageSize,
        }),
      });
    } else {
      searchOptions = new PaginatedSearchOptions({
        pagination: Object.assign(new PaginationComponentOptions(), {
          currentPage: valuePage,
          pageSize: filterConfig.pageSize,
        }),
      });
    }
    const listOptions = searchOptions.toFindListOptions();
    if (hasValue(filterQuery)) {
      listOptions.searchParams.push(new RequestParam('prefix', filterQuery));
    }

    return this.searchFacetService.findValues(filterConfig.name, listOptions, useCachedVersionIfAvailable);
  }

  /**
   * Requests the current view mode based on the current URL
   * @returns {Observable<ViewMode>} The current view mode
   */
  getViewMode(): Observable<ViewMode> {
    return this.routeService.getQueryParamMap().pipe(map((params) => {
      if (isNotEmpty(params.get('view')) && hasValue(params.get('view'))) {
        return params.get('view');
      } else {
        return ViewMode.ListElement;
      }
    }));
  }

  /**
   * Changes the current view mode in the current URL
   * @param {ViewMode} viewMode Mode to switch to
   * @param {string[]} searchLinkParts
   */
  setViewMode(viewMode: ViewMode, searchLinkParts?: string[]) {
    this.paginationService.getCurrentPagination(this.searchConfigurationService.paginationID, new PaginationComponentOptions()).pipe(take(1))
      .subscribe((config) => {
        let pageParams = { page: 1 };
        const queryParams = { view: viewMode };
        if (viewMode === ViewMode.DetailedListElement) {
          pageParams = Object.assign(pageParams, { pageSize: 1 });
        } else if (config.pageSize === 1) {
          pageParams = Object.assign(pageParams, { pageSize: 10 });
        }
        this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, hasValue(searchLinkParts) ? searchLinkParts : [this.getSearchLink()], pageParams, queryParams);
      });
  }

  /**
   * Send search event to rest api using angulartics2
   * @param config              Paginated search options used
   * @param searchQueryResponse The response objects of the performed search
   * @param clickedObject       Optional UUID of an object a search was performed and clicked for
   */
  trackSearch(config: PaginatedSearchOptions, searchQueryResponse: SearchObjects<DSpaceObject>, clickedObject?: string) {
    const filters: { filter: string, operator: string, value: string, label: string; }[] = [];
    const appliedFilters = searchQueryResponse.appliedFilters || [];
    for (let i = 0, filtersLength = appliedFilters.length; i < filtersLength; i++) {
      const appliedFilter = appliedFilters[i];
      filters.push(appliedFilter);
    }
    const searchTrackObject = {
      action: 'search',
      properties: {
        searchOptions: config,
        page: {
          size: config.pagination.size, // same as searchQueryResponse.page.elementsPerPage
          totalElements: searchQueryResponse.pageInfo.totalElements,
          totalPages: searchQueryResponse.pageInfo.totalPages,
          number: config.pagination.currentPage, // same as searchQueryResponse.page.currentPage
        },
        sort: {
          by: config.sort.field,
          order: config.sort.direction,
        },
        filters: filters,
        clickedObject,
      },
    };

    this.angulartics2.eventTrack.next(searchTrackObject);
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink(): string {
    return '/search';
  }

}
