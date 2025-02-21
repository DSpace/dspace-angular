import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '../../../modules/core/src/lib/core/data/follow-link-config.model';
import { RemoteData } from '../../../modules/core/src/lib/core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../modules/core/src/lib/core/shared/operators';
import { WorkflowItem } from '../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../../../modules/core/src/lib/core/submission/workflowitem-data.service';

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
