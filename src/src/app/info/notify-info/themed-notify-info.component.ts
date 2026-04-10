import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { NotifyInfoComponent } from './notify-info.component';

/**
 * Themed wrapper for NotifyInfoComponent
 */
@Component({
  selector: 'ds-notify-info-themed',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedNotifyInfoComponent extends ThemedComponent<NotifyInfoComponent> {
  protected getComponentName(): string {
    return 'NotifyInfoComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/notify-info/notify-info.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./notify-info.component`);
  }
}
