import { Component, OnInit } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { BrowseBySwitcherComponent } from './browse-by-switcher.component';

@Component({
  selector: 'ds-themed-browse-by-switcher',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html'
})
/**
 * Component for determining what Browse-By component to use depending on the metadata (browse ID) provided
 */
export class ThemedBrowseBySwitcherComponent extends ThemedComponent<BrowseBySwitcherComponent> {
  protected getComponentName(): string {
    return 'BrowseBySwitcherComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/+browse-by/+browse-by-switcher/browse-by-switcher.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./browse-by-switcher.component`);
  }


}
