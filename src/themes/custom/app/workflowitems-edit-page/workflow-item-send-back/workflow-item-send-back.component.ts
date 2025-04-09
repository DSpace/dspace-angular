import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModifyItemOverviewComponent } from '../../../../../app/item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { WorkflowItemSendBackComponent as BaseComponent } from '../../../../../app/workflowitems-edit-page/workflow-item-send-back/workflow-item-send-back.component';

@Component({
  selector: 'ds-themed-workflow-item-send-back',
  // NOTE: the SCSS file for workflow-item-action-page does not have a corresponding file in the original
  // implementation, so this commented out line below is a stub, here if you
  // need it, but you probably don't need it.
  // styleUrls: ['./workflow-item-send-back.component.scss'],
  // templateUrl: './workflow-item-send-back.component.html'
  templateUrl: '../../../../../app/workflowitems-edit-page/workflow-item-action-page.component.html',
  standalone: true,
  imports: [VarDirective, TranslateModule, CommonModule, ModifyItemOverviewComponent],
})
/**
 * Component representing a page to send back a workflow item to the submitter
 */
export class WorkflowItemSendBackComponent extends BaseComponent {
}
