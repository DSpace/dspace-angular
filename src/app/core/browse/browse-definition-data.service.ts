// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import { BROWSE_DEFINITION } from '../shared/browse-definition.resource-type';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { FindListOptions } from '../data/find-list-options.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { FindAllData, FindAllDataImpl } from '../data/base/find-all-data';
import { dataService } from '../data/base/data-service.decorator';
import { isNotEmpty, isNotEmptyOperator, hasValue } from '../../shared/empty.util';
import { take } from 'rxjs/operators';
import { BrowseDefinitionRestRequest } from '../data/request.models';
import { BrowseDefinition } from '../shared/browse-definition.model';

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
      take(1)
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
@dataService(BROWSE_DEFINITION)
export class BrowseDefinitionDataService extends IdentifiableDataService<BrowseDefinition> implements FindAllData<BrowseDefinition> {
  private findAllData: BrowseDefinitionFindAllDataImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('browses', requestService, rdbService, objectCache, halService);

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

  createAndSendGetRequest(href$: string | Observable<string>, useCachedVersionIfAvailable: boolean = true) {
    createAndSendBrowseDefinitionGetRequest(this.requestService, this.responseMsToLive, href$, useCachedVersionIfAvailable);
  }
}

