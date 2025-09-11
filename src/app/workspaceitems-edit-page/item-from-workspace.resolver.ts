import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RemoteData, Item, SubmissionObjectResolver, WorkspaceitemDataService } from '@dspace/core'
import { Observable } from 'rxjs';

/**
 * This method represents a resolver that requests a specific item before the route is activated
 */
export const itemFromWorkspaceResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workspaceItemService: WorkspaceitemDataService = inject(WorkspaceitemDataService),
): Observable<RemoteData<Item>> => {
  return SubmissionObjectResolver(route, state, workspaceItemService);
};
