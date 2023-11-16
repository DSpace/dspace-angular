import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { LogInComponent } from './log-in.component';

/**
 * Themed wrapper for {@link LogInComponent}
 */
@Component({
  selector: 'ds-themed-log-in',
  styleUrls: [],
  templateUrl: './../theme-support/themed.component.html'
})
export class ThemedLogInComponent extends ThemedComponent<LogInComponent> {

  @Input() isStandalonePage: boolean;

  protected inAndOutputNames: (keyof LogInComponent & keyof this)[] = [
    'isStandalonePage',
  ];

  protected getComponentName(): string {
    return 'LogInComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/log-in/log-in.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./log-in.component');
  }

}
