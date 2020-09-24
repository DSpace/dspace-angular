import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import {
  GroupRegistryCancelGroupAction,
  GroupRegistryEditGroupAction
} from '../../+admin/admin-access-control/group-registry/group-registry.actions';
import { GroupRegistryState } from '../../+admin/admin-access-control/group-registry/group-registry.reducers';
import { AppState } from '../../app.reducer';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { DataService } from '../data/data.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { CreateRequest, DeleteRequest, FindListOptions, FindListRequest, PostRequest } from '../data/request.models';

import { RequestService } from '../data/request.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getResponseFromEntry } from '../shared/operators';
import { EPerson } from './models/eperson.model';
import { Group } from './models/group.model';
import { dataService } from '../cache/builders/build-decorators';
import { GROUP } from './models/group.resource-type';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { Community } from '../shared/community.model';
import { Collection } from '../shared/collection.model';

const groupRegistryStateSelector = (state: AppState) => state.groupRegistry;
const editGroupSelector = createSelector(groupRegistryStateSelector, (groupRegistryState: GroupRegistryState) => groupRegistryState.editGroup);

/**
 * Provides methods to retrieve eperson group resources from the REST API & Group related CRUD actions.
 */
@Injectable({
  providedIn: 'root'
})
@dataService(GROUP)
export class GroupDataService extends DataService<Group> {
  protected linkPath = 'groups';
  protected browseEndpoint = '';
  public ePersonsEndpoint = 'epersons';
  public subgroupsEndpoint = 'subgroups';

  constructor(
    protected comparator: DSOChangeAnalyzer<Group>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected nameService: DSONameService,
  ) {
    super();
  }

  /**
   * Retrieves all groups
   * @param pagination The pagination info used to retrieve the groups
   */
  public getGroups(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Group>>): Observable<RemoteData<PaginatedList<Group>>> {
    const hrefObs = this.getFindAllHref(options, this.linkPath, ...linksToFollow);
    hrefObs.pipe(
      filter((href: string) => hasValue(href)),
      take(1))
      .subscribe((href: string) => {
        const request = new FindListRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<Group>(hrefObs) as Observable<RemoteData<PaginatedList<Group>>>;
  }

  /**
   * Returns a search result list of groups, with certain query (searches in group name and by exact uuid)
   * Endpoint used: /eperson/groups/search/byMetadata?query=<:name>
   * @param query     search query param
   * @param options
   * @param linksToFollow
   */
  public searchGroups(query: string, options?: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<Group>>): Observable<RemoteData<PaginatedList<Group>>> {
    const searchParams = [new RequestParam('query', query)];
    let findListOptions = new FindListOptions();
    if (options) {
      findListOptions = Object.assign(new FindListOptions(), options);
    }
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }
    return this.searchBy('byMetadata', findListOptions, ...linksToFollow);
  }

  /**
   * Check if the current user is member of to the indicated group
   *
   * @param groupName
   *    the group name
   * @return boolean
   *    true if user is member of the indicated group, false otherwise
   */
  isMemberOf(groupName: string): Observable<boolean> {
    const searchHref = 'isMemberOf';
    const options = new FindListOptions();
    options.searchParams = [new RequestParam('groupName', groupName)];

    return this.searchBy(searchHref, options).pipe(
      filter((groups: RemoteData<PaginatedList<Group>>) => !groups.isResponsePending),
      take(1),
      map((groups: RemoteData<PaginatedList<Group>>) => groups.payload.totalElements > 0)
    );
  }

  /**
   * Method to delete a group
   * @param id The group id to delete
   */
  public deleteGroup(group: Group): Observable<boolean> {
    return this.delete(group.id).pipe(map((response: RestResponse) => response.isSuccessful));
  }

  /**
   * Create or Update a group
   *  If the group contains an id, it is assumed the eperson already exists and is updated instead
   * @param group    The group to create or update
   */
  public createOrUpdateGroup(group: Group): Observable<RemoteData<Group>> {
    const isUpdate = hasValue(group.id);
    if (isUpdate) {
      return this.updateGroup(group);
    } else {
      return this.create(group, null);
    }
  }

  /**
   * // TODO
   * @param {DSpaceObject} ePerson The given object
   */
  updateGroup(group: Group): Observable<RemoteData<Group>> {
    // TODO
    return null;
  }

  /**
   * Adds given subgroup as a subgroup to the given active group
   * @param activeGroup   Group we want to add subgroup to
   * @param subgroup      Group we want to add as subgroup to activeGroup
   */
  addSubGroupToGroup(activeGroup: Group, subgroup: Group): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    const postRequest = new PostRequest(requestId, activeGroup.self + '/' + this.subgroupsEndpoint, subgroup.self, options);
    this.requestService.configure(postRequest);

    return this.fetchResponse(requestId);
  }

