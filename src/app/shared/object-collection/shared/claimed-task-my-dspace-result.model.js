import * as tslib_1 from "tslib";
import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
/**
 * Represents a search result object of a ClaimedTask object
 */
var ClaimedTaskMyDSpaceResult = /** @class */ (function (_super) {
    tslib_1.__extends(ClaimedTaskMyDSpaceResult, _super);
    function ClaimedTaskMyDSpaceResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClaimedTaskMyDSpaceResult = tslib_1.__decorate([
        searchResultFor(ClaimedTask, MyDSpaceConfigurationValueType.Workflow)
    ], ClaimedTaskMyDSpaceResult);
    return ClaimedTaskMyDSpaceResult;
}(SearchResult));
export { ClaimedTaskMyDSpaceResult };
//# sourceMappingURL=claimed-task-my-dspace-result.model.js.map