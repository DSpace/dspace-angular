import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Item } from '@dspace/core/shared/item.model';
import { SubmissionObjectResolver } from '@dspace/core/submission/resolver/submission-object.resolver';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { Observable } from 'rxjs';

export const itemFromWorkflowResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workflowItemService: WorkflowItemDataService = inject(WorkflowItemDataService),
): Observable<RemoteData<Item>> => {
  return SubmissionObjectResolver(route, state, workflowItemService);
};

