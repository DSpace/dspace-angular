/* eslint-disable max-classes-per-file */
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { Injectable } from '@angular/core';
import { VOCABULARY_ENTRY } from '../submission/vocabularies/models/vocabularies.resource-type';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteData } from './remote-data';
import { Observable } from 'rxjs';
import { PaginatedList } from './paginated-list.model';
import { ITEM_TYPE } from '../shared/item-relationships/item-type.resource-type';
import { LICENSE } from '../shared/license.resource-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from './find-list-options.model';

class DataServiceImpl extends DataService<any> {
  // linkPath isn't used if we're only searching by href.
  protected linkPath = undefined;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<any>) {
    super();
  }
}

/**
 * A DataService with only findByHref methods. Its purpose is to be used for resources that don't
 * need to be retrieved by ID, or have any way to update them, but require a DataService in order
 * for their links to be resolved by the LinkService.
 *
 * an @dataService annotation can be added for any number of these resource types
 */
@Injectable({
  providedIn: 'root'
})
@dataService(VOCABULARY_ENTRY)
@dataService(ITEM_TYPE)
@dataService(LICENSE)
export class HrefOnlyDataService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<any>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, store, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param href                        The url of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByHref<T extends CacheableObject>(href: string | Observable<string>, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    return this.dataService.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of objects, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param href                        The url of object we want to retrieve
   * @param findListOptions             Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findAllByHref<T extends CacheableObject>(href: string | Observable<string>, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<PaginatedList<T>>> {
    return this.dataService.findAllByHref(href, findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
