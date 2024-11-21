import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModifyItemOverviewComponent } from '../../../../../app/item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { WorkspaceItemsDeletePageComponent as BaseComponent } from '../../../../../app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component';


@Component({
  selector: 'ds-themed-workspaceitems-delete-page',
  templateUrl: '../../../../../app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component.html',
  standalone: true,
  imports: [
    ModifyItemOverviewComponent,
    TranslateModule,
    CommonModule,
  ],
})
export class WorkspaceItemsDeletePageComponent extends BaseComponent {
}
