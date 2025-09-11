import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  RemoteData,
  getFirstCompletedRemoteData,
  WorkflowItem,
  SUBMISSION_LINKS_TO_FOLLOW,
  WorkflowItemDataService,
} from '@dspace/core'
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
