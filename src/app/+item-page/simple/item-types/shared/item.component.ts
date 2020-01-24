import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent {
  @Input() object: Item;
}
