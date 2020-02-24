import { Component } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';

@rendersWorkflowTaskOption('submit_edit_metadata')
@Component({
  selector: 'ds-claimed-task-actions-edit-metadata',
  styleUrls: ['./claimed-task-actions-edit-metadata.component.scss'],
  templateUrl: './claimed-task-actions-edit-metadata.component.html',
})
/**
 * Component for displaying the edit metadata action on a workflow task item
 */
export class ClaimedTaskActionsEditMetadataComponent extends ClaimedTaskActionsAbstractComponent {
  process() {
    // Nothing needs to happen for the edit-metadata button, it simply renders a link to another page
  }
}
