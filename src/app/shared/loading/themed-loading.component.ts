import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../theme-support/themed.component';
import { LoadingComponent } from './loading.component';

/**
 * Themed wrapper for LoadingComponent
 */
@Component({
  selector: 'ds-themed-loading',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedLoadingComponent extends ThemedComponent<LoadingComponent> {

  @Input() message: string;
  @Input() showMessage: boolean;
  @Input() spinner: boolean;

  protected getComponentName(): string {
    return 'LoadingComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/loading/loading.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./loading.component');
  }
}
