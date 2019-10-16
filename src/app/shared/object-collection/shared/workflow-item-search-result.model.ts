import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

/**
 * Represents a search result object of a WorkflowItem object
 */
@searchResultFor(WorkflowItem)
export class WorkflowItemSearchResult extends SearchResult<WorkflowItem> {
}
