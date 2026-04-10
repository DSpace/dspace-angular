import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { CitationComponent } from './citation.component';

/**
 * Themed wrapper for CitationComponent
 */
@Component({
  selector: 'ds-citation',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedCitationComponent extends ThemedComponent<CitationComponent> {
  protected getComponentName(): string {
    return 'CitationComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/citation/citation.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./citation.component`);
  }
}
