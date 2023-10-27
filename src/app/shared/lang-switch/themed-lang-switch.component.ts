import { Component } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { LangSwitchComponent } from './lang-switch.component';

/**
 * Themed wrapper for {@link LangSwitchComponent}
 */
@Component({
  selector: 'ds-themed-lang-switch',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedLangSwitchComponent extends ThemedComponent<LangSwitchComponent> {

  protected getComponentName(): string {
    return 'LangSwitchComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/lang-switch/lang-switch.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./lang-switch.component`);
  }

}
