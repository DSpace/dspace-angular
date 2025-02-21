import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { WorkflowItemDataService } from '@dspace/core';

export const workflowItemPageResolver: ResolveFn<RemoteData<WorkflowItem>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workflowItemService: WorkflowItemDataService = inject(WorkflowItemDataService),
): Observable<RemoteData<WorkflowItem>> => {
  return workflowItemService.findById(
    route.params.id,
    true,
    false,
    followLink('item'),
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
