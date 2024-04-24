// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import { take } from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
  isNotEmptyOperator,
} from '../../shared/empty.util';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import {
  FindAllData,
  FindAllDataImpl,
} from '../data/base/find-all-data';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import {
  SearchData,
  SearchDataImpl,
} from '../data/base/search-data';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { BrowseDefinitionRestRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';

/**
 * Create a GET request for the given href, and send it.
 * Use a GET request specific for BrowseDefinitions.
 */
export const createAndSendBrowseDefinitionGetRequest = (requestService: RequestService,
  responseMsToLive: number,
  href$: string | Observable<string>,
  useCachedVersionIfAvailable: boolean = true): void => {
  if (isNotEmpty(href$)) {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }

    href$.pipe(
      isNotEmptyOperator(),
      take(1),
    ).subscribe((href: string) => {
      const requestId = requestService.generateRequestId();
      const request = new BrowseDefinitionRestRequest(requestId, href);
      if (hasValue(responseMsToLive)) {
        request.responseMsToLive = responseMsToLive;
      }
      requestService.send(request, useCachedVersionIfAvailable);
    });
  }
};

/**
 * Custom extension of {@link FindAllDataImpl} to be able to send BrowseDefinitionRestRequests
 */
class BrowseDefinitionFindAllDataImpl extends FindAllDataImpl<BrowseDefinition> {
  createAndSendGetRequest(href$: string | Observable<string>, useCachedVersionIfAvailable: boolean = true) {
    createAndSendBrowseDefinitionGetRequest(this.requestService, this.responseMsToLive, href$, useCachedVersionIfAvailable);
  }
}

/**
 * Data service responsible for retrieving browse definitions from the REST server
 */
@Injectable({
  providedIn: 'root',
})
export class BrowseDefinitionDataService extends IdentifiableDataService<BrowseDefinition> implements FindAllData<BrowseDefinition>, SearchData<BrowseDefinition> {
  private findAllData: BrowseDefinitionFindAllDataImpl;
  private searchData: SearchDataImpl<BrowseDefinition>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('browses', requestService, rdbService, objectCache, halService);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.findAllData = new BrowseDefinitionFindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options                     Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>>}
   *    Return an observable that emits object list
   */
  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod                The search method for the object
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Create the HREF for a specific object's search method with given options object
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public getSearchByHref(searchMethod: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<string> {
    return this.searchData.getSearchByHref(searchMethod, options, ...linksToFollow);
  }

  /**
   * Get the browse URL by providing a list of metadata keys. The first matching browse index definition
   * for any of the fields is returned. This is used in eg. item page field component, which can be configured
   * with several fields for a component like 'Author', and needs to know if and how to link the values
   * to configured browse indices.
   *
   * @param fields  an array of field strings, eg. ['dc.contributor.author', 'dc.creator']
   * @param useCachedVersionIfAvailable Override the data service useCachedVersionIfAvailable parameter (default: true)
   * @param reRequestOnStale Override the data service reRequestOnStale parameter (default: true)
   * @param linksToFollow Override the data service linksToFollow parameter (default: empty array)
   */
  findByFields(
    fields: string[],
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]
  ): Observable<RemoteData<BrowseDefinition>> {
    const searchParams = [];
    searchParams.push(new RequestParam('fields', fields));

    const hrefObs = this.getSearchByHref(
      'byFields',
      { searchParams },
      ...linksToFollow,
    );

    return this.findByHref(
      hrefObs,
      useCachedVersionIfAvailable,
      reRequestOnStale,
      ...linksToFollow,
    );
  }

  createAndSendGetRequest(href$: string | Observable<string>, useCachedVersionIfAvailable: boolean = true) {
    createAndSendBrowseDefinitionGetRequest(this.requestService, this.responseMsToLive, href$, useCachedVersionIfAvailable);
  }
}

