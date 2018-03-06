import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';

@Component({
  selector: 'ds-claimtask-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss'],
  templateUrl: './ct-my-dspace-result-detail-element.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, ViewMode.Detail)
@renderElementsFor(ClaimedTask, ViewMode.Detail)
export class ClaimedTaskMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {
  public workFlow: Workflowitem;
  public rejectForm: FormGroup;
  // public submitter: Eperson;
  // public user: Eperson;

  constructor(
    private ctDataService: ClaimedTaskDataService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);

    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.initItem(this.dso.workflowitem as Observable<RemoteData<Workflowitem[]>>);
  }

  initItem(wfiObs: Observable<RemoteData<Workflowitem[]>>) {
    wfiObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.workFlow = rd.payload[0];
      });
  }

}
