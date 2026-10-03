import {
  Directive,
  Input,
} from '@angular/core';

import { Item } from '../../core/shared/item.model';

/**
 * This class is a model to be extended for creating custom layouts for pages
 */
@Directive()
export abstract class DynamicLayoutPageDirective {
  /**
   * DSpace Item to render
   */
  @Input() item: Item;
}
