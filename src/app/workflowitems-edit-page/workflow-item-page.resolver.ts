import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { RemoteData } from '../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { WorkflowItem } from '../core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { followLink } from '../shared/utils/follow-link-config.model';

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
