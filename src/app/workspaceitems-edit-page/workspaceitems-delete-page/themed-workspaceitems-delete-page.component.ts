import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModifyItemOverviewComponent } from '../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { WorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page.component';

/**
 * Themed wrapper for WorkspaceItemsDeletePageComponent
 */

@Component({
  selector: 'ds-themed-workspace-items-delete',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ModifyItemOverviewComponent,
    TranslateModule,
    CommonModule,
  ],
})
export class ThemedWorkspaceItemsDeletePageComponent extends ThemedComponent<WorkspaceItemsDeletePageComponent> {
  protected getComponentName(): string {
    return 'WorkspaceItemsDeletePageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/workflowitems-edit-page/workflow-item-delete/workflow-item-delete.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./workspaceitems-delete-page.component`);
  }
}
