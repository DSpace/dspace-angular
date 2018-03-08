import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProcessTaskResponse } from '../../core/tasks/models/process-task-response';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PoolTask } from '../../core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../notifications/models/notification-options.model';

@Component({
  selector: 'ds-pool-task-actions',
  styleUrls: ['./pool-task-actions.component.scss'],
  templateUrl: './pool-task-actions.component.html',
})

export class PoolTaskActionsComponent implements OnInit {
  @Input() task: PoolTask;

  public processingClaim = false;
  public workflowitemObs: Observable<RemoteData<Workflowitem[]>>;

  constructor(private cd: ChangeDetectorRef,
              private ptDataService: PoolTaskDataService,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    this.workflowitemObs = this.task.workflowitem as Observable<RemoteData<Workflowitem[]>>;
  }

  claim() {
    this.processingClaim = true;
    this.ptDataService.claimTask(this.task.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingClaim = false;
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
