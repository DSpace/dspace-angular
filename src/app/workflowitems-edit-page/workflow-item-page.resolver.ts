import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { SUBMISSION_LINKS_TO_FOLLOW } from '@dspace/core/submission/resolver/submission-links-to-follow';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { Observable } from 'rxjs';

export const workflowItemPageResolver: ResolveFn<RemoteData<WorkflowItem>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workflowItemService: WorkflowItemDataService = inject(WorkflowItemDataService),
): Observable<RemoteData<WorkflowItem>> => {
  return workflowItemService.findById(
    route.params.id,
    true,
    false,
    ...SUBMISSION_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
