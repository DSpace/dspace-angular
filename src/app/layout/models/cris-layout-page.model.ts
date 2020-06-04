import { Input } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';

export class CrisLayoutPage {
  /**
   * DSpace Item to render
   */
  @Input() item: Item;
}
