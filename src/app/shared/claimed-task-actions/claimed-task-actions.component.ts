import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ClaimedTask } from '../../core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../../core/tasks/models/process-task-response';

@Component({
  selector: 'ds-claimed-task-actions',
  styleUrls: ['./claimed-task-actions.component.scss'],
  templateUrl: './claimed-task-actions.component.html',
})

export class ClaimedTaskActionsComponent implements OnInit {
  @Input() task: ClaimedTask;
  @Input() workflowitem: Workflowitem;

  public processingApprove = false;
  public processingReject = false;
  public processingReturnToPool = false;
  public rejectForm: FormGroup;

  constructor(
    private cd: ChangeDetectorRef,
    private ctDataService: ClaimedTaskDataService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });
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
          this.reload();
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
