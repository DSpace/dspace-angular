import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageDateFieldComponent } from './item-page-date-field.component';

@Component({
  selector: 'ds-item-page-date-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemPageDateFieldComponent,
  ],
})
export class ThemedItemPageDateFieldComponent extends ThemedComponent<ItemPageDateFieldComponent> {

  @Input() item: Item;

  protected inAndOutputNames: (keyof ItemPageDateFieldComponent & keyof this)[] = [
    'item',
  ];

  protected getComponentName(): string {
    return 'ItemPageDateFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/date/item-page-date-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-page-date-field.component');
  }

}
