import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { RemoteData } from '@dspace/core';
import { Item } from '@dspace/core';
import { SubmissionObjectResolver } from '@dspace/core';
import { WorkspaceitemDataService } from '@dspace/core';

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
