import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ForbiddenComponent } from './forbidden.component';

@Component({
  selector: 'ds-themed-forbidden',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})

/**
 * Component to render the news section on the home page
 */
export class ThemedForbiddenComponent extends ThemedComponent<ForbiddenComponent> {
  protected getComponentName(): string {
    return 'ForbiddenComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/forbidden/forbidden.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./forbidden.component`);
  }

}
