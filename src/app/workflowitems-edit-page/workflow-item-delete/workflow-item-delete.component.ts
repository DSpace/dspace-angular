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
import { map } from 'rxjs/operators';

import { RemoteData } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { RouteService } from '@dspace/core';
import { NoContent } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { WorkflowItemDataService } from '@dspace/core';
import { ModifyItemOverviewComponent } from '../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { WorkflowItemActionPageDirective } from '../workflow-item-action-page.component';

@Component({
  selector: 'ds-base-workflow-item-delete',
  templateUrl: '../workflow-item-action-page.component.html',
  standalone: true,
  imports: [VarDirective, TranslateModule, CommonModule, ModifyItemOverviewComponent],
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
