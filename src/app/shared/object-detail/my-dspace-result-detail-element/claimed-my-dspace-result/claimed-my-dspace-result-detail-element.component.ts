import { Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { RemoteData } from '../../../../core/data/remote-data';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { isNotUndefined } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders claimed task object for the mydspace result in the detail view.
 */
@Component({
  selector: 'ds-claimed-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss'],
  templateUrl: './claimed-my-dspace-result-detail-element.component.html'
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, SetViewMode.Detail)
@renderElementsFor(ClaimedTask, SetViewMode.Detail)
export class ClaimedMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.VALIDATION;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem: WorkflowItem;

  constructor(@Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
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
