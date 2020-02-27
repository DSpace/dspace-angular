import { Component } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { WorkflowTaskOptions } from '../workflow-task-options.model';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';

@rendersWorkflowTaskOption(WorkflowTaskOptions.EditMetadata)
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
  option = WorkflowTaskOptions.EditMetadata;

  constructor(protected claimedTaskService: ClaimedTaskDataService) {
    super(claimedTaskService);
  }
}
