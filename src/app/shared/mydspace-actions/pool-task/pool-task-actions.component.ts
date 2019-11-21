import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { RemoteData } from '../../../core/data/remote-data';
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { isNotUndefined } from '../../empty.util';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { NotificationsService } from '../../notifications/notifications.service';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { RequestService } from '../../../core/data/request.service';

/**
 * This component represents mydspace actions related to PoolTask object.
 */
@Component({
  selector: 'ds-pool-task-actions',
  styleUrls: ['./pool-task-actions.component.scss'],
  templateUrl: './pool-task-actions.component.html',
})
export class PoolTaskActionsComponent extends MyDSpaceActionsComponent<PoolTask, PoolTaskDataService> {

  /**
   * The PoolTask object
   */
  @Input() object: PoolTask;

  /**
   * A boolean representing if a claim operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processingClaim$ = new BehaviorSubject<boolean>(false);

  /**
   * The workflowitem object that belonging to the PoolTask object
   */
  public workflowitem$: Observable<WorkflowItem>;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   */
  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService) {
    super(PoolTask.type, injector, router, notificationsService, translate, searchService, requestService);
  }

  /**
   * Initialize objects
   */
  ngOnInit() {
    this.initObjects(this.object);
  }

  /**
   * Init the PoolTask and WorkflowItem objects
   *
   * @param {PoolTask} object
   */
  initObjects(object: PoolTask) {
    this.object = object;
    this.workflowitem$ = (this.object.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      filter((rd: RemoteData<WorkflowItem>) => ((!rd.isRequestPending) && isNotUndefined(rd.payload))),
      map((rd: RemoteData<WorkflowItem>) => rd.payload));
  }

  /**
   * Claim the task.
   */
  claim() {
    this.processingClaim$.next(true);
    this.objectDataService.claimTask(this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.handleActionResponse(res.hasSucceeded);
        this.processingClaim$.next(false);
      });
  }
}
