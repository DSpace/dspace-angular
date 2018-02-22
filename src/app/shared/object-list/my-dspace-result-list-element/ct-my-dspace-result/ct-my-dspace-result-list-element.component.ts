import { Component, Inject } from '@angular/core';
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
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ds-claimtask-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './ct-my-dspace-result-list-element.component.html',
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, ViewMode.List)
@renderElementsFor(ClaimedTask, ViewMode.List)
export class ClaimedTaskMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {
  public workFlow: Workflowitem;
  public rejectForm: FormGroup;
  // public submitter: Eperson;
  // public user: Eperson;

  constructor(// private store: Store<AppState>,
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

    // (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
    //   .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
    //   .first()
    //   .subscribe((rd: RemoteData<any>) => {
    //     // console.log(rd);
    //     this.submitter = rd.payload[0];
    //   });
    //
    // this.store.select(getAuthenticatedUser)
    //   .filter((user: Eperson) => isNotEmpty(user))
    //   .take(1)
    //   .subscribe((user: Eperson) => {
    //     this.user = user;
    //   });

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
    const body = {
      submit_approve: true
    };
    this.ctDataService.approveTask(body, this.dso.id).subscribe((res) => {
      console.log('Approve Task response:');
      console.log(res);
    });
  }

  reject() {
    const body = {
      submit_reject: true,
      reason: this.rejectForm.get('reason').value
    };
    this.ctDataService.rejectTask(body, this.dso.id).subscribe((res) => {
      console.log('Reject Task response:');
      console.log(res);
    });
  }

  returnToPool() {
    this.ctDataService.returnToPoolTask('', this.dso.id).subscribe((res) => {
      console.log('ReturnToPool Task response:');
      console.log(res);
    });
  }

  openRejectModal(content) {
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }

}
