import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { Item } from '../../../core/shared/item.model';
import { inheritEquatable } from '../../../core/utilities/equals.decorators';
import { SearchResult } from '../../search/models/search-result.model';
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
