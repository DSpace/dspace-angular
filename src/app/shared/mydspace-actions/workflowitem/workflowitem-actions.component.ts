import {
  Component,
  Injector,
  Input,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { RequestService } from '../../../core/data/request.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { getWorkflowItemViewRoute } from '../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import { NotificationsService } from '../../notifications/notifications.service';
import { MyDSpaceActionsComponent } from '../mydspace-actions';

/**
 * This component represents actions related to WorkflowItem object.
 */
@Component({
  selector: 'ds-workflowitem-actions',
  styleUrls: ['./workflowitem-actions.component.scss'],
  templateUrl: './workflowitem-actions.component.html',
  standalone: true,
  imports: [NgbTooltipModule, RouterLink, TranslateModule],
})
export class WorkflowitemActionsComponent extends MyDSpaceActionsComponent<WorkflowItem, WorkflowItemDataService> {

  /**
   * The WorkflowItem object
   */
  @Input() object: WorkflowItem;

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
    super(WorkflowItem.type, injector, router, notificationsService, translate, searchService, requestService);
  }

  /**
   * Get the workflowitem view route.
   */
  getWorkflowItemViewRoute(workflowitem: WorkflowItem): string {
    return getWorkflowItemViewRoute(workflowitem?.id);
  }

  /**
   * Init the target object
   *
   * @param {WorkflowItem} object
   */
  initObjects(object: WorkflowItem) {
    this.object = object;
  }
}
