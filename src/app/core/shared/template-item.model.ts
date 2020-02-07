import { Item } from './item.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../data/remote-data';
import { Collection } from './collection.model';
import { ResourceType } from './resource-type';

/**
 * Class representing a DSpace Template Item
 */
export class TemplateItem extends Item {
  static type = new ResourceType('itemtemplate');

  /**
   * The Collection that this item is a template for
   */
  templateItemOf: Observable<RemoteData<Collection>>;

}
