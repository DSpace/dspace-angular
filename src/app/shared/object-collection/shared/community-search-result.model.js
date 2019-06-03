import * as tslib_1 from "tslib";
import { Community } from '../../../core/shared/community.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
var CommunitySearchResult = /** @class */ (function (_super) {
    tslib_1.__extends(CommunitySearchResult, _super);
    function CommunitySearchResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommunitySearchResult = tslib_1.__decorate([
        searchResultFor(Community)
    ], CommunitySearchResult);
    return CommunitySearchResult;
}(SearchResult));
export { CommunitySearchResult };
//# sourceMappingURL=community-search-result.model.js.map