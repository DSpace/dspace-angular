import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';

import { RequestService } from '../../../../core/data/request.service';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ClaimedDeclinedTaskTaskSearchResult } from '../../../object-collection/shared/claimed-declined-task-task-search-result.model';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { ClaimedTaskType } from '../claimed-task-type';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';

@Component({
  selector: 'ds-claimed-task-actions-decline-task',
  templateUrl: './claimed-task-actions-decline-task.component.html',
  styleUrls: ['./claimed-task-actions-decline-task.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgbTooltipModule,
    TranslateModule,
  ],
})
/**
 * Component for displaying and processing the decline task action on a workflow task item
 */
@rendersWorkflowTaskOption(ClaimedTaskType.WORKFLOW_TASK_OPTION_DECLINE_TASK)
export class ClaimedTaskActionsDeclineTaskComponent extends ClaimedTaskActionsAbstractComponent {

  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return of(this.object);
  }

  async convertReloadedObject(dso: DSpaceObject): Promise<DSpaceObject> {
    return Object.assign(new ClaimedDeclinedTaskTaskSearchResult(), dso, {
      indexableObject: dso,
    });
  }

}
