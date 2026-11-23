/* eslint-disable max-classes-per-file */
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { BaseDataService } from '@dspace/core/data/base/base-data.service';
import { SearchDataImpl } from '@dspace/core/data/base/search-data';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { ResponseParsingService } from '@dspace/core/data/parsing.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { GetRequest } from '@dspace/core/data/request.models';
import { RequestService } from '@dspace/core/data/request.service';
import { SearchResponseParsingService } from '@dspace/core/data/search-response-parsing.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { AppliedFilter } from '@dspace/core/shared/search/models/applied-filter.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import {
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  take,
  tap,
} from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
  isNotEmptyOperator,
} from '../../../utils/empty.util';
import { SearchService } from '../search.service';
import { parseFindListOptions } from './search-service.util';

/**
 * Custom SearchDataImpl attaching a custom response-parser for search-results to the GET request
 */
class SearchResultsSearchDataImpl extends SearchDataImpl<SearchResult<DSpaceObject>> {
  private parser: GenericConstructor<ResponseParsingService> = SearchResponseParsingService;

  protected createAndSendGetRequest(href$: string | Observable<string>, useCachedVersionIfAvailable = true): void {
    if (isNotEmpty(href$)) {
      if (typeof href$ === 'string') {
        href$ = of(href$);
      }

      href$.pipe(
        isNotEmptyOperator(),
        take(1),
      ).subscribe((href: string) => {
        const requestId = this.requestService.generateRequestId();
        const getResponseParserFn: () => GenericConstructor<ResponseParsingService> = () => {
          return this.parser;
        };

        const request: GetRequest = Object.assign(new GetRequest(requestId, href), {
          getResponseParser: getResponseParserFn,
        });

        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.send(request, useCachedVersionIfAvailable);
      });
    }
  }
}

/**
 * Data service for retrieving search results from the REST API.
 */
@Injectable({ providedIn: 'root' })
export class SearchResultsDataService extends BaseDataService<SearchResult<DSpaceObject>> {
  private searchData: SearchDataImpl<SearchResult<DSpaceObject>>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected searchService: SearchService,
  ) {
    super('searchresults', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchResultsSearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  searchObjects(options?: FindListOptions | PaginatedSearchOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow): Observable<RemoteData<SearchObjects<DSpaceObject>>> {
    return this.searchData.searchBy('objects', parseFindListOptions(options), useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      tap((rd: RemoteData<SearchObjects<DSpaceObject>>) => {
        if (rd.hasSucceeded) {
          const appliedFilters: AppliedFilter[] = (rd.payload.appliedFilters ?? [])
            .filter((appliedFilter: AppliedFilter) => hasValue(appliedFilter))
            // TODO this should ideally be fixed in the backend
            .map((appliedFilter: AppliedFilter) => Object.assign({}, appliedFilter, {
              operator: hasValue(appliedFilter.value.match(/\[\s*(\*|\d+)\s*TO\s*(\*|\d+)\s*]/)) ? 'range' : appliedFilter.operator,
            }));
          this.searchService.appliedFilters$.next(appliedFilters);
        }
      }),
    ) as Observable<RemoteData<SearchObjects<DSpaceObject>>>;
  }

  invalidateSearchObjects(): Observable<boolean> {
    return this.searchData.getSearchByHref('objects').pipe(
      switchMap((href) => this.requestService.setStaleByHrefSubstring(href)),
    );
  }

}
