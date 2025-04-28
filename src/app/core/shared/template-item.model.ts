import { inheritSerialization } from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../cache/builders/build-decorators';
import { RemoteData } from '../data/remote-data';
import { Collection } from './collection.model';
import { COLLECTION } from './collection.resource-type';
import { Item } from './item.model';
import { ITEM_TEMPLATE } from './template-item.resource-type';

/**
 * Class representing a DSpace Template Item
 */
@typedObject
@inheritSerialization(Item)
export class TemplateItem extends Item {
  static type = ITEM_TEMPLATE;

  /**
   * The Collection that this item is a template for
   */
  @link(COLLECTION)
  templateItemOf: Observable<RemoteData<Collection>>;

}
