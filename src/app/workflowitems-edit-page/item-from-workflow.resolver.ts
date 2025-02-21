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
import { WorkflowItemDataService } from '@dspace/core';

export const itemFromWorkflowResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workflowItemService: WorkflowItemDataService = inject(WorkflowItemDataService),
): Observable<RemoteData<Item>> => {
  return SubmissionObjectResolver(route, state, workflowItemService);
};

