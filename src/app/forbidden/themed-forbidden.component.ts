import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ForbiddenComponent } from './forbidden.component';

/**
 * Themed wrapper for ForbiddenComponent
 */
@Component({
  selector: 'ds-forbidden',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [ForbiddenComponent],
})
export class ThemedForbiddenComponent extends ThemedComponent<ForbiddenComponent> {
  protected getComponentName(): string {
    return 'ForbiddenComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/forbidden/forbidden.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./forbidden.component`);
  }

}
