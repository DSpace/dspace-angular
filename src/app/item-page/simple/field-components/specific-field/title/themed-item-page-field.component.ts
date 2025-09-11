import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageTitleFieldComponent } from './item-page-title-field.component';

/**
 * Themed wrapper for {@link ItemPageTitleFieldComponent}
 */
@Component({
  selector: 'ds-item-page-title-field',
  styleUrls: [],
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemPageTitleFieldComponent,
  ],
})
export class ThemedItemPageTitleFieldComponent extends ThemedComponent<ItemPageTitleFieldComponent> {

  protected inAndOutputNames: (keyof ItemPageTitleFieldComponent & keyof this)[] = [
    'item',
  ];

  @Input() item: Item;

  protected getComponentName(): string {
    return 'ItemPageTitleFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/title/item-page-title-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-page-title-field.component');
  }
}
