import { Component, OnInit } from '@angular/core';
import { WorkflowAction } from '../../../core/tasks/models/workflow-action-object.model';
import { WorkflowActionDataService } from '../../../core/data/workflow-action-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkflowItemActionPageComponent } from '../../workflow-item-action-page.component';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { RouteService } from '../../../core/services/route.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { map } from 'rxjs/operators';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';

@Component({
  selector: 'ds-advanced-workflow-action',
  template: '',
})
export abstract class AdvancedWorkflowActionComponent extends WorkflowItemActionPageComponent implements OnInit {

  workflowAction$: Observable<WorkflowAction>;

  constructor(
    protected route: ActivatedRoute,
    protected workflowItemService: WorkflowItemDataService,
    protected router: Router,
    protected routeService: RouteService,
    protected notificationsService: NotificationsService,
    protected translationService: TranslateService,
    protected workflowActionService: WorkflowActionDataService,
    protected claimedTaskDataService: ClaimedTaskDataService,
  ) {
    super(route, workflowItemService, router, routeService, notificationsService, translationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.workflowAction$ = this.workflowActionService.findById(this.route.snapshot.queryParams.workflow).pipe(
      getFirstSucceededRemoteDataPayload(),
    );
  }

  /**
   * Submits the task with the given {@link createBody}.
   *
   * @param id
   */
  sendRequest(id: string): Observable<boolean> {
    return this.claimedTaskDataService.submitTask(id, this.createBody()).pipe(
      map((processTaskResponse: ProcessTaskResponse) => processTaskResponse.hasSucceeded),
    );
  }

  /**
   * The body that needs to be passed to the {@link ClaimedTaskDataService}.submitTask().
   */
  abstract createBody(): any;

}
