import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { PageErrorComponent } from './page-error.component';

/**
 * Themed wrapper for PageErrorComponent
 */
@Component({
  selector: 'ds-page-error',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [PageErrorComponent],
})
export class ThemedPageErrorComponent extends ThemedComponent<PageErrorComponent> {

  protected getComponentName(): string {
    return 'PageErrorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/page-error/page-error.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`src/app/page-error/page-error.component`);
  }
}
