import { Component } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';

export const WORKFLOW_TASK_OPTION_EDIT_METADATA = 'submit_edit_metadata';

@rendersWorkflowTaskOption(WORKFLOW_TASK_OPTION_EDIT_METADATA)
@Component({
  selector: 'ds-claimed-task-actions-edit-metadata',
  styleUrls: ['./claimed-task-actions-edit-metadata.component.scss'],
  templateUrl: './claimed-task-actions-edit-metadata.component.html',
})
/**
 * Component for displaying the edit metadata action on a workflow task item
 */
export class ClaimedTaskActionsEditMetadataComponent extends ClaimedTaskActionsAbstractComponent {
  /**
   * This component represents the edit metadata option
   */
  option = WORKFLOW_TASK_OPTION_EDIT_METADATA;

  constructor(protected claimedTaskService: ClaimedTaskDataService) {
    super(claimedTaskService);
  }
}
