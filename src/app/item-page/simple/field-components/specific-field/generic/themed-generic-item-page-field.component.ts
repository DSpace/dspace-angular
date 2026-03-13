import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { GenericItemPageFieldComponent } from './generic-item-page-field.component';

@Component({
  selector: 'ds-generic-item-page-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  imports: [
    GenericItemPageFieldComponent,
  ],
})
export class ThemedGenericItemPageFieldComponent extends ThemedComponent<GenericItemPageFieldComponent> {

  @Input() item: Item;

  @Input() separator: string;

  @Input() fields: string[];

  @Input() label: string;

  @Input() enableMarkdown: boolean;

  @Input() urlRegex?: string;

  protected inAndOutputNames: (keyof GenericItemPageFieldComponent & keyof this)[] = [
    'item',
    'separator',
    'fields',
    'label',
    'enableMarkdown',
    'urlRegex',
  ];

  protected getComponentName(): string {
    return 'GenericItemPageFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./generic-item-page-field.component');
  }

}
