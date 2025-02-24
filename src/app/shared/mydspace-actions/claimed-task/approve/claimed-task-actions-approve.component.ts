import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ClaimedApprovedTaskSearchResult,
  DSpaceObject,
  NotificationsService,
  RemoteData,
  RequestService,
  SearchService,
  WorkflowItemDataService,
} from '@dspace/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';

export const WORKFLOW_TASK_OPTION_APPROVE = 'submit_approve';

@Component({
  selector: 'ds-claimed-task-actions-approve',
  styleUrls: ['./claimed-task-actions-approve.component.scss'],
  templateUrl: './claimed-task-actions-approve.component.html',
  standalone: true,
  imports: [NgbTooltipModule, AsyncPipe, TranslateModule, BtnDisabledDirective],
})
/**
 * Component for displaying and processing the approve action on a workflow task item
 */
export class ClaimedTaskActionsApproveComponent extends ClaimedTaskActionsAbstractComponent {

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService,
    protected workflowItemDataService: WorkflowItemDataService,
  ) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return of(this.object);
  }

  convertReloadedObject(dso: DSpaceObject): DSpaceObject {
    const reloadedObject = Object.assign(new ClaimedApprovedTaskSearchResult(), dso, {
      indexableObject: dso,
    });
    return reloadedObject;
  }

  public handleReloadableActionResponse(result: boolean, dso: DSpaceObject): void {
    super.handleReloadableActionResponse(result, dso);

    // Item page version table includes labels for workflow Items, determined
    // based on the result of /workflowitems/search/item?uuid=...
    // In order for this label to be in sync with the workflow state, we should
    // invalidate WFIs as they are approved.
    this.workflowItemDataService.invalidateByHref(this.object?._links.workflowitem?.href);
  }
}
