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
import { SearchParam } from '../cache/models/search-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ContentSourceSuccessResponse, RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { Collection } from '../shared/collection.model';
import { COLLECTION } from '../shared/collection.resource-type';
import { ContentSource } from '../shared/content-source.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRequestFromRequestHref,
  getResponseFromEntry
} from '../shared/operators';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { PaginatedList } from './paginated-list';
import { ResponseParsingService } from './parsing.service';
import { RemoteData } from './remote-data';
import {
  ContentSourceRequest,
  FindListOptions,
  GetRequest,
  RestRequest,
  UpdateContentSourceRequest
} from './request.models';
import { RequestService } from './request.service';

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
    protected comparator: DSOChangeAnalyzer<Collection>,
    protected translate: TranslateService
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
    options = Object.assign({}, options, {
      searchParams: [new SearchParam('uuid', communityId)]
    });

    return this.searchBy(searchHref, options).pipe(
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
  getContentSource(collectionId: string): Observable<ContentSource> {
    return this.getHarvesterEndpoint(collectionId).pipe(
      map((href: string) => new ContentSourceRequest(this.requestService.generateRequestId(), href)),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getRequestFromRequestHref(this.requestService),
      filterSuccessfulResponses(),
      map((response: ContentSourceSuccessResponse) => response.contentsource)
    );
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
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful) {
          if (hasValue((response as any).errorMessage)) {
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
      map((response: ContentSourceSuccessResponse | INotification) => {
        if (isNotEmpty((response as any).contentsource)) {
          return (response as ContentSourceSuccessResponse).contentsource;
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
