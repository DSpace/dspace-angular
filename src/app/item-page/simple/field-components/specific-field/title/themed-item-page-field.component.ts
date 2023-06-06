import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { ItemPageTitleFieldComponent } from './item-page-title-field.component';
import { Item } from '../../../../../core/shared/item.model';

/**
 * Themed wrapper for {@link ItemPageTitleFieldComponent}
 */
@Component({
  selector: 'ds-themed-item-page-title-field',
  styleUrls: [],
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
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
