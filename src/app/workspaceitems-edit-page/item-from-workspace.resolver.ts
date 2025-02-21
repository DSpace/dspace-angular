import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { RemoteData } from '../../../modules/core/src/lib/core/data/remote-data';
import { Item } from '../../../modules/core/src/lib/core/shared/item.model';
import { SubmissionObjectResolver } from '../../../modules/core/src/lib/core/submission/resolver/submission-object.resolver';
import { WorkspaceitemDataService } from '../../../modules/core/src/lib/core/submission/workspaceitem-data.service';

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
