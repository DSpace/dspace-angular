import { Component } from '@angular/core';
import { WorkflowItemActionPageComponent } from '../workflow-item-action-page.component';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { RouteService } from '../../core/services/route.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-workflow-item-send-back',
  templateUrl: '../workflow-item-action-page.component.html'
})
export class WorkflowItemSendBackComponent extends WorkflowItemActionPageComponent {
  constructor(protected route: ActivatedRoute,
              protected workflowItemService: WorkflowItemDataService,
              protected router: Router,
              protected routeService: RouteService,
              protected notificationsService: NotificationsService,
              protected translationService: TranslateService) {
    super(route, workflowItemService, router, routeService, notificationsService, translationService);
  }

  getType(): string {
    return 'send-back';
  }

  sendRequest(id: string): Observable<boolean> {
    return this.workflowItemService.sendBack(id);
  }
}
