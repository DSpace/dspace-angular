import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders claimed task object for the mydspace result in the list view.
 */
@Component({
  selector: 'ds-claimed-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './claimed-my-dspace-result-list-element.component.html',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, SetViewMode.List)
@renderElementsFor(ClaimedTask, SetViewMode.List)
export class ClaimedMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {

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
