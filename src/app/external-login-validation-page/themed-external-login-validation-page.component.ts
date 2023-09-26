import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ExternalLoginValidationPageComponent } from './external-login-validation-page.component';

/**
 * Themed wrapper for ExternalLoginValidationPageComponent
 */
@Component({
  selector: 'ds-themed-external-login-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html'
})
export class ThemedExternalLoginValidationPageComponent extends ThemedComponent<ExternalLoginValidationPageComponent> {
  protected getComponentName(): string {
    return 'ExternalLoginValidationPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/external-login-validation-page/external-login-validation-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./external-login-validation-page.component`);
  }
}
