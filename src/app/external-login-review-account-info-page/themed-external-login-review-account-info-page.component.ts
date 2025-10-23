import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';

/**
 * Themed wrapper for ExternalLoginReviewAccountInfoPageComponent
 */
@Component({
  selector: 'ds-external-login-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ExternalLoginReviewAccountInfoPageComponent,
  ],
})
export class ThemedExternalLoginReviewAccountInfoPageComponent extends ThemedComponent<ExternalLoginReviewAccountInfoPageComponent> {
  protected getComponentName(): string {
    return 'ExternalLoginReviewAccountInfoPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/external-login-review-account-info/external-login-review-account-info-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./external-login-review-account-info-page.component`);
  }
}
