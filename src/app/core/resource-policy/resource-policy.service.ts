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
import { ResourcePolicy } from './models/resource-policy.model';
import { RemoteData } from '../data/remote-data';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RESOURCE_POLICY } from './models/resource-policy.resource-type';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { ActionType } from './models/action-type.model';
import { RequestParam } from '../cache/models/request-param.model';
import { isNotEmpty } from '../../shared/empty.util';
import { map } from 'rxjs/operators';
import { RestResponse } from '../cache/response.models';

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
  protected searchByEPersonMethod = 'eperson';
  protected searchByGroupMethod = 'group';
  protected searchByResourceMethod = 'resource';

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
   * Create a new ResourcePolicy on the server, and store the response
   * in the object cache
   *
   * @param {ResourcePolicy} resourcePolicy
   *    The resource policy to create
   * @param {string} resourceUUID
   *    The uuid of the resource target of the policy
   * @param {string} epersonUUID
   *    The uuid of the eperson that will be grant of the permission. Exactly one of eperson or group is required
   * @param {string} groupUUID
   *    The uuid of the group that will be grant of the permission. Exactly one of eperson or group is required
   */
  create(resourcePolicy: ResourcePolicy, resourceUUID: string, epersonUUID?: string, groupUUID?: string): Observable<RemoteData<ResourcePolicy>> {
    const params = [];
    params.push(new RequestParam('resource', resourceUUID));
    if (isNotEmpty(epersonUUID)) {
      params.push(new RequestParam('eperson', epersonUUID));
    } else if (isNotEmpty(groupUUID)) {
      params.push(new RequestParam('group', groupUUID));
    }
    return this.dataService.create(resourcePolicy, ...params);
  }

  /**
   * Delete an existing ResourcePolicy on the server
   *
   * @param resourcePolicyID The resource policy's id to be removed
   * @return an observable that emits true when the deletion was successful, false when it failed
   */
  delete(resourcePolicyID: string): Observable<boolean> {
    return this.dataService.delete(resourcePolicyID).pipe(map((response: RestResponse) => response.isSuccessful));
  }

  /**
   * Add a new patch to the object cache
   * The patch is derived from the differences between the given object and its version in the object cache
   * @param {ResourcePolicy} object The given object
   */
  update(object: ResourcePolicy): Observable<RemoteData<ResourcePolicy>> {
    return this.dataService.update(object);
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
   * Returns an observable of {@link RemoteData} of a {@link ResourcePolicy}, based on its ID, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param id              ID of {@link ResourcePolicy} we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findById(id: string, ...linksToFollow: Array<FollowLinkConfig<ResourcePolicy>>): Observable<RemoteData<ResourcePolicy>> {
    return this.dataService.findById(id, ...linksToFollow);
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

  /**
   * Return the {@link ResourcePolicy} list for a {@link EPerson}
   *
   * @param UUID           UUID of a given {@link EPerson}
   * @param resourceUUID   Limit the returned policies to the specified DSO
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  searchByEPerson(UUID: string, resourceUUID?: string, ...linksToFollow: Array<FollowLinkConfig<ResourcePolicy>>): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', UUID)];
    if (isNotEmpty(resourceUUID)) {
      options.searchParams.push(new RequestParam('resource', resourceUUID))
    }
    return this.dataService.searchBy(this.searchByEPersonMethod, options, ...linksToFollow)
  }

  /**
   * Return the {@link ResourcePolicy} list for a {@link Group}
   *
   * @param UUID           UUID of a given {@link Group}
   * @param resourceUUID   Limit the returned policies to the specified DSO
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  searchByGroup(UUID: string, resourceUUID?: string, ...linksToFollow: Array<FollowLinkConfig<ResourcePolicy>>): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', UUID)];
    if (isNotEmpty(resourceUUID)) {
      options.searchParams.push(new RequestParam('resource', resourceUUID))
    }
    return this.dataService.searchBy(this.searchByGroupMethod, options, ...linksToFollow)
  }

  /**
   * Return the {@link ResourcePolicy} list for a given DSO
   *
   * @param UUID           UUID of a given DSO
   * @param action         Limit the returned policies to the specified {@link ActionType}
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  searchByResource(UUID: string, action?: ActionType, ...linksToFollow: Array<FollowLinkConfig<ResourcePolicy>>): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', UUID)];
    if (isNotEmpty(action)) {
      options.searchParams.push(new RequestParam('action', action))
    }
    return this.dataService.searchBy(this.searchByResourceMethod, options, ...linksToFollow)
  }

}
