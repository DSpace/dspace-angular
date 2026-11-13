import { Process } from '@dspace/core/processes/process.model';

import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { SearchResult } from '../search/models/search-result.model';

/**
 * Represents a search result object of a Process object
 */
@searchResultFor(Process)
export class ProcessSearchResult extends SearchResult<Process> {
}
