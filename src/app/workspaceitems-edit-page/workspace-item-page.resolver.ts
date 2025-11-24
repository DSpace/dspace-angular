import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { followLink } from '../shared/utils/follow-link-config.model';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { WorkspaceItem } from '../core/submission/models/workspaceitem.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';

/**
 * This class represents a resolver that requests a specific workflow item before the route is activated
 */
@Injectable()
export class WorkspaceItemPageResolver implements Resolve<RemoteData<WorkspaceItem>> {
  constructor(private workspaceItemService: WorkspaceitemDataService) {
  }

  /**
   * Method for resolving a workflow item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found workflow item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<WorkspaceItem>> {
    return this.workspaceItemService.findById(route.params.id,
      true,
      false,
      followLink('item'),
      followLink('collection'),
    ).pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
