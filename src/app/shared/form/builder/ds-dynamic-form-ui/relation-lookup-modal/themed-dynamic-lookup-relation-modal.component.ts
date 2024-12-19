import { ThemedComponent } from '../../../../theme-support/themed.component';
import { DynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import { Component } from '@angular/core';

/**
 * Themed wrapper for {@link DynamicLookupRelationModalComponent}
 */
@Component({
  selector: 'ds-themed-dynamic-lookup-relation-modal',
  templateUrl: '../../../../theme-support/themed.component.html',
})
export class ThemedDynamicLookupRelationModalComponent extends ThemedComponent<DynamicLookupRelationModalComponent> {

  protected getComponentName(): string {
    return 'DynamicLookupRelationModalComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./dynamic-lookup-relation-modal.component');
  }

}
