import { SearchResult } from '../../../+search-page/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ListableObject } from './listable-object.model';

@searchResultFor(Item)
export class ItemSearchResult extends SearchResult<Item> {

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return this.indexableObject.getRenderTypes().map((type) => {
      if (typeof type === 'string') {
        return type + 'SearchResult'
      } else {
        return this.constructor as GenericConstructor<ListableObject>;
      }
    });
  }
}
