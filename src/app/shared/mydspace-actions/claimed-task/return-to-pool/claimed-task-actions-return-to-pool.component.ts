import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DSpaceObject,
  NotificationsService,
  PoolTaskDataService,
  RemoteData,
  RequestService,
  SearchService,
} from '@dspace/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';

export const WORKFLOW_TASK_OPTION_RETURN_TO_POOL = 'return_to_pool';

@Component({
  selector: 'ds-claimed-task-actions-return-to-pool',
  styleUrls: ['./claimed-task-actions-return-to-pool.component.scss'],
  templateUrl: './claimed-task-actions-return-to-pool.component.html',
  standalone: true,
  imports: [NgbTooltipModule, AsyncPipe, TranslateModule, BtnDisabledDirective],
})
/**
 * Component for displaying and processing the return to pool action on a workflow task item
 */
export class ClaimedTaskActionsReturnToPoolComponent extends ClaimedTaskActionsAbstractComponent {

  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService,
              private poolTaskService: PoolTaskDataService) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return this.poolTaskService.findByItem(this.itemUuid).pipe(take(1));
  }

  actionExecution(): Observable<any> {
    return this.objectDataService.returnToPoolTask(this.object.id);
  }

}
