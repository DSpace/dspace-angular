import { Component, Input } from '@angular/core';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { getWorkflowItemDeletePath, getWorkflowItemSendBackPath } from '../../../+workflowitems-edit-page/workflowitems-edit-page-routing.module';

@Component({
  selector: 'ds-workflow-item-admin-workflow-actions-element',
  styleUrls: ['./workflow-item-admin-workflow-actions.component.scss'],
  templateUrl: './workflow-item-admin-workflow-actions.component.html'
})
/**
 * The component for displaying the actions for a list element for an item on the admin workflow search page
 */
export class WorkflowItemAdminWorkflowActionsComponent {

  /**
   * The workflow item to perform the actions on
   */
  @Input() public wfi: WorkflowItem;

  /**
   * Whether or not to use small buttons
   */
  @Input() public small: boolean;

  /**
   * Returns the path to the delete page of this workflow item
   */
  getDeletePath(): string {

    return getWorkflowItemDeletePath(this.wfi.id)
  }

  /**
   * Returns the path to the send back page of this workflow item
   */
  getSendBackPath(): string {
    return getWorkflowItemSendBackPath(this.wfi.id);
  }
}
