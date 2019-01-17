
import { distinctUntilChanged, map, filter, switchMap, tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { CoreState } from '../core.reducers';
import { Item } from '../shared/item.model';
import { URLCombiner } from '../url-combiner/url-combiner';

import { DataService } from './data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  DeleteRequest,
  FindAllOptions,
  MappingCollectionsRequest,
  PatchRequest,
  PostRequest,
  RestRequest
} from './request.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GenericSuccessResponse, RestResponse } from '../cache/response.models';
import { configureRequest, filterSuccessfulResponses, getResponseFromEntry } from '../shared/operators';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { Collection } from '../shared/collection.model';
import { RequestEntry } from './request.reducer';

@Injectable()
export class ItemDataService extends DataService<NormalizedItem, Item> {
  protected linkPath = 'items';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    private bs: BrowseService,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService) {
    super();
  }

  /**
   * Get the endpoint for browsing items
   *  (When options.sort.field is empty, the default field to browse by will be 'dc.date.issued')
   * @param {FindAllOptions} options
   * @returns {Observable<string>}
   */
  public getBrowseEndpoint(options: FindAllOptions = {}, linkPath: string = this.linkPath): Observable<string> {
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
  public getMappingCollectionsEndpoint(itemId: string, collectionId?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/mappingCollections${collectionId ? `/${collectionId}` : ''}`)
    );
  }

  /**
   * Removes the mapping of an item from a collection
   * @param itemId        The item's id
   * @param collectionId  The collection's id
   */
  public removeMappingFromCollection(itemId: string, collectionId: string): Observable<RestResponse> {
    return this.getMappingCollectionsEndpoint(itemId, collectionId).pipe(
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
   * @param itemId        The item's id
   * @param collectionId  The collection's id
   */
  public mapToCollection(itemId: string, collectionId: string): Observable<RestResponse> {
    return this.getMappingCollectionsEndpoint(itemId, collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL)),
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
    const request$ = this.getMappingCollectionsEndpoint(itemId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new MappingCollectionsRequest(this.requestService.generateRequestId(), endpointURL)),
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
   * Clears all requests (from cache) connected to the mappingCollections endpoint
   * @param itemId
   */
  public clearMappedCollectionsRequests(itemId: string) {
    this.getMappingCollectionsEndpoint(itemId).pipe(take(1)).subscribe((href: string) => {
      this.requestService.removeByHrefSubstring(href);
    });
  }

  /**
   * Get the endpoint for item withdrawal and reinstatement
   * @param itemId
   */
  public getItemWithdrawEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, itemId))
    );
  }

  /**
   * Get the endpoint to make item private and public
   * @param itemId
   */
  public getItemDiscoverableEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, itemId))
    );
  }

  /**
   * Get the endpoint to delete the item
   * @param itemId
   */
  public getItemDeleteEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, itemId))
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
      switchMap((request: RestRequest) => this.requestService.getByUUID(request.uuid)),
      getResponseFromEntry()
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
      switchMap((request: RestRequest) => this.requestService.getByUUID(request.uuid)),
      getResponseFromEntry()
    );
  }

  /**
   * Delete the item
   * @param itemId
   */
  public delete(itemId: string) {
    return this.getItemDeleteEndpoint(itemId).pipe(
      distinctUntilChanged(),
      map((endpointURL: string) =>
        new DeleteRequest(this.requestService.generateRequestId(), endpointURL)
      ),
      configureRequest(this.requestService),
      switchMap((request: RestRequest) => this.requestService.getByUUID(request.uuid)),
      getResponseFromEntry()
    );
  }

}
