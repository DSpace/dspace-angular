import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ExternalLoginPageComponent } from './external-login-page.component';

/**
 * Themed wrapper for ExternalLoginPageComponent
 */
@Component({
  selector: 'ds-themed-external-login-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html'
})
export class ThemedExternalLoginPageComponent extends ThemedComponent<ExternalLoginPageComponent> {
  protected getComponentName(): string {
    return 'ExternalLoginPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/external-login-page/external-login-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./external-login-page.component`);
  }
}
