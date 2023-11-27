import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { RegisterEmailFormComponent } from './register-email-form.component';

/**
 * Themed wrapper for {@link RegisterEmailFormComponent}
 */
@Component({
  selector: 'ds-themed-register-email-form',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedRegisterEmailFormComponent extends ThemedComponent<RegisterEmailFormComponent> {

  @Input() MESSAGE_PREFIX: string;

  @Input() typeRequest: string;

  protected inAndOutputNames: (keyof RegisterEmailFormComponent & keyof this)[] = [
    'MESSAGE_PREFIX',
    'typeRequest',
  ];

  protected getComponentName(): string {
    return 'RegisterEmailFormComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/register-email-form/register-email-form.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./register-email-form.component');
  }

}
