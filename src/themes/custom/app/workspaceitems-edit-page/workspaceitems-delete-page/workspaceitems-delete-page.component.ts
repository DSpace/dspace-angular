import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModifyItemOverviewComponent } from '../../../../../app/item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { WorkspaceItemsDeletePageComponent as BaseComponent } from '../../../../../app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component';

@Component({
  selector: 'ds-themed-workspaceitems-delete-page',
  // styleUrls: ['./workspaceitems-delete-page.component.scss'],
  styleUrls: ['../../../../../app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component.scss'],
  // templateUrl: './workspaceitems-delete-page.component.html',
  templateUrl: '../../../../../app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ModifyItemOverviewComponent,
    TranslateModule,
  ],
})
export class WorkspaceItemsDeletePageComponent extends BaseComponent {
}
