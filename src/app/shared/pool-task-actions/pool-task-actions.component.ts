import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { Router } from '@angular/router';
import { ProcessTaskResponse } from '../../core/tasks/models/process-task-response';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PoolTask } from '../../core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../notifications/models/notification-options.model';
import { hasNoUndefinedValue } from '../empty.util';

@Component({
  selector: 'ds-pool-task-actions',
  styleUrls: ['./pool-task-actions.component.scss'],
  templateUrl: './pool-task-actions.component.html',
})

export class PoolTaskActionsComponent implements OnInit {
  @Input() task: PoolTask;

  public processingClaim = false;
  public workflowitemObs: Observable<Workflowitem>;

  constructor(private cd: ChangeDetectorRef,
              private ptDataService: PoolTaskDataService,
              private router: Router,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.initWorkflow();
  }

  claim() {
    this.processingClaim = true;
    this.ptDataService.claimTask(this.task.id)
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

  reload() {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigated = false;
    const url = decodeURIComponent(this.router.url);
    this.router.navigateByUrl(url);
  }

  refresh() {
    // console.log('pt-reload');
    this.ptDataService.findById(this.task.id)
      .filter((task: RemoteData<PoolTask>) => task.hasSucceeded)
      .take(1)
      .subscribe((task) => {
        // console.log('pt-reload-subscribe');
        this.initWorkflow();
      });
  }

  initWorkflow() {
    this.workflowitemObs = (this.task.workflowitem as Observable<RemoteData<Workflowitem[]>>)
      .filter((rd: RemoteData<Workflowitem[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .map((rd: RemoteData<Workflowitem[]>) => (rd.payload[0] as Workflowitem));
  }

}
