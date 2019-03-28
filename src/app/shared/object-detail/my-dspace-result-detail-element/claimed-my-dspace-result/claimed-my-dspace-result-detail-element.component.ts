import { Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { RemoteData } from '../../../../core/data/remote-data';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { isNotUndefined } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';

@Component({
  selector: 'ds-claimed-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss'],
  templateUrl: './claimed-my-dspace-result-detail-element.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, ViewMode.Detail)
@renderElementsFor(ClaimedTask, ViewMode.Detail)
export class ClaimedMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {
  public status = MyDspaceItemStatusType.VALIDATION;
  public workFlow: Workflowitem;
  public rejectForm: FormGroup;

  constructor(private ctDataService: ClaimedTaskDataService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);

    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });
  }

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
