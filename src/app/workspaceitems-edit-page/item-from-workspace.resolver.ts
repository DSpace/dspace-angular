import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Item } from '../core/shared/item.model';
import { SubmissionObjectResolver } from '../core/submission/resolver/submission-object.resolver';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable({ providedIn: 'root' })
export class ItemFromWorkspaceResolver extends SubmissionObjectResolver<Item>   {
  constructor(
        private workspaceItemService: WorkspaceitemDataService,
        protected store: Store<any>,
  ) {
    super(workspaceItemService, store);
  }

}
