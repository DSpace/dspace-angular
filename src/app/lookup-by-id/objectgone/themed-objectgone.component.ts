import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { ObjectGoneComponent } from './objectgone.component';

/**
 * Themed wrapper for ObjectGoneComponent
 */
@Component({
  selector: 'ds-objgone',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [ObjectGoneComponent],
})
export class ThemedObjectGoneComponent extends ThemedComponent<ObjectGoneComponent> {
  protected getComponentName(): string {
    return 'ObjectGoneComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/lookup-by-id/objectgone/objectgone.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./objectgone.component`);
  }

}
