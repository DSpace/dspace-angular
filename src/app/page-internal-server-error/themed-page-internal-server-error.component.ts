import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { PageInternalServerErrorComponent } from './page-internal-server-error.component';

/**
 * Themed wrapper for PageInternalServerErrorComponent
 */
@Component({
  selector: 'ds-page-internal-server-error',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    PageInternalServerErrorComponent,
  ],
})
export class ThemedPageInternalServerErrorComponent extends ThemedComponent<PageInternalServerErrorComponent> {

  protected getComponentName(): string {
    return 'PageInternalServerErrorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/page-internal-server-error/page-internal-server-error.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./page-internal-server-error.component`);
  }
}
