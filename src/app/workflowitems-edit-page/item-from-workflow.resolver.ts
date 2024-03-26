import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Item } from '../core/shared/item.model';
import { SubmissionObjectResolver } from '../core/submission/resolver/submission-object.resolver';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable({ providedIn: 'root' })
export class ItemFromWorkflowResolver extends SubmissionObjectResolver<Item>   {
  constructor(
    private workflowItemService: WorkflowItemDataService,
    protected store: Store<any>,
  ) {
    super(workflowItemService, store);
  }

}
