import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { WorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page.component';

/**
 * Themed wrapper for {@link WorkspaceItemsDeletePageComponent}
 */
@Component({
  selector: 'ds-workspace-items-delete',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    WorkspaceItemsDeletePageComponent,
  ],
})
export class ThemedWorkspaceItemsDeletePageComponent extends ThemedComponent<WorkspaceItemsDeletePageComponent> {
  protected getComponentName(): string {
    return 'WorkspaceItemsDeletePageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./workspaceitems-delete-page.component');
  }
}
