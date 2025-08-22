import {
  AsyncPipe,
  Location,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { NoContent } from '@dspace/core/shared/NoContent.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ModifyItemOverviewComponent } from '../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { WorkflowItemActionPageDirective } from '../workflow-item-action-page.component';

@Component({
  selector: 'ds-base-workflow-item-delete',
  templateUrl: '../workflow-item-action-page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ModifyItemOverviewComponent,
    TranslatePipe,
    VarDirective,
  ],
})
/**
 * Component representing a page to delete a workflow item
 */
export class WorkflowItemDeleteComponent extends WorkflowItemActionPageDirective {
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
    return 'delete';
  }

  /**
   * Performs the action of this workflow item action page
   * @param id The id of the WorkflowItem
   */
  sendRequest(id: string): Observable<boolean> {
    return this.workflowItemService.delete(id).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<NoContent>) => response.hasSucceeded),
    );
  }
}
