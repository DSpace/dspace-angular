import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-item-page-author-field',
  templateUrl: '../item-page-field.component.html'
})
export class ItemPageAuthorFieldComponent extends ItemPageFieldComponent {

  @Input() item: Item;

  separator: string;

  fields: string[] = [
    'dc.contributor.author',
    'dc.creator',
    'dc.contributor'
  ];

  label = 'item.page.author';

}
