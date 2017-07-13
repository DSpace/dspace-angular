import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageSpecificFieldComponent } from '../item-page-specific-field.component';

@Component({
  selector: 'ds-item-page-uri-field',
  templateUrl: './item-page-uri-field.component.html'
})
export class ItemPageUriFieldComponent extends ItemPageSpecificFieldComponent {

  @Input() item: Item;

  separator: string;

  fields: string[] = [
    'dc.identifier.uri'
  ];

  label = 'item.page.uri';

}
