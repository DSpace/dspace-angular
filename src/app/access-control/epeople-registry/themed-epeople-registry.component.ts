import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { EPeopleRegistryComponent } from './epeople-registry.component';

/**
 * Themed wrapper for EPeopleRegistryComponent
 */
@Component({
  selector: 'ds-epeople-registry-wrapper',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedEPeopleRegistryComponent extends ThemedComponent<EPeopleRegistryComponent> {
  protected getComponentName(): string {
    return 'EPeopleRegistryComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/access-control/epeople-registry/epeople-registry.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./epeople-registry.component');
  }
}
