import { MyDSpaceResult } from '../../../+my-dspace-page/my-dspace-result.model';
import { Item } from '../../../core/shared/item.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { MyDSpaceConfigurationType } from '../../../+my-dspace-page/mydspace-configuration-type';

@searchResultFor(Item, MyDSpaceConfigurationType.Workspace)
export class ItemMyDSpaceResult extends SearchResult<Item> {
}
