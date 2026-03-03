import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageCcLicenseFieldComponent } from './item-page-cc-license-field.component';

@Component({
  selector: 'ds-item-page-cc-license-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemPageCcLicenseFieldComponent,
  ],
})
export class ThemedItemPageCcLicenseFieldComponent extends ThemedComponent<ItemPageCcLicenseFieldComponent> {

  @Input() item: Item;

  @Input() variant: 'small' | 'full';

  @Input() ccLicenseUriField?: string;

  @Input() ccLicenseNameField?: string;

  @Input() showName: boolean;

  @Input() showDisclaimer: boolean;

  protected inAndOutputNames: (keyof ItemPageCcLicenseFieldComponent & keyof this)[] = [
    'item',
    'variant',
    'ccLicenseUriField',
    'ccLicenseNameField',
    'showName',
    'showDisclaimer',
  ];

  protected getComponentName(): string {
    return 'ItemPageCcLicenseFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-page-cc-license-field.component');
  }

}
