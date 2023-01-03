import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from '../../../../core/shared/search/search.service';
import { RequestService } from '../../../../core/data/request.service';
import {
  getWorkflowRatingReviewerRoute
} from '../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import {
  AdvancedClaimedTaskActionsAbstractComponent
} from '../abstract/advanced-claimed-task-actions-abstract.component';

export const WORKFLOW_ADVANCED_TASK_OPTION_RATING_REVIEWER = 'submit_rating_reviewer';

@Component({
  selector: 'ds-advanced-claimed-task-action-rating-reviewer',
  templateUrl: './advanced-claimed-task-action-rating-reviewer.component.html',
  styleUrls: ['./advanced-claimed-task-action-rating-reviewer.component.scss']
})
export class AdvancedClaimedTaskActionRatingReviewerComponent extends AdvancedClaimedTaskActionsAbstractComponent {

  /**
   * This component represents the advanced select option
   */
  option = WORKFLOW_ADVANCED_TASK_OPTION_RATING_REVIEWER;

  /**
   * Route to the workflow's task page
   */
  workflowTaskPageRoute: string;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService,
  ) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }

  ngOnInit(): void {
    this.initPageRoute();
  }

  /**
   * Initialise the route to the rating reviewer's page
   */
  initPageRoute() {
    this.workflowTaskPageRoute = getWorkflowRatingReviewerRoute(this.object.id);
  }

}
