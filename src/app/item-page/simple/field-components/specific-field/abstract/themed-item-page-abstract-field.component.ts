import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageAbstractFieldComponent } from './item-page-abstract-field.component';

@Component({
  selector: 'ds-item-page-abstract-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemPageAbstractFieldComponent,
  ],
})
export class ThemedItemPageAbstractFieldComponent extends ThemedComponent<ItemPageAbstractFieldComponent> {

  @Input() item: Item;

  protected inAndOutputNames: (keyof ItemPageAbstractFieldComponent & keyof this)[] = [
    'item',
  ];

  protected getComponentName(): string {
    return 'ItemPageAbstractFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-page-abstract-field.component');
  }

}
