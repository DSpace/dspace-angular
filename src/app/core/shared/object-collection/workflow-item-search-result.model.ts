import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { WorkflowItem } from '../../submission/models/workflowitem.model';
import { SearchResult } from '../search/models/search-result.model';

/**
 * Represents a search result object of a WorkflowItem object
 */
@searchResultFor(WorkflowItem)
export class WorkflowItemSearchResult extends SearchResult<WorkflowItem> {
}
