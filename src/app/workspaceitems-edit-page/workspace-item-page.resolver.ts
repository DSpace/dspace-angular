import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { RemoteData } from '../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { WorkspaceItem } from '../core/submission/models/workspaceitem.model';
import { SUBMISSION_LINKS_TO_FOLLOW } from '../core/submission/resolver/submission-links-to-follow';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';

/**
 * Method for resolving a workflow item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {WorkspaceitemDataService} workspaceItemService
 * @returns Observable<<RemoteData<Item>> Emits the found workflow item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const workspaceItemPageResolver: ResolveFn<RemoteData<WorkspaceItem>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workspaceItemService: WorkspaceitemDataService = inject(WorkspaceitemDataService),
): Observable<RemoteData<WorkspaceItem>> => {
  return workspaceItemService.findById(route.params.id,
    true,
    false,
    ...SUBMISSION_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
