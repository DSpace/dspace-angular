import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { BROWSE_DEFINITION } from '../shared/browse-definition.resource-type';
import { DataService } from '../data/data.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/request.models';
import { PaginatedList } from '../data/paginated-list.model';

/* tslint:disable:max-classes-per-file */

class DataServiceImpl extends DataService<BrowseDefinition> {
  protected linkPath = 'browses';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<BrowseDefinition>) {
    super();
  }
}

@Injectable({
  providedIn: 'root'
})
@dataService(BROWSE_DEFINITION)
export class BrowseDefinitionDataService {
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
    protected comparator: DefaultChangeAnalyzer<BrowseDefinition>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options           Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<BrowseDefinition>>>}
   *    Return an observable that emits object list
   */
  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return this.dataService.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of an {@link BrowseDefinition}, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the {@link BrowseDefinition}
   * @param href                        The url of {@link BrowseDefinition} we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<RemoteData<BrowseDefinition>> {
    return this.dataService.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of {@link BrowseDefinition}s, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the {@link BrowseDefinition}
   * @param href                        The url of object we want to retrieve
   * @param findListOptions             Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href: string, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return this.dataService.findAllByHref(href, findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}

/* tslint:enable:max-classes-per-file */
