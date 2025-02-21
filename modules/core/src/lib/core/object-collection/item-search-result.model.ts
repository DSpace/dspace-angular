import { GenericConstructor } from '../shared/generic-constructor';
import { Item } from '../shared/item.model';
import { SearchResult } from '../shared/search/models/search-result.model';
import { inheritEquatable } from '../utilities/equals.decorators';
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
