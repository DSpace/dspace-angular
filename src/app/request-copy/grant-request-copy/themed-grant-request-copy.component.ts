import { Component } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { GrantRequestCopyComponent } from './grant-request-copy.component';

/**
 * Themed wrapper for grant-request-copy.component
 */
@Component({
  selector: 'ds-grant-request-copy',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    GrantRequestCopyComponent,
  ],
})

export class ThemedGrantRequestCopyComponent extends ThemedComponent<GrantRequestCopyComponent> {
  protected getComponentName(): string {
    return 'GrantRequestCopyComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/request-copy/grant-request-copy/grant-request-copy.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./grant-request-copy.component');
  }
}
