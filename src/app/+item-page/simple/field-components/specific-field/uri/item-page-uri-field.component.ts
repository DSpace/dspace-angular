import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-item-page-uri-field',
  templateUrl: './item-page-uri-field.component.html'
})
export class ItemPageUriFieldComponent extends ItemPageFieldComponent {

  @Input() item: Item;

  separator: string;

  fields: string[] = [
    'dc.identifier.uri'
  ];

  label = 'item.page.uri';

}
