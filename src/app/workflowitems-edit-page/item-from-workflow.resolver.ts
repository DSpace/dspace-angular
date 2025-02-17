import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { SubmissionObjectResolver } from '../core/submission/resolver/submission-object.resolver';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class ItemFromWorkflowResolver extends SubmissionObjectResolver<Item> implements Resolve<RemoteData<Item>> {

  constructor(
    protected dataService: WorkflowItemDataService,
  ) {
    super(dataService);
  }

}
