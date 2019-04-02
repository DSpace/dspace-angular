import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { WorkflowitemDataService } from '../../../core/submission/workflowitem-data.service';
import { ResourceType } from '../../../core/shared/resource-type';
import { NotificationsService } from '../../notifications/notifications.service';

/**
 * This component represents mydspace actions related to Workflowitem object.
 */
@Component({
  selector: 'ds-workflowitem-actions',
  styleUrls: ['./workflowitem-actions.component.scss'],
  templateUrl: './workflowitem-actions.component.html',
})
export class WorkflowitemActionsComponent extends MyDSpaceActionsComponent<Workflowitem, WorkflowitemDataService> {

  /**
   * The Workflowitem object
   */
  @Input() object: Workflowitem;

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
    super(ResourceType.Workflowitem, injector, router, notificationsService, translate);
  }

  /**
   * Init the target object
   *
   * @param {Workflowitem} object
   */
  initObjects(object: Workflowitem) {
    this.object = object;
  }

}
