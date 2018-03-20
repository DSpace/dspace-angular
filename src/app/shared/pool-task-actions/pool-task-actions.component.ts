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
import { getAuthenticatedUser } from '../../core/auth/selectors';
import { hasNoUndefinedValue, isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { Eperson } from '../../core/eperson/models/eperson.model';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ds-pool-task-actions',
  styleUrls: ['./pool-task-actions.component.scss'],
  templateUrl: './pool-task-actions.component.html',
})

export class PoolTaskActionsComponent implements OnInit {
  @Input() task: PoolTask;

  public processingClaim = false;
  public workflowitemObs: Observable<RemoteData<Workflowitem[]>>;

  public itemObs: Observable<RemoteData<Item[]>>;
  submitter: Observable<Eperson>;
  user: Observable<Eperson>;

  constructor(private cd: ChangeDetectorRef,
              private ptDataService: PoolTaskDataService,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private store: Store<AppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.workflowitemObs = this.task.workflowitem as Observable<RemoteData<Workflowitem[]>>;

    this.itemObs = this.workflowitemObs
      .filter((rd: RemoteData<Workflowitem[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .flatMap((rd: RemoteData<Workflowitem[]>) => rd.payload[0].item as Observable<RemoteData<Item[]>>)
      .filter((rd: RemoteData<Item[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .map((i: RemoteData<Item[]>) => i);

    this.submitter = this.workflowitemObs
      .filter((rd: RemoteData<Workflowitem[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .flatMap((rd: RemoteData<Workflowitem[]>) => rd.payload[0].submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<Eperson[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .map((s: RemoteData<Eperson[]>) => s.payload[0]);

    this.user = this.store.select(getAuthenticatedUser)
      .filter((user: Eperson) => isNotEmpty(user))
      .take(1)
      .map((user: Eperson) => user);
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
      setTimeout(() => {
        this.processingClaim = false;
        this.cd.detectChanges();
        this.reload();
        this.notificationsService.success(null,
          this.translate.get('submission.workflow.tasks.generic.success'),
          new NotificationOptions(5000, false));
      }, 2000)
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
    this.router.navigate([this.router.url]);
  }

}
