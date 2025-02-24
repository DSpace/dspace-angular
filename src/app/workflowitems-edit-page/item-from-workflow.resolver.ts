import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Item,
  RemoteData,
  SubmissionObjectResolver,
  WorkflowItemDataService,
} from '@dspace/core';
import { Observable } from 'rxjs';

export const itemFromWorkflowResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workflowItemService: WorkflowItemDataService = inject(WorkflowItemDataService),
): Observable<RemoteData<Item>> => {
  return SubmissionObjectResolver(route, state, workflowItemService);
};

