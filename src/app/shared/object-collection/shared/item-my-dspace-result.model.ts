import { Item } from '../../../core/shared/item.model';
import { SearchResult } from '../../search/search-result.model';
import { searchResultFor } from '../../search/search-result-element-decorator';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';

/**
 * Represents a search result object of a Item object
 */
@searchResultFor(Item, MyDSpaceConfigurationValueType.Workspace)
export class ItemMyDSpaceResult extends SearchResult<Item> {
}
