import { Injectable } from '@angular/core';

import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Collection } from '../shared/collection.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { Observable } from 'rxjs/internal/Observable';
import {FindListOptions, FindListRequest, GetRequest} from './request.models';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { configureRequest } from '../shared/operators';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { hasValue, isNotEmptyOperator } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { PaginatedSearchOptions } from '../../+search-page/paginated-search-options.model';
import { SearchParam } from '../cache/models/search-param.model';

@Injectable()
export class CollectionDataService extends ComColDataService<Collection> {
  protected linkPath = 'collections';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Collection>
  ) {
    super();
  }

  /**
   * Get all collections the user is authorized to submit to
   *
   * @param options The [[FindListOptions]] object
   * @return Observable<RemoteData<PaginatedList<Collection>>>
   *    collection list
   */
  getAuthorizedCollection(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findAuthorized';

    return this.searchBy(searchHref, options).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }

  /**
   * Get all collections the user is authorized to submit to, by community
   *
   * @param communityId The community id
   * @param options The [[FindListOptions]] object
   * @return Observable<RemoteData<PaginatedList<Collection>>>
   *    collection list
   */
  getAuthorizedCollectionByCommunity(communityId: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findAuthorizedByCommunity';
    const newOptions = new FindListOptions();
    newOptions.searchParams = [new SearchParam('uuid', communityId)];

    return this.searchBy(searchHref, newOptions).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }

  /**
   * Find whether there is a collection whom user has authorization to submit to
   *
   * @return boolean
   *    true if the user has at least one collection to submit to
   */
  hasAuthorizedCollection(): Observable<boolean> {
    const searchHref = 'findAuthorized';
    const options = new FindListOptions();
    options.elementsPerPage = 1;

    return this.searchBy(searchHref, options).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending),
      take(1),
      map((collections: RemoteData<PaginatedList<Collection>>) => collections.payload.totalElements > 0)
    );
  }

  /**
   * Fetches the endpoint used for mapping items to a collection
   * @param collectionId   The id of the collection to map items to
   */
  getMappedItemsEndpoint(collectionId): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, collectionId)),
      map((endpoint: string) => `${endpoint}/mappedItems`)
    );
  }

  /**
   * Fetches a list of items that are mapped to a collection
   * @param collectionId    The id of the collection
   * @param searchOptions   Search options to sort or filter out items
   */
  getMappedItems(collectionId: string, searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<DSpaceObject>>> {
    const requestUuid = this.requestService.generateRequestId();

    const href$ = this.getMappedItemsEndpoint(collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => hasValue(searchOptions) ? searchOptions.toRestUrl(endpoint) : endpoint)
    );

    href$.pipe(
      map((endpoint: string) => {
        const request = new GetRequest(requestUuid, endpoint);
        return Object.assign(request, {
          responseMsToLive: 0,
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return DSOResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService)
    ).subscribe();

    return this.rdbService.buildList(href$);
  }

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    return this.halService.getEndpoint('communities').pipe(
      switchMap((communityEndpointHref: string) =>
        this.halService.getEndpoint('collections', `${communityEndpointHref}/${parentUUID}`)),
    );
  }
}
