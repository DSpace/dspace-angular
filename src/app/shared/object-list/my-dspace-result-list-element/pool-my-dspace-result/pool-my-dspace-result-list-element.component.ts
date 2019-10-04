import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';

/**
 * This component renders pool task object for the mydspace result in the list view.
 */
@Component({
  selector: 'ds-pool-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './pool-my-dspace-result-list-element.component.html',
})

@listableObjectComponent(PoolTaskMyDSpaceResult.name, ViewMode.ListElement)
@listableObjectComponent(PoolTask.name, ViewMode.ListElement)
export class PoolMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<PoolTaskMyDSpaceResult, PoolTask> implements OnInit {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WAITING_CONTROLLER;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem: WorkflowItem;

  constructor(@Inject('indexElementProvider') public index: number) {
    super(index);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.initWorkflowItem(this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>);
  }

  /**
   * Retrieve workflowitem from result object
   */
  initWorkflowItem(wfi$: Observable<RemoteData<WorkflowItem>>) {
    wfi$.pipe(
      find((rd: RemoteData<WorkflowItem>) => (rd.hasSucceeded && isNotUndefined(rd.payload)))
    ).subscribe((rd: RemoteData<WorkflowItem>) => {
      this.workflowitem = rd.payload;
    });
  }
}
