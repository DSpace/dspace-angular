import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';

import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { FindListOptions } from '../data/request.models';
import { Collection } from '../shared/collection.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResourcePolicy } from '../shared/resource-policy.model';
import { RemoteData } from '../data/remote-data';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RESOURCE_POLICY } from '../shared/resource-policy.resource-type';
import { ChangeAnalyzer } from './change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { PaginatedList } from './paginated-list';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<ResourcePolicy> {
  protected linkPath = 'resourcepolicies';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<ResourcePolicy>) {
    super();
  }

}

/**
 * A service responsible for fetching/sending data from/to the REST API on the resourcepolicies endpoint
 */
@Injectable()
@dataService(RESOURCE_POLICY)
export class ResourcePolicyService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ResourcePolicy>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Returns an observable of {@link RemoteData} of a {@link ResourcePolicy}, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the {@link ResourcePolicy}
   * @param href            The url of {@link ResourcePolicy} we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<ResourcePolicy>>): Observable<RemoteData<ResourcePolicy>> {
    return this.dataService.findByHref(href, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of {@link ResourcePolicy}s, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the {@link ResourcePolicy}
   * @param href            The url of the {@link ResourcePolicy} we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href: string, findListOptions: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<ResourcePolicy>>): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    return this.dataService.findAllByHref(href, findListOptions, ...linksToFollow);
  }

  /**
   * Return the defaultAccessConditions {@link ResourcePolicy} list for a given {@link Collection}
   *
   * @param collection the {@link Collection} to retrieve the defaultAccessConditions for
   * @param findListOptions the {@link FindListOptions} for the request
   */
  getDefaultAccessConditionsFor(collection: Collection, findListOptions?: FindListOptions): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    return this.dataService.findAllByHref(collection._links.defaultAccessConditions.href, findListOptions);
  }
}
