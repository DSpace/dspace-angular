import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { SubmissionObjectResolver } from '../core/submission/resolver/submission-object.resolver';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';

export const itemFromWorkflowResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  workflowItemService: WorkflowItemDataService = inject(WorkflowItemDataService),
): Observable<RemoteData<Item>> => {
  return SubmissionObjectResolver(route, state, workflowItemService);
};

