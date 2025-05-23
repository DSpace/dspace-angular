import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { HeaderComponent } from './header.component';

/**
 * Themed wrapper for HeaderComponent
 */
@Component({
  selector: 'ds-header',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
  ],
})
export class ThemedHeaderComponent extends ThemedComponent<HeaderComponent> {
  protected getComponentName(): string {
    return 'HeaderComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/header/header.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./header.component`);
  }
}
