import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { NavbarComponent } from './navbar.component';

/**
 * Themed wrapper for NavbarComponent
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
  ],
})
export class ThemedNavbarComponent  extends ThemedComponent<NavbarComponent> {
  protected getComponentName(): string {
    return 'NavbarComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/navbar/navbar.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./navbar.component`);
  }
}
