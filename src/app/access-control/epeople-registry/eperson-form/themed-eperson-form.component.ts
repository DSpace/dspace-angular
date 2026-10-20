import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { EPersonFormComponent } from './eperson-form.component';

/**
 * Themed wrapper for EPersonFormComponent
 */
@Component({
  selector: 'ds-eperson-form-wrapper',
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedEPersonFormComponent extends ThemedComponent<EPersonFormComponent> {
  protected getComponentName(): string {
    return 'EPersonFormComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/access-control/epeople-registry/eperson-form/eperson-form.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./eperson-form.component');
  }
}
