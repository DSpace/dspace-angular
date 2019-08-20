import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { isNotUndefined } from '../../empty.util';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { RemoteData } from '../../../core/data/remote-data';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { NotificationsService } from '../../notifications/notifications.service';

/**
 * This component represents mydspace actions related to ClaimedTask object.
 */
@Component({
  selector: 'ds-claimed-task-actions',
  styleUrls: ['./claimed-task-actions.component.scss'],
  templateUrl: './claimed-task-actions.component.html',
})
export class ClaimedTaskActionsComponent extends MyDSpaceActionsComponent<ClaimedTask, ClaimedTaskDataService> implements OnInit {

  /**
   * The ClaimedTask object
   */
  @Input() object: ClaimedTask;

  /**
   * The workflowitem object that belonging to the ClaimedTask object
   */
  public workflowitem$: Observable<WorkflowItem>;

  /**
   * A boolean representing if an approve operation is pending
   */
  public processingApprove$ = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if a reject operation is pending
   */
  public processingReject$ = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if a return to pool operation is pending
   */
  public processingReturnToPool$ = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   */
  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService) {
    super(ClaimedTask.type, injector, router, notificationsService, translate);
  }

  /**
   * Initialize objects
   */
  ngOnInit() {
    this.initObjects(this.object);
  }

  /**
   * Init the ClaimedTask and WorkflowItem objects
   *
   * @param {PoolTask} object
   */
  initObjects(object: ClaimedTask) {
    this.object = object;
    this.workflowitem$ = (this.object.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      filter((rd: RemoteData<WorkflowItem>) => ((!rd.isRequestPending) && isNotUndefined(rd.payload))),
      map((rd: RemoteData<WorkflowItem>) => rd.payload));
  }

  /**
   * Approve the task.
   */
  approve() {
    this.processingApprove$.next(true);
    this.objectDataService.approveTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingApprove$.next(false);
        this.handleActionResponse(res.hasSucceeded);
      });
  }

  /**
   * Reject the task.
   */
  reject(reason) {
    this.processingReject$.next(true);
    this.objectDataService.rejectTask(reason, this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingReject$.next(false);
        this.handleActionResponse(res.hasSucceeded);
      });
  }

  /**
   * Return task to the pool.
   */
  returnToPool() {
    this.processingReturnToPool$.next(true);
    this.objectDataService.returnToPoolTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processingReturnToPool$.next(false);
        this.handleActionResponse(res.hasSucceeded);
      });
  }

}
