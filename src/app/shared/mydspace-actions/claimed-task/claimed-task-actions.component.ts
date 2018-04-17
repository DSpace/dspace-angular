import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationOptions } from '../../notifications/models/notification-options.model';
import { hasNoUndefinedValue } from '../../empty.util';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { RemoteData } from '../../../core/data/remote-data';
import { NormalizedClaimedTask } from '../../../core/tasks/models/normalized-claimed-task-object.model';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';

@Component({
  selector: 'ds-claimed-task-actions',
  styleUrls: ['./claimed-task-actions.component.scss'],
  templateUrl: './claimed-task-actions.component.html',
})

export class ClaimedTaskActionsComponent extends MyDSpaceActionsComponent<ClaimedTask, NormalizedClaimedTask, ClaimedTaskDataService> implements OnInit {
  @Input() object: ClaimedTask;

  public workflowitemObs: Observable<Workflowitem>;

  public processingApprove = false;
  public processingReject = false;
  public processingReturnToPool = false;
  public rejectForm: FormGroup;
  public modalRef: NgbModalRef;

  constructor(protected injector: Injector,
              protected router: Router,
              private cd: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {
    super(ResourceType.ClaimedTask, injector, router)
  }

  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });

    this.initObjects(this.object);
  }

  initObjects(object: ClaimedTask) {
    this.object = object;
    this.workflowitemObs = (this.object.workflowitem as Observable<RemoteData<Workflowitem[]>>)
      .filter((rd: RemoteData<Workflowitem[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .map((rd: RemoteData<Workflowitem[]>) => (rd.payload[0] as Workflowitem));
  }

  approve() {
    this.processingApprove = true;
    this.objectDataService.approveTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  reject() {
    this.processingReject = true;
    this.modalRef.close('Send Button');
    const reason = this.rejectForm.get('reason').value;
    this.objectDataService.rejectTask(reason, this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  returnToPool() {
    this.processingReturnToPool = true;
    this.objectDataService.returnToPoolTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  private responseHandle(res: ProcessTaskResponse) {
    this.processingApprove = false;
    this.processingReject = false;
    this.processingReturnToPool = false;
    this.cd.detectChanges();
    if (res.hasSucceeded) {
      this.reload();
      this.notificationsService.success(null,
        this.translate.get('submission.workflow.tasks.generic.success'),
        new NotificationOptions(5000, false));
    } else {
      this.notificationsService.error(null,
        this.translate.get('submission.workflow.tasks.generic.error'),
        new NotificationOptions(20000, true));
    }
  }

  openRejectModal(rejectModal) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(rejectModal);
  }

}
