import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { PrivacyComponent } from './privacy.component';

/**
 * Themed wrapper for PrivacyComponent
 */
@Component({
  selector: 'ds-privacy',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [PrivacyComponent],
})
export class ThemedPrivacyComponent extends ThemedComponent<PrivacyComponent> {
  protected getComponentName(): string {
    return 'PrivacyComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/privacy/privacy.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./privacy.component`);
  }

}
