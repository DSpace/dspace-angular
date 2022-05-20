/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';

import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { Collection } from '../shared/collection.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResourcePolicy } from './models/resource-policy.model';
import { RemoteData } from '../data/remote-data';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RESOURCE_POLICY } from './models/resource-policy.resource-type';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list.model';
import { ActionType } from './models/action-type.model';
import { RequestParam } from '../cache/models/request-param.model';
import { isNotEmpty } from '../../shared/empty.util';
import { map, take } from 'rxjs/operators';
import { NoContent } from '../shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { CoreState } from '../core-state.model';
import { FindListOptions } from '../data/find-list-options.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { PutRequest } from '../data/request.models';
import { GenericConstructor } from '../shared/generic-constructor';
import { ResponseParsingService } from '../data/parsing.service';
import { StatusCodeOnlyResponseParsingService } from '../data/status-code-only-response-parsing.service';
import { HALLink } from '../shared/hal-link.model';
import { EPersonDataService } from '../eperson/eperson-data.service';
import { GroupDataService } from '../eperson/group-data.service';


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
    protected comparator: ChangeAnalyzer<ResourcePolicy>,
  ) {
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
    protected comparator: DefaultChangeAnalyzer<ResourcePolicy>,
    protected ePersonService: EPersonDataService,
    protected groupService: GroupDataService,
  ) {
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
    return this.dataService.delete(resourcePolicyID).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<NoContent>) => response.hasSucceeded)
    );
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
   * @param href                        The url of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ResourcePolicy>[]): Observable<RemoteData<ResourcePolicy>> {
    return this.dataService.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of a {@link ResourcePolicy}, based on its ID, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param id                          ID of {@link ResourcePolicy} we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ResourcePolicy>[]): Observable<RemoteData<ResourcePolicy>> {
    return this.dataService.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
   * @param UUID                        UUID of a given {@link EPerson}
   * @param resourceUUID                Limit the returned policies to the specified DSO
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  searchByEPerson(UUID: string, resourceUUID?: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ResourcePolicy>[]): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', UUID)];
    if (isNotEmpty(resourceUUID)) {
      options.searchParams.push(new RequestParam('resource', resourceUUID));
    }
    return this.dataService.searchBy(this.searchByEPersonMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Return the {@link ResourcePolicy} list for a {@link Group}
   *
   * @param UUID                        UUID of a given {@link Group}
   * @param resourceUUID                Limit the returned policies to the specified DSO
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  searchByGroup(UUID: string, resourceUUID?: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ResourcePolicy>[]): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', UUID)];
    if (isNotEmpty(resourceUUID)) {
      options.searchParams.push(new RequestParam('resource', resourceUUID));
    }
    return this.dataService.searchBy(this.searchByGroupMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Return the {@link ResourcePolicy} list for a given DSO
   *
   * @param UUID              UUID of a given DSO
   * @param action            Limit the returned policies to the specified {@link ActionType}
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  searchByResource(UUID: string, action?: ActionType, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ResourcePolicy>[]): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('uuid', UUID)];
    if (isNotEmpty(action)) {
      options.searchParams.push(new RequestParam('action', action));
    }
    return this.dataService.searchBy(this.searchByResourceMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Update the target of the resource policy
   * @param resourcePolicyId the ID of the resource policy
   * @param resourcePolicyHref the link to the resource policy
   * @param targetUUID the UUID of the target to which the permission is being granted
   * @param targetType the type of the target (eperson or group) to which the permission is being granted
   */
  updateTarget(resourcePolicyId: string, resourcePolicyHref: string, targetUUID: string, targetType: string): Observable<RemoteData<any>> {

    const targetService = targetType === 'eperson' ? this.ePersonService : this.groupService;

    const targetEndpoint$ = targetService.getBrowseEndpoint().pipe(
      take(1),
      map((endpoint: string) =>`${endpoint}/${targetUUID}`),
    );

    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();

    this.requestService.setStaleByHrefSubstring(`${this.dataService.getLinkPath()}/${resourcePolicyId}/${targetType}`);

    targetEndpoint$.subscribe((targetEndpoint) => {
      const resourceEndpoint = resourcePolicyHref + '/' + targetType;
      const request = new PutRequest(requestId, resourceEndpoint, targetEndpoint, options);
      Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return StatusCodeOnlyResponseParsingService;
        }
      });
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);

  }

}
