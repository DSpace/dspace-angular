import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ClaimedTask } from '../../core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../../core/tasks/models/process-task-response';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-claimed-task-actions',
  styleUrls: ['./claimed-task-actions.component.scss'],
  templateUrl: './claimed-task-actions.component.html',
})

export class ClaimedTaskActionsComponent implements OnInit {
  @Input() task: ClaimedTask;

  public processingApprove = false;
  public processingReject = false;
  public processingReturnToPool = false;
  public rejectForm: FormGroup;
  public workflowitemObs: Observable<RemoteData<Workflowitem[]>>;
  public modalRef: NgbModalRef;

  constructor(private cd: ChangeDetectorRef,
              private ctDataService: ClaimedTaskDataService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });
    this.workflowitemObs = this.task.workflowitem as Observable<RemoteData<Workflowitem[]>>;
  }

  approve() {
    this.processingApprove = true;
    this.ctDataService.approveTask(this.task.id)
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
    this.ctDataService.rejectTask(reason, this.task.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingReject = false;
        this.cd.detectChanges();
        if (res.hasSucceeded) {
          this.modalRef.close('Send Button');
          this.reload();
          console.log('');
        }
      });
  }

  returnToPool() {
    this.processingReturnToPool = true;
    this.ctDataService.returnToPoolTask(this.task.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingReturnToPool = false;
        this.cd.detectChanges();
        if (res.hasSucceeded) {
          this.reload();
        }
      });
  }

  openRejectModal(rejectModal) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(rejectModal);
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
