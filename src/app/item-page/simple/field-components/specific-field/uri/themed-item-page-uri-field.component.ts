import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageUriFieldComponent } from './item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-uri-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemPageUriFieldComponent,
  ],
})
export class ThemedGenericItemPageUriFieldComponent extends ThemedComponent<ItemPageUriFieldComponent> {

  @Input() item: Item;

  @Input() separator: string;

  @Input() fields: string[];

  @Input() label: string;

  protected inAndOutputNames: (keyof ItemPageUriFieldComponent & keyof this)[] = [
    'item',
    'separator',
    'fields',
    'label',
  ];

  protected getComponentName(): string {
    return 'ItemPageUriFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-page-uri-field.component');
  }

}
