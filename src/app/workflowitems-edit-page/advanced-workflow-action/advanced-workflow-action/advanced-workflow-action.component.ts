import { Location } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RequestService } from '@dspace/core/data/request.service';
import { WorkflowActionDataService } from '@dspace/core/data/workflow-action-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '@dspace/core/tasks/models/process-task-response';
import { WorkflowAction } from '@dspace/core/tasks/models/workflow-action-object.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WorkflowItemActionPageDirective } from '../../workflow-item-action-page.component';

/**
 * Abstract component for rendering an advanced claimed task's workflow page
 * To create a child-component for a new option:
 * - Set the "{@link getType}()" of the component
 * - Implement the {@link createBody}, should always contain at least the ADVANCED_WORKFLOW_TASK_OPTION_*
 */
@Component({
  selector: 'ds-advanced-workflow-action',
  standalone: true,
  template: '',
})
export abstract class AdvancedWorkflowActionComponent extends WorkflowItemActionPageDirective implements OnInit {

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
    protected requestService: RequestService,
    protected location: Location,
  ) {
    super(route, workflowItemService, router, routeService, notificationsService, translationService, requestService, location);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.workflowAction$ = this.workflowActionService.findById(this.route.snapshot.queryParams.workflow).pipe(
      getFirstSucceededRemoteDataPayload(),
    );
  }

  /**
   * Performs the action and shows a notification based on the outcome of the action
   */
  performAction(): void {
    this.sendRequest(this.route.snapshot.queryParams.claimedTask).subscribe((successful: boolean) => {
      if (successful) {
        const title = this.translationService.get('workflow-item.' + this.type + '.notification.success.title');
        const content = this.translationService.get('workflow-item.' + this.type + '.notification.success.content');
        this.notificationsService.success(title, content);
        this.previousPage();
      } else {
        const title = this.translationService.get('workflow-item.' + this.type + '.notification.error.title');
        const content = this.translationService.get('workflow-item.' + this.type + '.notification.error.content');
        this.notificationsService.error(title, content);
      }
    });
  }

  /**
   * Submits the task with the given {@link createBody}.
   *
   * @param id The task id
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
