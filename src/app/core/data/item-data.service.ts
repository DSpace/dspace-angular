import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {isNotEmpty, isNotEmptyOperator} from '../../shared/empty.util';
import {BrowseService} from '../browse/browse.service';
import {RemoteDataBuildService} from '../cache/builders/remote-data-build.service';
import {NormalizedItem} from '../cache/models/normalized-item.model';
import {ResponseCacheService} from '../cache/response-cache.service';
import {CoreState} from '../core.reducers';
import {Item} from '../shared/item.model';
import {URLCombiner} from '../url-combiner/url-combiner';

import {DataService} from './data.service';
import {RequestService} from './request.service';
import {HALEndpointService} from '../shared/hal-endpoint.service';
import {FindAllOptions, PostRequest, RestRequest} from './request.models';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {RestResponse} from '../cache/response-cache.models';
import {configureRequest, getResponseFromSelflink} from '../shared/operators';
import {ResponseCacheEntry} from '../cache/response-cache.reducer';

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

  public getMoveItemEndpoint(itemId: string, collectionId?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/owningCollection/move/${collectionId ? `/${collectionId}` : ''}`)
    );
  }

  public moveToCollection(itemId: string, collectionId: string): Observable<RestResponse> {
    return this.getMoveItemEndpoint(itemId, collectionId).pipe(
      // isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getResponseFromSelflink(this.responseCache),
      map((responseCacheEntry: ResponseCacheEntry) => responseCacheEntry.response)
    );
  }
}
