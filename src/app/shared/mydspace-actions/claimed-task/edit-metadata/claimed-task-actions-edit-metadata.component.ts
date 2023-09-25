import { Component, Injector } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { Router, RouterLink } from '@angular/router';
import { NotificationsService } from '../../../notifications/notifications.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SearchService } from '../../../../core/shared/search/search.service';
import { RequestService } from '../../../../core/data/request.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, AsyncPipe } from '@angular/common';

export const WORKFLOW_TASK_OPTION_EDIT_METADATA = 'submit_edit_metadata';

@rendersWorkflowTaskOption(WORKFLOW_TASK_OPTION_EDIT_METADATA)
@Component({
    selector: 'ds-claimed-task-actions-edit-metadata',
    styleUrls: ['./claimed-task-actions-edit-metadata.component.scss'],
    templateUrl: './claimed-task-actions-edit-metadata.component.html',
    standalone: true,
    imports: [NgIf, NgbTooltipModule, RouterLink, AsyncPipe, TranslateModule]
})
/**
 * Component for displaying the edit metadata action on a workflow task item
 */
export class ClaimedTaskActionsEditMetadataComponent extends ClaimedTaskActionsAbstractComponent {
  /**
   * This component represents the edit metadata option
   */
  option = WORKFLOW_TASK_OPTION_EDIT_METADATA;

  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }
}
