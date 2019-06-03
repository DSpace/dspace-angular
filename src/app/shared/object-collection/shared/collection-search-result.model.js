import * as tslib_1 from "tslib";
import { SearchResult } from '../../../+search-page/search-result.model';
import { Collection } from '../../../core/shared/collection.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
var CollectionSearchResult = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionSearchResult, _super);
    function CollectionSearchResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectionSearchResult = tslib_1.__decorate([
        searchResultFor(Collection)
    ], CollectionSearchResult);
    return CollectionSearchResult;
}(SearchResult));
export { CollectionSearchResult };
//# sourceMappingURL=collection-search-result.model.js.map