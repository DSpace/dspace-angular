import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { RemoteData } from '../../../core/data/remote-data';
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationOptions } from '../../notifications/models/notification-options.model';
import { isNotUndefined } from '../../empty.util';
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

  public processingClaim$ = new BehaviorSubject<boolean>(false);
  public workflowitem$: Observable<Workflowitem>;

  constructor(protected injector: Injector,
              protected router: Router,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
    super(ResourceType.PoolTask, injector, router);
  }

  ngOnInit() {
    this.initObjects(this.object);
  }

  initObjects(object: PoolTask) {
    this.object = object;
    this.workflowitem$ = (this.object.workflowitem as Observable<RemoteData<Workflowitem>>).pipe(
      filter((rd: RemoteData<Workflowitem>) => ((!rd.isRequestPending) && isNotUndefined(rd.payload))),
      map((rd: RemoteData<Workflowitem>) => rd.payload));
  }

  claim() {
    this.processingClaim$.next(true);
    this.objectDataService.claimTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  private responseHandle(res: ProcessTaskResponse) {
    if (res.hasSucceeded) {
      this.processingClaim$.next(false);
      this.reload();
      this.notificationsService.success(null,
        this.translate.get('submission.workflow.tasks.generic.success'),
        new NotificationOptions(5000, false));
    } else {
      this.processingClaim$.next(false);
      this.notificationsService.error(null,
        this.translate.get('submission.workflow.tasks.generic.error'),
        new NotificationOptions(20000, true));
    }
  }

}
