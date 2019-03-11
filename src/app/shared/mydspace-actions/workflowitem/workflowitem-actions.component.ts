import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { WorkflowitemDataService } from '../../../core/submission/workflowitem-data.service';

@Component({
  selector: 'ds-workflowitem-actions',
  styleUrls: ['./workflowitem-actions.component.scss'],
  templateUrl: './workflowitem-actions.component.html',
})

export class WorkflowitemActionsComponent extends MyDSpaceActionsComponent<Workflowitem, WorkflowitemDataService> {
  @Input() object: Workflowitem;

  constructor(protected injector: Injector,
              protected router: Router) {
    super(ResourceType.Workflowitem, injector, router);
  }

  initObjects(object: Workflowitem) {
    this.object = object;
  }

}
