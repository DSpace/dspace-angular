/* eslint-disable max-classes-per-file */
import { DataService } from './data.service';
import { Root } from './root.model';
import { Injectable } from '@angular/core';
import { ROOT } from './root.resource-type';
import { dataService } from '../cache/builders/build-decorators';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteData } from './remote-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { PaginatedList } from './paginated-list.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from './find-list-options.model';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { catchError, map } from 'rxjs/operators';


/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<Root> {
  protected linkPath = '';
  protected responseMsToLive = 6 * 60 * 60 * 1000;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Root>) {
    super();
  }
}

/**
 * A service to retrieve the {@link Root} object from the REST API.
 */
@Injectable()
@dataService(ROOT)
export class RootDataService {
  /**
   * A private DataService instance to delegate specific methods to.
   */
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Root>,
    protected restService: DspaceRestService) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Check if root endpoint is available
   */
  checkServerAvailability(): Observable<boolean> {
    return this.restService.get(this.halService.getRootHref()).pipe(
      catchError((err ) => {
        console.error(err);
        return observableOf(false);
      }),
      map((res: RawRestResponse) => res.statusCode === 200)
    );
  }

  /**
   * Find the {@link Root} object of the REST API
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findRoot(useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Root>[]): Observable<RemoteData<Root>> {
    return this.dataService.findByHref(this.halService.getRootHref(), useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param href                        The url of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByHref(href: string | Observable<string>, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Root>[]): Observable<RemoteData<Root>> {
    return this.dataService.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of objects, based on an href, with a list
   * of {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param href                        The url of object we want to retrieve
   * @param findListOptions             Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href: string | Observable<string>, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Root>[]): Observable<RemoteData<PaginatedList<Root>>> {
    return this.dataService.findAllByHref(href, findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Set to sale the root endpoint cache hit
   */
  invalidateRootCache() {
    this.requestService.setStaleByHrefSubstring(this.halService.getRootHref());
  }
}
