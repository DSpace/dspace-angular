import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Injector,
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

import { RequestService } from '../../../../core/data/request.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';

export const WORKFLOW_TASK_OPTION_EDIT_METADATA = 'submit_edit_metadata';

@Component({
  selector: 'ds-claimed-task-actions-edit-metadata',
  styleUrls: ['./claimed-task-actions-edit-metadata.component.scss'],
  templateUrl: './claimed-task-actions-edit-metadata.component.html',
  standalone: true,
  imports: [NgIf, NgbTooltipModule, RouterLink, AsyncPipe, TranslateModule],
})
/**
 * Component for displaying the edit metadata action on a workflow task item
 */
export class ClaimedTaskActionsEditMetadataComponent extends ClaimedTaskActionsAbstractComponent {

  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }
}
