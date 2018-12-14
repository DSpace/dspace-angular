import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {isNotEmpty} from '../../shared/empty.util';
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
import {FindAllOptions, PatchRequest, RestRequest} from './request.models';
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
    return this.bs.getBrowseURLFor(field, this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => new URLCombiner(href, `?scope=${options.scopeID}`).toString()),
      distinctUntilChanged(),);
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
      getResponseFromSelflink(this.responseCache),
      map((responseCacheEntry: ResponseCacheEntry) => responseCacheEntry.response)
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
      getResponseFromSelflink(this.responseCache),
      map((responseCacheEntry: ResponseCacheEntry) => responseCacheEntry.response)
    );
  }

}
