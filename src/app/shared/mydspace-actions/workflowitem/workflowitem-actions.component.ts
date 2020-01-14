import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestService } from '../../../core/data/request.service';
import { SearchService } from '../../../core/shared/search/search.service';

/**
 * This component represents actions related to WorkflowItem object.
 */
@Component({
  selector: 'ds-workflowitem-actions',
  styleUrls: ['./workflowitem-actions.component.scss'],
  templateUrl: './workflowitem-actions.component.html',
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
   * Init the target object
   *
   * @param {WorkflowItem} object
   */
  initObjects(object: WorkflowItem) {
    this.object = object;
  }
}
