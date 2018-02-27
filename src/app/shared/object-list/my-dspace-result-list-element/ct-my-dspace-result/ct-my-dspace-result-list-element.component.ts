import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
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
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';

@Component({
  selector: 'ds-claimtask-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './ct-my-dspace-result-list-element.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, ViewMode.List)
@renderElementsFor(ClaimedTask, ViewMode.List)
export class ClaimedTaskMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {
  public workFlow: Workflowitem;
  public processingApprove = false;
  public processingReject = false;
  public processingReturnToPool = false;
  public rejectForm: FormGroup;
  // public submitter: Eperson;
  // public user: Eperson;

  constructor(// private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private ctDataService: ClaimedTaskDataService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
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

  approve() {
    this.processingApprove = true;
    this.ctDataService.approveTask(this.dso.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingApprove = false;
        this.cd.detectChanges();
        if (res.hasSucceeded) {
          this.reload();
        }
      });
  }

  reject() {
    this.processingReject = true;
    const reason = this.rejectForm.get('reason').value;
    this.ctDataService.rejectTask(reason, this.dso.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingReject = false;
        this.cd.detectChanges();
        if (res.hasSucceeded) {
          this.reload();
        }
      });
  }

  returnToPool() {
    this.processingReturnToPool = true;
    this.ctDataService.returnToPoolTask(this.dso.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingReturnToPool = false;
        this.cd.detectChanges();
        if (res.hasSucceeded) {
          this.reload();
        }
      });
  }

  openRejectModal(content) {
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  reload() {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigated = false;
    this.router.navigate([this.router.url]);
  }

}
