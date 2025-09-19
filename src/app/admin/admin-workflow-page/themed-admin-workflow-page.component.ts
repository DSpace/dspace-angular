import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AdminWorkflowPageComponent } from './admin-workflow-page.component';

/**
 * Themed wrapper for {@link AdminWorkflowPageComponent}
 */
@Component({
  selector: 'ds-admin-workflow-page',
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    AdminWorkflowPageComponent,
  ],
})
export class ThemedAdminWorkflowPageComponent extends ThemedComponent<AdminWorkflowPageComponent> {

  protected getComponentName(): string {
    return 'AdminWorkflowPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/admin/admin-workflow-page/admin-workflow-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./admin-workflow-page.component');
  }

}
