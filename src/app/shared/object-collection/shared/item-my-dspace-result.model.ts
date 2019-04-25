import { Item } from '../../../core/shared/item.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';

/**
 * Represents a search result object of a Item object
 */
@searchResultFor(Item, MyDSpaceConfigurationValueType.Workspace)
export class ItemMyDSpaceResult extends SearchResult<Item> {
}
