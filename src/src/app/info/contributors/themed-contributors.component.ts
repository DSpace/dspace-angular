import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { ContributorsComponent } from './contributors.component';

/**
 * Themed wrapper for ContributorsComponent
 */
@Component({
  selector: 'ds-contributors',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedContributorsComponent extends ThemedComponent<ContributorsComponent> {
  protected getComponentName(): string {
    return 'ContributorsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/contributors/contributors.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./contributors.component`);
  }
}
