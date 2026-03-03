import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageAuthorFieldComponent } from './item-page-author-field.component';

@Component({
  selector: 'ds-item-page-author-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemPageAuthorFieldComponent,
  ],
})
export class ThemedItemPageAuthorFieldComponent extends ThemedComponent<ItemPageAuthorFieldComponent> {

  @Input() item: Item;

  protected inAndOutputNames: (keyof ItemPageAuthorFieldComponent & keyof this)[] = [
    'item',
  ];

  protected getComponentName(): string {
    return 'ItemPageAuthorFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/author/item-page-author-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-page-author-field.component');
  }

}
