import {
  Component,
  Injector,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { RequestService } from '../../../../core/data/request.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { AdvancedWorkflowActionType } from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-type';
import { NotificationsService } from '../../../notifications/notifications.service';
import { AdvancedClaimedTaskActionsAbstractComponent } from '../abstract/advanced-claimed-task-actions-abstract.component';
import { ClaimedTaskType } from '../claimed-task-type';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';

/**
 * Advanced Workflow button that redirect to the {@link AdvancedWorkflowActionRatingComponent}
 */
@Component({
  selector: 'ds-advanced-claimed-task-action-rating-reviewer',
  templateUrl: './advanced-claimed-task-action-rating.component.html',
  styleUrls: ['./advanced-claimed-task-action-rating.component.scss'],
  standalone: true,
  imports: [
    NgbTooltipModule,
    TranslateModule,
  ],
})
@rendersWorkflowTaskOption(ClaimedTaskType.ADVANCED_WORKFLOW_TASK_OPTION_RATING)
export class AdvancedClaimedTaskActionRatingComponent extends AdvancedClaimedTaskActionsAbstractComponent {

  workflowType = AdvancedWorkflowActionType.ADVANCED_WORKFLOW_ACTION_RATING;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService,
    protected route: ActivatedRoute,
  ) {
    super(injector, router, notificationsService, translate, searchService, requestService, route);
  }

}
