import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, map, switchMap, tap } from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BrowseService } from '../browse/browse.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GenericSuccessResponse, RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { Collection } from '../shared/collection.model';
import { ExternalSourceEntry } from '../shared/external-source-entry.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { ITEM } from '../shared/item.resource-type';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRequestFromRequestHref,
  getResponseFromEntry
} from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';

import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import {
  DeleteRequest,
  FindListOptions,
  MappedCollectionsRequest,
  PatchRequest,
  PostRequest,
  PutRequest,
  RestRequest
} from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';

@Injectable()
@dataService(ITEM)
export class ItemDataService extends DataService<Item> {
  protected linkPath = 'items';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    private bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Item>,
  ) {
    super();
  }

  /**
   * Get the endpoint for browsing items
   *  (When options.sort.field is empty, the default field to browse by will be 'dc.date.issued')
   * @param {FindListOptions} options
   * @returns {Observable<string>}
   */
  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    let field = 'dc.date.issued';
    if (options.sort && options.sort.field) {
      field = options.sort.field;
    }
    return this.bs.getBrowseURLFor(field, linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => new URLCombiner(href, `?scope=${options.scopeID}`).toString()),
      distinctUntilChanged(),);
  }

  /**
   * Fetches the endpoint used for mapping an item to a collection,
   * or for fetching all collections the item is mapped to if no collection is provided
   * @param itemId        The item's id
   * @param collectionId  The collection's id (optional)
   */
  public getMappedCollectionsEndpoint(itemId: string, collectionId?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/mappedCollections${collectionId ? `/${collectionId}` : ''}`)
    );
  }

  /**
   * Removes the mapping of an item from a collection
   * @param itemId        The item's id
   * @param collectionId  The collection's id
   */
  public removeMappingFromCollection(itemId: string, collectionId: string): Observable<RestResponse> {
    return this.getMappedCollectionsEndpoint(itemId, collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new DeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      switchMap((request: RestRequest) => this.requestService.getByUUID(request.uuid)),
      getResponseFromEntry()
    );
  }

  /**
   * Maps an item to a collection
   * @param itemId          The item's id
   * @param collectionHref  The collection's self link
   */
  public mapToCollection(itemId: string, collectionHref: string): Observable<RestResponse> {
    return this.getMappedCollectionsEndpoint(itemId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        return new PostRequest(this.requestService.generateRequestId(), endpointURL, collectionHref, options);
      }),
      configureRequest(this.requestService),
      switchMap((request: RestRequest) => this.requestService.getByUUID(request.uuid)),
      getResponseFromEntry()
    );
  }

  /**
   * Fetches all collections the item is mapped to
   * @param itemId    The item's id
   */
  public getMappedCollections(itemId: string): Observable<RemoteData<PaginatedList<Collection>>> {
    const request$ = this.getMappedCollectionsEndpoint(itemId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new MappedCollectionsRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService)
    );

    const requestEntry$ = request$.pipe(
      switchMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );
    const payload$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: GenericSuccessResponse<PaginatedList<Collection>>) => response.payload)
    );

    return this.rdbService.toRemoteDataObservable(requestEntry$, payload$);
  }

  /**
   * Get the endpoint for item withdrawal and reinstatement
   * @param itemId
   */
  public getItemWithdrawEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, itemId))
    );
  }

  /**
   * Get the endpoint to make item private and public
   * @param itemId
   */
  public getItemDiscoverableEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, itemId))
    );
  }

  /**
   * Set the isWithdrawn state of an item to a specified state
   * @param itemId
   * @param withdrawn
   */
  public setWithDrawn(itemId: string, withdrawn: boolean) {
    const patchOperation = [{
      op: 'replace', path: '/withdrawn', value: withdrawn
    }];
    return this.getItemWithdrawEndpoint(itemId).pipe(
      distinctUntilChanged(),
      map((endpointURL: string) =>
        new PatchRequest(this.requestService.generateRequestId(), endpointURL, patchOperation)
      ),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getRequestFromRequestHref(this.requestService),
      map((requestEntry: RequestEntry) => requestEntry.response)
    );
  }

  /**
   * Set the isDiscoverable state of an item to a specified state
   * @param itemId
   * @param discoverable
   */
  public setDiscoverable(itemId: string, discoverable: boolean) {
    const patchOperation = [{
      op: 'replace', path: '/discoverable', value: discoverable
    }];
    return this.getItemDiscoverableEndpoint(itemId).pipe(
      distinctUntilChanged(),
      map((endpointURL: string) =>
        new PatchRequest(this.requestService.generateRequestId(), endpointURL, patchOperation)
      ),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getRequestFromRequestHref(this.requestService),
      map((requestEntry: RequestEntry) => requestEntry.response)
    );
  }

  /**
   * Get the endpoint to move the item
   * @param itemId
   */
  public getMoveItemEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/owningCollection`)
    );
  }

  /**
   * Move the item to a different owning collection
   * @param itemId
   * @param collection
   */
  public moveToCollection(itemId: string, collection: Collection): Observable<RestResponse> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getMoveItemEndpoint(itemId);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PutRequest(requestId, href, collection._links.self.href, options);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response)
    );
  }

  /**
   * Import an external source entry into a collection
   * @param externalSourceEntry
   * @param collectionId
   */
  public importExternalSourceEntry(externalSourceEntry: ExternalSourceEntry, collectionId: string): Observable<RemoteData<Item>> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();
    const href$ = this.halService.getEndpoint(this.linkPath).pipe(map((href) => `${href}?owningCollection=${collectionId}`));

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, externalSourceEntry._links.self.href, options);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      getResponseFromEntry(),
      map((response: any) => {
        if (isNotEmpty(response.resourceSelfLinks)) {
          return response.resourceSelfLinks[0];
        }
      }),
      switchMap((selfLink: string) => this.findByHref(selfLink))
    );
  }

  /**
   * Get the endpoint for an item's bitstreams
   * @param itemId
   */
  public getBitstreamsEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((url: string) => this.halService.getEndpoint('bitstreams', `${url}/${itemId}`))
    );
  }
}
