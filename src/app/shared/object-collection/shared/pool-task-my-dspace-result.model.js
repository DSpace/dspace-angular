import * as tslib_1 from "tslib";
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
/**
 * Represents a search result object of a PoolTask object
 */
var PoolTaskMyDSpaceResult = /** @class */ (function (_super) {
    tslib_1.__extends(PoolTaskMyDSpaceResult, _super);
    function PoolTaskMyDSpaceResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PoolTaskMyDSpaceResult = tslib_1.__decorate([
        searchResultFor(PoolTask, MyDSpaceConfigurationValueType.Workflow)
    ], PoolTaskMyDSpaceResult);
    return PoolTaskMyDSpaceResult;
}(SearchResult));
export { PoolTaskMyDSpaceResult };
//# sourceMappingURL=pool-task-my-dspace-result.model.js.map