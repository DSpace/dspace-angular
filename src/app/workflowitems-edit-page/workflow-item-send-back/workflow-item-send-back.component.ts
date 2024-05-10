import {
  CommonModule,
  Location,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { RequestService } from '../../core/data/request.service';
import { RouteService } from '../../core/services/route.service';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { ModifyItemOverviewComponent } from '../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { VarDirective } from '../../shared/utils/var.directive';
import { WorkflowItemActionPageDirective } from '../workflow-item-action-page.component';

@Component({
  selector: 'ds-base-workflow-item-send-back',
  templateUrl: '../workflow-item-action-page.component.html',
  standalone: true,
  imports: [VarDirective, TranslateModule, CommonModule, ModifyItemOverviewComponent],
})
/**
 * Component representing a page to send back a workflow item to the submitter
 */
export class WorkflowItemSendBackComponent extends WorkflowItemActionPageDirective {
  constructor(protected route: ActivatedRoute,
              protected workflowItemService: WorkflowItemDataService,
              protected router: Router,
              protected routeService: RouteService,
              protected notificationsService: NotificationsService,
              protected translationService: TranslateService,
              protected requestService: RequestService,
              protected location: Location,
  ) {
    super(route, workflowItemService, router, routeService, notificationsService, translationService, requestService, location);
  }

  /**
   * Returns the type of page
   */
  getType(): string {
    return 'send-back';
  }

  /**
   * Performs the action of this workflow item action page
   * @param id The id of the WorkflowItem
   */
  sendRequest(id: string): Observable<boolean> {
    return this.workflowItemService.sendBack(id);
  }
}
