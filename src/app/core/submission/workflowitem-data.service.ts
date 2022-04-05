import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { WorkflowItem } from './models/workflowitem.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DeleteByIDRequest } from '../data/request.models';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { RemoteData } from '../data/remote-data';
import { NoContent } from '../shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { WorkspaceItem } from './models/workspaceitem.model';
import { RequestParam } from '../cache/models/request-param.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from '../data/find-list-options.model';

/**
 * A service that provides methods to make REST requests with workflow items endpoint.
 */
@Injectable()
@dataService(WorkflowItem.type)
export class WorkflowItemDataService extends DataService<WorkflowItem> {
  protected linkPath = 'workflowitems';
  protected searchByItemLinkPath = 'item';
  protected responseMsToLive = 10 * 1000;

  constructor(
    protected comparator: DSOChangeAnalyzer<WorkflowItem>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected store: Store<CoreState>) {
    super();
  }

  /**
   * Delete an existing Workflow Item on the server
   * @param id The Workflow Item's id to be removed
   * @return an observable that emits true when the deletion was successful, false when it failed
   */
  delete(id: string): Observable<RemoteData<NoContent>> {
    return this.deleteWFI(id, true);
  }

  /**
   * Send an existing Workflow Item back to the workflow on the server
   * @param id The Workspace Item's id to be sent back
   * @return an observable that emits true when sending back the item was successful, false when it failed
   */
  sendBack(id: string): Observable<boolean> {
    return this.deleteWFI(id, false).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<NoContent>) => response.hasSucceeded)
    );
  }

  /**
   * Method to delete a workflow item from the server
   * @param id The identifier of the server
   * @param expunge Whether or not to expunge:
   * When true, the workflow item and its item will be permanently expunged on the server
   * When false, the workflow item will be removed, but the item will still be available as a workspace item
   */
  private deleteWFI(id: string, expunge: boolean): Observable<RemoteData<NoContent>> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, id)),
      map((endpoint: string) => endpoint + '?expunge=' + expunge)
    );

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
    ).subscribe((href: string) => {
      const request = new DeleteByIDRequest(requestId, href, id);
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Return the WorkflowItem object found through the UUID of an item
   *
   * @param uuid           The uuid of the item
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param options        The {@link FindListOptions} object
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public findByItem(uuid: string, useCachedVersionIfAvailable = false, reRequestOnStale = true, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<WorkspaceItem>[]): Observable<RemoteData<WorkspaceItem>> {
    const findListOptions = new FindListOptions();
    findListOptions.searchParams = [new RequestParam('uuid', encodeURIComponent(uuid))];
    const href$ = this.getSearchByHref(this.searchByItemLinkPath, findListOptions, ...linksToFollow);
    return this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

}
