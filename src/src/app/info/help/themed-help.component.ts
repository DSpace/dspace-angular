import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { HelpComponent } from './help.component';

/**
 * Themed wrapper for HelpComponent
 */
@Component({
  selector: 'ds-help',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedHelpComponent extends ThemedComponent<HelpComponent> {
  protected getComponentName(): string {
    return 'HelpComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/help/help.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./help.component`);
  }
}
