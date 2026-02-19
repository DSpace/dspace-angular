/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { BaseDataService } from '../../../core/data/base/base-data.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { SearchResult } from '../models/search-result.model';
import { SearchDataImpl } from '../../../core/data/base/search-data';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { SearchObjects } from '../models/search-objects.model';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../empty.util';
import { take } from 'rxjs/operators';
import { GetRequest } from '../../../core/data/request.models';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ResponseParsingService } from '../../../core/data/parsing.service';
import { SearchResponseParsingService } from '../../../core/data/search-response-parsing.service';

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
export class SearchResultsDataService extends BaseDataService<SearchObjects<DSpaceObject>> {
  private searchData: SearchDataImpl<SearchResult<DSpaceObject>>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('searchresults', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchResultsSearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  searchObjects(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow): Observable<RemoteData<SearchObjects<DSpaceObject>>> {
    return this.searchData.searchBy('objects', options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow) as Observable<RemoteData<SearchObjects<DSpaceObject>>>;
  }

}
