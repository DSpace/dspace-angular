import { Input } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';

/**
 * This class is a model to be extended for creating custom layouts for pages
 */
export class CrisLayoutPage {
  /**
   * DSpace Item to render
   */
  @Input() item: Item;
}
