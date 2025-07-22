import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { RemoteData } from '@core/data/remote-data';
import { Item } from '@core/shared/item.model';
import { SubmissionObjectResolver } from '@core/submission/resolver/submission-object.resolver';
import { WorkspaceitemDataService } from '@core/submission/workspaceitem-data.service';
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
