import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModifyItemOverviewComponent } from '../../../../../app/item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { WorkflowItemDeleteComponent as BaseComponent } from '../../../../../app/workflowitems-edit-page/workflow-item-delete/workflow-item-delete.component';

@Component({
  selector: 'ds-themed-workflow-item-delete',
  // styleUrls: ['workflow-item-delete.component.scss'],
  // templateUrl: './workflow-item-delete.component.html'
  templateUrl: '../../../../../app/workflowitems-edit-page/workflow-item-action-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ModifyItemOverviewComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class WorkflowItemDeleteComponent extends BaseComponent {
}
