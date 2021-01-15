import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { INotification } from '../../shared/notifications/models/notification.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';
import { Collection } from '../shared/collection.model';
import { COLLECTION } from '../shared/collection.resource-type';
import { ContentSource } from '../shared/content-source.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import {
  configureRequest,
  getFirstCompletedRemoteData
} from '../shared/operators';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { PaginatedList } from './paginated-list.model';
import { ResponseParsingService } from './parsing.service';
import { RemoteData } from './remote-data';
import {
  ContentSourceRequest,
  FindListOptions,
  GetRequest,
  UpdateContentSourceRequest
} from './request.models';
import { RequestService } from './request.service';
import { BitstreamDataService } from './bitstream-data.service';

@Injectable()
@dataService(COLLECTION)
export class CollectionDataService extends ComColDataService<Collection> {
  protected linkPath = 'collections';
  protected errorTitle = 'collection.source.update.notifications.error.title';
  protected contentSourceError = 'collection.source.update.notifications.error.content';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected bitstreamDataService: BitstreamDataService,
    protected comparator: DSOChangeAnalyzer<Collection>,
    protected translate: TranslateService
  ) {
    super();
  }

  /**
   * Get all collections the user is authorized to submit to
   *
   * @param query limit the returned collection to those with metadata values matching the query terms.
   * @param options The [[FindListOptions]] object
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow The array of [[FollowLinkConfig]]
   * @return Observable<RemoteData<PaginatedList<Collection>>>
   *    collection list
   */
  getAuthorizedCollection(query: string, options: FindListOptions = {}, reRequestOnStale = true, ...linksToFollow: Array<FollowLinkConfig<Collection>>): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findSubmitAuthorized';
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('query', query)]
    });

    return this.searchBy(searchHref, options, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }

  /**
   * Get all collections the user is authorized to submit to
   *
   * @param query limit the returned collection to those with metadata values matching the query terms.
   * @param entityType The entity type used to limit the returned collection
   * @param options The [[FindListOptions]] object
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow The array of [[FollowLinkConfig]]
   * @return Observable<RemoteData<PaginatedList<Collection>>>
   *    collection list
   */
  getAuthorizedCollectionByEntityType(
    query: string,
    entityType: string,
    options: FindListOptions = {},
    reRequestOnStale = true,
    ...linksToFollow: Array<FollowLinkConfig<Collection>>): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findSubmitAuthorizedByEntityType';
    options = Object.assign({}, options, {
      searchParams: [
        new RequestParam('query', query),
        new RequestParam('entityType', entityType)
      ]
    });

    return this.searchBy(searchHref, options, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }

  /**
   * Get all collections the user is authorized to submit to, by community
   *
   * @param communityId The community id
   * @param query limit the returned collection to those with metadata values matching the query terms.
   * @param options The [[FindListOptions]] object
   * @return Observable<RemoteData<PaginatedList<Collection>>>
   *    collection list
   */
  getAuthorizedCollectionByCommunity(communityId: string, query: string, options: FindListOptions = {}, reRequestOnStale = true,): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findSubmitAuthorizedByCommunity';
    options = Object.assign({}, options, {
      searchParams: [
        new RequestParam('uuid', communityId),
        new RequestParam('query', query)
      ]
    });

    return this.searchBy(searchHref, options, reRequestOnStale).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }
  /**
   * Get all collections the user is authorized to submit to, by community and has the metadata
   *
   * @param communityId The community id
   * @param entityType The entity type used to limit the returned collection
   * @param options The [[FindListOptions]] object
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow The array of [[FollowLinkConfig]]
   * @return Observable<RemoteData<PaginatedList<Collection>>>
   *    collection list
   */
  getAuthorizedCollectionByCommunityAndEntityType(
    communityId: string,
    entityType: string,
    options: FindListOptions = {},
    reRequestOnStale = true,
    ...linksToFollow: Array<FollowLinkConfig<Collection>>): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findSubmitAuthorizedByCommunityAndEntityType';
    const searchParams = [
      new RequestParam('uuid', communityId),
      new RequestParam('entityType', entityType)
    ];

    options = Object.assign({}, options, {
      searchParams: searchParams
    });

    return this.searchBy(searchHref, options, reRequestOnStale, ...linksToFollow).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }
  /**
   * Find whether there is a collection whom user has authorization to submit to
   *
   * @return boolean
   *    true if the user has at least one collection to submit to
   */
  hasAuthorizedCollection(): Observable<boolean> {
    const searchHref = 'findSubmitAuthorized';
    const options = new FindListOptions();
    options.elementsPerPage = 1;

    return this.searchBy(searchHref, options).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending),
      take(1),
      map((collections: RemoteData<PaginatedList<Collection>>) => collections.payload.totalElements > 0)
    );
  }

  /**
   * Get the endpoint for the collection's content harvester
   * @param collectionId
   */
  getHarvesterEndpoint(collectionId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((href: string) => this.halService.getEndpoint('harvester', `${href}/${collectionId}`))
    );
  }

  /**
   * Get the collection's content harvester
   * @param collectionId
   */
  getContentSource(collectionId: string): Observable<RemoteData<ContentSource>> {
    const href$ = this.getHarvesterEndpoint(collectionId).pipe(
      isNotEmptyOperator(),
      take(1)
    );

    href$.subscribe((href: string) => {
      const request = new ContentSourceRequest(this.requestService.generateRequestId(), href);
      this.requestService.configure(request);
    });

    return this.rdbService.buildSingle<ContentSource>(href$);
  }

  /**
   * Update the settings of the collection's content harvester
   * @param collectionId
   * @param contentSource
   */
  updateContentSource(collectionId: string, contentSource: ContentSource): Observable<ContentSource | INotification> {
    const requestId = this.requestService.generateRequestId();
    const serializedContentSource = new DSpaceSerializer(ContentSource).serialize(contentSource);
    const request$ = this.getHarvesterEndpoint(collectionId).pipe(
      take(1),
      map((href: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        options.headers = headers;
        return new UpdateContentSourceRequest(requestId, href, JSON.stringify(serializedContentSource), options);
      })
    );

    // Execute the post/put request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Return updated ContentSource
    return this.rdbService.buildFromRequestUUID<ContentSource>(requestId).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<ContentSource>) => {
        if (response.hasFailed) {
          if (hasValue(response.errorMessage)) {
            if (response.statusCode === 422) {
              return this.notificationsService.error(this.translate.instant(this.errorTitle), this.translate.instant(this.contentSourceError), new NotificationOptions(-1));
            } else {
              return this.notificationsService.error(this.translate.instant(this.errorTitle), (response as any).errorMessage, new NotificationOptions(-1));
            }
          }
        } else {
          return response;
        }
      }),
      isNotEmptyOperator(),
      map((response: RemoteData<ContentSource> | INotification) => {
        if (isNotEmpty((response as any).payload)) {
          return (response as RemoteData<ContentSource>).payload;
        }
        return response as INotification;
      })
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
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  getMappedItems(collectionId: string, searchOptions?: PaginatedSearchOptions, ...linksToFollow: Array<FollowLinkConfig<Item>>): Observable<RemoteData<PaginatedList<DSpaceObject>>> {
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

    return this.rdbService.buildList(href$, ...linksToFollow);
  }

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    return this.halService.getEndpoint('communities').pipe(
      switchMap((communityEndpointHref: string) =>
        this.halService.getEndpoint('collections', `${communityEndpointHref}/${parentUUID}`)),
    );
  }

  /**
   * Returns {@link RemoteData} of {@link Collection} that is the owing collection of the given item
   * @param item  Item we want the owning collection of
   */
  findOwningCollectionFor(item: Item): Observable<RemoteData<Collection>> {
    return this.findByHref(item._links.owningCollection.href);
  }

}
