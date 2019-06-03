import * as tslib_1 from "tslib";
import { SearchResult } from '../../../+search-page/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
var ItemSearchResult = /** @class */ (function (_super) {
    tslib_1.__extends(ItemSearchResult, _super);
    function ItemSearchResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemSearchResult = tslib_1.__decorate([
        searchResultFor(Item)
    ], ItemSearchResult);
    return ItemSearchResult;
}(SearchResult));
export { ItemSearchResult };
//# sourceMappingURL=item-search-result.model.js.map