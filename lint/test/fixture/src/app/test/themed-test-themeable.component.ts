/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Component } from '@angular/core';

import { ThemedComponent } from '../../../../../../src/app/shared/theme-support/themed.component';
import { TestThemeableComponent } from './test-themeable.component';

@Component({
  selector: 'ds-test-themeable',
  template: '',
  standalone: true,
  imports: [TestThemeableComponent],
})
export class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
  protected getComponentName(): string {
    return '';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  protected importUnthemedComponent(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
