/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  take,
  tap,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { BaseDataService } from '../../../core/data/base/base-data.service';
import { SearchDataImpl } from '../../../core/data/base/search-data';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { ResponseParsingService } from '../../../core/data/parsing.service';
import { RemoteData } from '../../../core/data/remote-data';
import { GetRequest } from '../../../core/data/request.models';
import { RequestService } from '../../../core/data/request.service';
import { SearchResponseParsingService } from '../../../core/data/search-response-parsing.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { SearchService } from '../../../core/shared/search/search.service';
import {
  hasValue,
  isNotEmpty,
  isNotEmptyOperator,
} from '../../empty.util';
import { AppliedFilter } from '../models/applied-filter.model';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchObjects } from '../models/search-objects.model';
import { SearchResult } from '../models/search-result.model';
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
