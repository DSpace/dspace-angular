import { Component } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { DenyRequestCopyComponent } from './deny-request-copy.component';

/**
 * Themed wrapper for deny-request-copy.component
 */
@Component({
  selector: 'ds-themed-deny-request-copy',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
})
export class ThemedDenyRequestCopyComponent extends ThemedComponent<DenyRequestCopyComponent> {
    protected getComponentName(): string {
        return 'DenyRequestCopyComponent';
    }

    protected importThemedComponent(themeName: string): Promise<any> {
        return import(`../../../themes/${themeName}/app/request-copy/deny-request-copy/deny-request-copy.component`);
    }

    protected importUnthemedComponent(): Promise<any> {
        return import('./deny-request-copy.component');
    }
}
