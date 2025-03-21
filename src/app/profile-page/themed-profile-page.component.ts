import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ProfilePageComponent } from './profile-page.component';

/**
 * Themed wrapper for ProfilePageComponent
 */
@Component({
  selector: 'ds-profile-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [ProfilePageComponent],
})
export class ThemedProfilePageComponent extends ThemedComponent<ProfilePageComponent> {
  protected getComponentName(): string {
    return 'ProfilePageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/profile-page/profile-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./profile-page.component`);
  }
}
