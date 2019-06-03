import * as tslib_1 from "tslib";
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { SearchResult } from '../../../+search-page/search-result.model';
/**
 * Represents a search result object of a Workspaceitem object
 */
var WorkspaceitemMyDSpaceResult = /** @class */ (function (_super) {
    tslib_1.__extends(WorkspaceitemMyDSpaceResult, _super);
    function WorkspaceitemMyDSpaceResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkspaceitemMyDSpaceResult = tslib_1.__decorate([
        searchResultFor(Workspaceitem, MyDSpaceConfigurationValueType.Workspace)
    ], WorkspaceitemMyDSpaceResult);
    return WorkspaceitemMyDSpaceResult;
}(SearchResult));
export { WorkspaceitemMyDSpaceResult };
//# sourceMappingURL=workspaceitem-my-dspace-result.model.js.map