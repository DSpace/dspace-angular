import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

/**
 * Represents a search result object of a PoolTask object
 */
@searchResultFor(PoolTask, MyDSpaceConfigurationValueType.Workflow)
export class PoolTaskMyDSpaceResult extends SearchResult<PoolTask> {
}
