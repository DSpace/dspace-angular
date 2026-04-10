import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AboutComponent } from './about.component';

/**
 * Themed wrapper for AboutComponent
 */
@Component({
  selector: 'ds-about',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedAboutComponent extends ThemedComponent<AboutComponent> {
  protected getComponentName(): string {
    return 'AboutComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/about/about.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./about.component`);
  }

}