  /**
   * Deletes a given subgroup from the subgroups of the given active group
   * @param activeGroup   Group we want to delete subgroup from
   * @param subgroup      Subgroup we want to delete from activeGroup
   */
  deleteSubGroupFromGroup(activeGroup: Group, subgroup: Group): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const deleteRequest = new DeleteRequest(requestId, activeGroup.self + '/' + this.subgroupsEndpoint + '/' + subgroup.id);
    this.requestService.configure(deleteRequest);

    return this.fetchResponse(requestId);
  }

  /**
   * Adds given ePerson as member to given group
   * @param activeGroup   Group we want to add member to
   * @param ePerson       EPerson we want to add as member to given activeGroup
   */
  addMemberToGroup(activeGroup: Group, ePerson: EPerson): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    const postRequest = new PostRequest(requestId, activeGroup.self + '/' + this.ePersonsEndpoint, ePerson.self, options);
    this.requestService.configure(postRequest);

    return this.fetchResponse(requestId);
  }

  /**
   * Deletes a given ePerson from the members of the given active group
   * @param activeGroup   Group we want to delete member from
   * @param ePerson       EPerson we want to delete from members of given activeGroup
   */
  deleteMemberFromGroup(activeGroup: Group, ePerson: EPerson): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const deleteRequest = new DeleteRequest(requestId, activeGroup.self + '/' + this.ePersonsEndpoint + '/' + ePerson.id);
    this.requestService.configure(deleteRequest);

    return this.fetchResponse(requestId);
  }

  /**
   * Gets the restResponse from the requestService
   * @param requestId
   */
  protected fetchResponse(requestId: string): Observable<RestResponse> {
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        return response;
      })
    );
  }

  /**
   * Method to retrieve the group that is currently being edited
   */
  public getActiveGroup(): Observable<Group> {
    return this.store.pipe(select(editGroupSelector))
  }

  /**
   * Method to cancel editing a group, dispatches a cancel group action
   */
  public cancelEditGroup() {
    this.store.dispatch(new GroupRegistryCancelGroupAction());
  }

  /**
   * Method to set the group being edited, dispatches an edit group action
   * @param group The group to edit
   */
  public editGroup(group: Group) {
    this.store.dispatch(new GroupRegistryEditGroupAction(group));
  }

  /**
   * Method that clears a cached groups request
   */
  public clearGroupsRequests(): void {
    this.getBrowseEndpoint().pipe(take(1)).subscribe((link: string) => {
      this.requestService.removeByHrefSubstring(link);
    });
  }

  /**
   * Method that clears a cached get subgroups of certain group request
   */
  public clearGroupLinkRequests(href: string): void {
    this.requestService.removeByHrefSubstring(href);
  }

  public getGroupRegistryRouterLink(): string {
    return '/admin/access-control/groups';
  }

  /**
   * Change which group is being edited and return the link for the edit page of the new group being edited
   * @param newGroup New group to edit
   */
  public startEditingNewGroup(newGroup: Group): string {
    this.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (newGroup === activeGroup) {
        this.cancelEditGroup()
      } else {
        this.editGroup(newGroup)
      }
    });
    return this.getGroupEditPageRouterLinkWithID(newGroup.id)
  }

  /**
   * Get Edit page of group
   * @param group Group we want edit page for
   */
  public getGroupEditPageRouterLink(group: Group): string {
    return this.getGroupEditPageRouterLinkWithID(group.id);
  }

  /**
   * Get Edit page of group
   * @param groupID Group ID we want edit page for
   */
  public getGroupEditPageRouterLinkWithID(groupId: string): string {
    return '/admin/access-control/groups/' + groupId;
  }

  /**
   * Extract optional UUID from a string
   * @param stringWithUUID  String with possible UUID
   */
  public getUUIDFromString(stringWithUUID: string): string {
    let foundUUID = '';
    const uuidMatches = stringWithUUID.match(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g);
    if (uuidMatches != null) {
      foundUUID = uuidMatches[0];
    }
    return foundUUID;
  }

  /**
   * Create a group for a given role for a given community or collection.
   *
   * @param dso         The community or collection for which to create a group
   * @param role        The name of the role for which to create a group
   * @param link        The REST endpoint to create the group
   */
  createComcolGroup(dso: Community|Collection, role: string, link: string): Observable<RestResponse> {

    const requestId = this.requestService.generateRequestId();
    const group = Object.assign(new Group(), {
      metadata: {
        'dc.description': [
          {
            value: `${this.nameService.getName(dso)} ${role} group`,
          }
        ],
      },
    });

    this.requestService.configure(
      new CreateRequest(
        requestId,
        link,
        JSON.stringify(group),
      ));

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      tap(() => this.requestService.removeByHrefSubstring(link)),
    );
  }

  /**
   * Delete the group for a given role for a given community or collection.
   *
   * @param link        The REST endpoint to delete the group
   */
  deleteComcolGroup(link: string): Observable<RestResponse> {

    const requestId = this.requestService.generateRequestId();

    this.requestService.configure(
      new DeleteRequest(
        requestId,
        link,
      ));

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      tap(() => this.requestService.removeByHrefSubstring(link)),
    );
  }
}
