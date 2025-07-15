import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModifyItemOverviewComponent } from '../../../../../app/item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { WorkflowItemSendBackComponent as BaseComponent } from '../../../../../app/workflowitems-edit-page/workflow-item-send-back/workflow-item-send-back.component';

@Component({
  selector: 'ds-themed-workflow-item-send-back',
  // styleUrls: ['./workflow-item-send-back.component.scss'],
  // templateUrl: './workflow-item-send-back.component.html'
  templateUrl: '../../../../../app/workflowitems-edit-page/workflow-item-action-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ModifyItemOverviewComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class WorkflowItemSendBackComponent extends BaseComponent {
}
