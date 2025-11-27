import { Component } from '@angular/core';

import { ThemedComponent } from '../../../theme-support/themed.component';
import { LogInPasswordComponent } from './log-in-password.component';

/**
 * Themed wrapper for LogInPasswordComponent
 */
@Component({
  selector: 'ds-log-in-password',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  imports: [
    LogInPasswordComponent,
  ],
})
export class ThemedLogInPasswordComponent extends ThemedComponent<LogInPasswordComponent> {
  protected getComponentName(): string {
    return 'LogInPasswordComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/log-in/methods/password/log-in-password.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./log-in-password.component`);
  }
}
