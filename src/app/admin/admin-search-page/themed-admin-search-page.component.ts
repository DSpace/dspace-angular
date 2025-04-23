import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AdminSearchPageComponent } from './admin-search-page.component';

/**
 * Themed wrapper for {@link AdminSearchPageComponent}
 */
@Component({
  selector: 'ds-admin-search-page',
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    AdminSearchPageComponent,
  ],
})
export class ThemedAdminSearchPageComponent extends ThemedComponent<AdminSearchPageComponent> {

  protected getComponentName(): string {
    return 'AdminSearchPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/admin/admin-search-page/admin-search-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./admin-search-page.component');
  }

}
