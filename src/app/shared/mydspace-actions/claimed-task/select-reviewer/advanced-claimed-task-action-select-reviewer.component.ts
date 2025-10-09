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
import { ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER } from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-select-reviewer/advanced-workflow-action-select-reviewer.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { AdvancedClaimedTaskActionsAbstractComponent } from '../abstract/advanced-claimed-task-actions-abstract.component';

/**
 * Advanced Workflow button that redirect to the {@link AdvancedWorkflowActionSelectReviewerComponent}
 */
@Component({
  selector: 'ds-advanced-claimed-task-action-select-reviewer',
  templateUrl: './advanced-claimed-task-action-select-reviewer.component.html',
  styleUrls: ['./advanced-claimed-task-action-select-reviewer.component.scss'],
  standalone: true,
  imports: [
    NgbTooltipModule,
    TranslateModule,
  ],
})
export class AdvancedClaimedTaskActionSelectReviewerComponent extends AdvancedClaimedTaskActionsAbstractComponent {

  workflowType = ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER;

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
