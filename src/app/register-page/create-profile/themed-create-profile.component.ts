import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { CreateProfileComponent } from './create-profile.component';

/**
 * Themed wrapper for CreateProfileComponent
 */
@Component({
  selector: 'ds-create-profile',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    CreateProfileComponent,
  ],
})
export class ThemedCreateProfileComponent extends ThemedComponent<CreateProfileComponent> {
  protected getComponentName(): string {
    return 'CreateProfileComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/register-page/create-profile/create-profile.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./create-profile.component`);
  }
}
