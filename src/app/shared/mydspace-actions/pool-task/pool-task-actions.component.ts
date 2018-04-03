import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { Router } from '@angular/router';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { RemoteData } from '../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../../notifications/models/notification-options.model';
import { hasNoUndefinedValue } from '../../empty.util';
import { NormalizedPoolTask } from '../../../core/tasks/models/normalized-pool-task-object.model';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';

@Component({
  selector: 'ds-pool-task-actions',
  styleUrls: ['./pool-task-actions.component.scss'],
  templateUrl: './pool-task-actions.component.html',
})

export class PoolTaskActionsComponent extends MyDSpaceActionsComponent<PoolTask, NormalizedPoolTask, PoolTaskDataService> {
  @Input() object: PoolTask;

  public processingClaim = false;
  public workflowitemObs: Observable<Workflowitem>;

  constructor(protected injector: Injector,
              protected router: Router,
              private cd: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
    super(ResourceType.PoolTask, injector, router);
  }

  ngOnInit() {
    this.initObjects(this.object);
  }

  initObjects(object: PoolTask) {
    this.object = object;
    this.workflowitemObs = (this.object.workflowitem as Observable<RemoteData<Workflowitem[]>>)
      .filter((rd: RemoteData<Workflowitem[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .map((rd: RemoteData<Workflowitem[]>) => (rd.payload[0] as Workflowitem));
  }

  claim() {
    this.processingClaim = true;
    this.objectDataService.claimTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  private responseHandle(res: ProcessTaskResponse) {
    if (res.hasSucceeded) {
      this.processingClaim = false;
      this.cd.detectChanges();
      this.reload();
      this.notificationsService.success(null,
        this.translate.get('submission.workflow.tasks.generic.success'),
        new NotificationOptions(5000, false));
    } else {
      this.processingClaim = false;
      this.cd.detectChanges();
      this.notificationsService.error(null,
        this.translate.get('submission.workflow.tasks.generic.error'),
        new NotificationOptions(20000, true));
    }
  }

}
