import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { ensureArrayHasValue, isEmpty, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { Item } from '../shared/item.model';
import { URLCombiner } from '../url-combiner/url-combiner';

import { DataService } from './data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  DeleteRequest,
  FindAllOptions,
  GetRequest,
  MappingCollectionsRequest,
  PostRequest,
  RestRequest
} from './request.models';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRequestFromSelflink,
  getResponseFromSelflink
} from '../shared/operators';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { DSOSuccessResponse, GenericSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { Collection } from '../shared/collection.model';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';

@Injectable()
export class ItemDataService extends DataService<NormalizedItem, Item> {
  protected linkPath = 'items';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    private bs: BrowseService,
    protected halService: HALEndpointService) {
    super();
  }

  /**
   * Get the endpoint for browsing items
   *  (When options.sort.field is empty, the default field to browse by will be 'dc.date.issued')
   * @param {FindAllOptions} options
   * @returns {Observable<string>}
   */
  public getBrowseEndpoint(options: FindAllOptions = {}): Observable<string> {
    let field = 'dc.date.issued';
    if (options.sort && options.sort.field) {
      field = options.sort.field;
    }
    return this.bs.getBrowseURLFor(field, this.linkPath)
      .filter((href: string) => isNotEmpty(href))
      .map((href: string) => new URLCombiner(href, `?scope=${options.scopeID}`).toString())
      .distinctUntilChanged();
  }

  public getMappingCollectionsEndpoint(itemId: string, collectionId?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/mappingCollections${collectionId ? `/${collectionId}` : ''}`)
    );
  }

  public removeMappingFromCollection(itemId: string, collectionId: string): Observable<RestResponse> {
    return this.getMappingCollectionsEndpoint(itemId, collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new DeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getResponseFromSelflink(this.responseCache),
      map((responseCacheEntry: ResponseCacheEntry) => responseCacheEntry.response)
    );
  }

  public mapToCollection(itemId: string, collectionId: string): Observable<RestResponse> {
    return this.getMappingCollectionsEndpoint(itemId, collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getResponseFromSelflink(this.responseCache),
      map((responseCacheEntry: ResponseCacheEntry) => responseCacheEntry.response)
    );
  }

  public getMappedCollections(itemId: string): Observable<RemoteData<PaginatedList<Collection>>> {
    const request$ = this.getMappingCollectionsEndpoint(itemId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new MappingCollectionsRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService)
    );

    const href$ = request$.pipe(map((request: RestRequest) => request.href));
    const requestEntry$ = href$.pipe(getRequestFromSelflink(this.requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(this.responseCache));
    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<PaginatedList<Collection>>) => response.payload)
    );

    return this.rdbService.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  }

}
