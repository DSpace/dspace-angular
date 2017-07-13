import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageSpecificFieldComponent } from '../item-page-specific-field.component';

@Component({
  selector: 'ds-item-page-author-field',
  templateUrl: './../item-page-specific-field.component.html'
})
export class ItemPageAuthorFieldComponent extends ItemPageSpecificFieldComponent {

  @Input() item: Item;

  separator: string;

  fields: string[] = [
    'dc.contributor.author',
    'dc.creator',
    'dc.contributor'
  ];

  label = 'item.page.author';

}
