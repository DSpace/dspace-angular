import { Component } from '@angular/core';

import { ThemedComponent } from '../../theme-support/themed.component';
import { ResourcePolicyEditComponent } from './resource-policy-edit.component';

/**
 * Themed wrapper for {@link ResourcePolicyEditComponent}
 */
@Component({
  selector: 'ds-resource-policy-edit',
  templateUrl: '../../theme-support/themed.component.html',
  standalone: true,
  imports: [ResourcePolicyEditComponent],
})
export class ThemedResourcePolicyEditComponent extends ThemedComponent<ResourcePolicyEditComponent> {
  protected getComponentName(): string {
    return 'ResourcePolicyEditComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/resource-policies/edit/resource-policy-edit.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./resource-policy-edit.component');
  }
}
