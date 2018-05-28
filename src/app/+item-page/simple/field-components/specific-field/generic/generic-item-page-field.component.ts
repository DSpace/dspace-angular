import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-generic-item-page-field',
  templateUrl: '../item-page-field.component.html'
})
export class GenericItemPageFieldComponent extends ItemPageFieldComponent {

  @Input() item: Item;

  @Input() separator: string;

  @Input() fields: string[];

  @Input() label: string;

}
