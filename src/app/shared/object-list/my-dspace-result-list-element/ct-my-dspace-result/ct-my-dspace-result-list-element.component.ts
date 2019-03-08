import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';

@Component({
  selector: 'ds-claimtask-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './ct-my-dspace-result-list-element.component.html',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, ViewMode.List)
@renderElementsFor(ClaimedTask, ViewMode.List)
export class ClaimedTaskMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {
  public showSubmitter = true;
  public status = MyDspaceItemStatusType.VALIDATION;
  public workFlow: Workflowitem;

  ngOnInit() {
    this.initWorkflowItem(this.dso.workflowitem as Observable<RemoteData<Workflowitem>>);
  }

  initWorkflowItem(wfi$: Observable<RemoteData<Workflowitem>>) {
    wfi$.pipe(
      find((rd: RemoteData<Workflowitem>) => (rd.hasSucceeded && isNotUndefined(rd.payload)))
    ).subscribe((rd: RemoteData<Workflowitem>) => {
      this.workFlow = rd.payload;
    });
  }
}
