import * as tslib_1 from "tslib";
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
/**
 * Represents a search result object of a Workflowitem object
 */
var WorkflowitemMyDSpaceResult = /** @class */ (function (_super) {
    tslib_1.__extends(WorkflowitemMyDSpaceResult, _super);
    function WorkflowitemMyDSpaceResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkflowitemMyDSpaceResult = tslib_1.__decorate([
        searchResultFor(Workflowitem, MyDSpaceConfigurationValueType.Workspace)
    ], WorkflowitemMyDSpaceResult);
    return WorkflowitemMyDSpaceResult;
}(SearchResult));
export { WorkflowitemMyDSpaceResult };
//# sourceMappingURL=workflowitem-my-dspace-result.model.js.map