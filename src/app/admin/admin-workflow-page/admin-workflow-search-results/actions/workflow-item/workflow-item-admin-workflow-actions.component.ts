import {
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHandPointLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import {
  getWorkflowItemDeleteRoute,
  getWorkflowItemSendBackRoute,
} from '../../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';

@Component({
  selector: 'ds-workflow-item-admin-workflow-actions-element',
  styleUrls: ['./workflow-item-admin-workflow-actions.component.scss'],
  templateUrl: './workflow-item-admin-workflow-actions.component.html',
  standalone: true,
  imports: [NgClass, RouterLink, NgIf, TranslateModule, FontAwesomeModule],
})
/**
 * The component for displaying the actions for a list element for a workflow-item on the admin workflow search page
 */
export class WorkflowItemAdminWorkflowActionsComponent {
  protected readonly faTrash = faTrash;
  protected readonly faHandPointLeft = faHandPointLeft;

  /**
   * The workflow item to perform the actions on
   */
  @Input() public wfi: WorkflowItem;

  /**
   * Whether to use small buttons or not
   */
  @Input() public small: boolean;

  /**
   * Returns the path to the delete page of this workflow item
   */
  getDeleteRoute(): string {
    return getWorkflowItemDeleteRoute(this.wfi.id);
  }

  /**
   * Returns the path to the send back page of this workflow item
   */
  getSendBackRoute(): string {
    return getWorkflowItemSendBackRoute(this.wfi.id);
  }
}
