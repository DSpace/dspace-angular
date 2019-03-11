import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationOptions } from '../../notifications/models/notification-options.model';
import { isNotUndefined } from '../../empty.util';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { RemoteData } from '../../../core/data/remote-data';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';

@Component({
  selector: 'ds-claimed-task-actions',
  styleUrls: ['./claimed-task-actions.component.scss'],
  templateUrl: './claimed-task-actions.component.html',
})

export class ClaimedTaskActionsComponent extends MyDSpaceActionsComponent<ClaimedTask, ClaimedTaskDataService> implements OnInit {
  @Input() object: ClaimedTask;

  public workflowitem$: Observable<Workflowitem>;

  public processingApprove$ = new BehaviorSubject<boolean>(false);
  public processingReject$ = new BehaviorSubject<boolean>(false);
  public processingReturnToPool$ = new BehaviorSubject<boolean>(false);

  constructor(protected injector: Injector,
              protected router: Router,
              private cd: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
    super(ResourceType.ClaimedTask, injector, router)
  }

  ngOnInit() {
    this.initObjects(this.object);
  }

  initObjects(object: ClaimedTask) {
    this.object = object;
    this.workflowitem$ = (this.object.workflowitem as Observable<RemoteData<Workflowitem>>).pipe(
      filter((rd: RemoteData<Workflowitem>) => ((!rd.isRequestPending) && isNotUndefined(rd.payload))),
      map((rd: RemoteData<Workflowitem>) => rd.payload));
  }

  approve() {
    this.processingApprove$.next(true);
    this.objectDataService.approveTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  reject(reason) {
    this.processingReject$.next(true);
    this.objectDataService.rejectTask(reason, this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  returnToPool() {
    this.processingReturnToPool$.next(true);
    this.objectDataService.returnToPoolTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  private responseHandle(res: ProcessTaskResponse) {
    this.processingApprove$.next(false);
    this.processingReject$.next(false);
    this.processingReturnToPool$.next(false);
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

}
