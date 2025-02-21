import { GenericConstructor } from '../shared';
import { Item } from '../shared';
import { SearchResult } from '../shared';
import { inheritEquatable } from '../utilities';
import { ListableObject } from './listable-object.model';

@inheritEquatable(SearchResult)
export class ItemSearchResult extends SearchResult<Item> {

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return this.indexableObject.getRenderTypes().map((type) => {
      if (typeof type === 'string') {
        return type + 'SearchResult';
      } else {
        return this.constructor as GenericConstructor<ListableObject>;
      }
    });
  }
}
