import { Component, Input } from '@angular/core';
import { getItemEditPath } from '../../../+item-page/item-page-routing.module';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { ITEM_EDIT_WITHDRAW_PATH } from '../../../+item-page/edit-item-page/edit-item-page.routing.module';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';

@Component({
  selector: 'ds-workflow-item-admin-workflow-actions-element',
  styleUrls: ['./workflow-item-admin-workflow-actions.component.scss'],
  templateUrl: './workflow-item-admin-workflow-actions.component.html'
})
/**
 * The component for displaying the actions for a list element for an item on the admin workflow page
 */
export class WorkflowItemAdminWorkflowActionsComponent {
  /**
   * The item to perform the actions on
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
    return getDeletePath(this.wfi.id)
  }

  /**
   * Returns the path to the send back page of this workflow item
   */
  getSendBackPath(): string {
    return getSendPath(this.wfi.id);
  }
}
