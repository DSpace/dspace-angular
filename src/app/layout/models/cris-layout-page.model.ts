import { Component, Input } from '@angular/core';
import { Item } from '../../core/shared/item.model';

/**
 * This class is a model to be extended for creating custom layouts for pages
 */
@Component({
  template: ''
})
export abstract class CrisLayoutPageModelComponent {
  /**
   * DSpace Item to render
   */
  @Input() item: Item;
}
