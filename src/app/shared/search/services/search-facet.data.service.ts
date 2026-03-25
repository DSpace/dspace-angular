/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import {
  map,
  skipWhile,
  take,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import {
  FindAllData,
  FindAllDataImpl,
} from '../../../core/data/base/find-all-data';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import { FacetValueResponseParsingService } from '../../../core/data/facet-value-response-parsing.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { ResponseParsingService } from '../../../core/data/parsing.service';
import { RemoteData } from '../../../core/data/remote-data';
import { GetRequest } from '../../../core/data/request.models';
import { RequestService } from '../../../core/data/request.service';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import {
  hasValue,
  isNotEmpty,
  isNotEmptyOperator,
} from '../../empty.util';
import { Facet } from '../models/facet.model';
import { FacetValue } from '../models/facet-value.model';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchOptions } from '../models/search-options.model';
import { parseFindListOptions } from './search-service.util';

/**
 * Data service for retrieving search facets and facet values from the REST API.
 */
@Injectable({ providedIn: 'root' })
export class SearchFacetDataService extends IdentifiableDataService<Facet> implements FindAllData<Facet> {
  private findAllData: FindAllDataImpl<Facet>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('facets', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  searchFacet(facetName: string, options: SearchOptions, useCachedVersionIfAvailable: boolean = true, reRequestOnStale: boolean = true, ...linksToFollow): Observable<RemoteData<Facet>> {
    const href$ = this.getIDHrefObs(facetName).pipe(
      map((href) => this.buildHrefFromFindOptions(href, options, [], ...linksToFollow)),
    );
    return this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  findAll(options?: FindListOptions | PaginatedSearchOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow): Observable<RemoteData<PaginatedList<Facet>>> {
    return this.findAllData.findAll(parseFindListOptions(options), useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  findValues(facetName: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow): Observable<RemoteData<PaginatedList<FacetValue>>> {
    const href$ = this.getIDHrefObs(facetName).pipe(
      map((href) => new URLCombiner(href, 'values').toString()),
    );
    return this.findValuesByHref(href$, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  findValuesByHref(href$: Observable<string>, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow): Observable<RemoteData<PaginatedList<FacetValue>>> {
    const requestHref$ = href$.pipe(
      isNotEmptyOperator(),
      take(1),
      map((href: string) => this.buildHrefFromFindOptions(href, options, [], ...linksToFollow)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );

    const startTime: number = new Date().getTime();
    this.createAndSendValuesGetRequest(requestHref$, useCachedVersionIfAvailable);

    return this.rdbService.buildList<FacetValue>(requestHref$, ...linksToFollow).pipe(
      skipWhile((rd: RemoteData<PaginatedList<FacetValue>>) => rd.isStale || (!useCachedVersionIfAvailable && rd.lastUpdated < startTime)),
      this.reRequestStaleRemoteData(reRequestOnStale, () =>
        this.findValuesByHref(requestHref$, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow)),
    );
  }

  protected createAndSendValuesGetRequest(href$: string | Observable<string>, useCachedVersionIfAvailable = true): void {
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
          return FacetValueResponseParsingService;
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
