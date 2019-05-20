import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { SearchResult } from '../../../+search-page/search-result.model';

/**
 * Represents a search result object of a Workspaceitem object
 */
@searchResultFor(Workspaceitem, MyDSpaceConfigurationValueType.Workspace)
export class WorkspaceitemMyDSpaceResult extends SearchResult<Workspaceitem> {
}
