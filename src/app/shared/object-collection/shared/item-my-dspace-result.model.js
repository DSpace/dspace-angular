import * as tslib_1 from "tslib";
import { Item } from '../../../core/shared/item.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';
/**
 * Represents a search result object of a Item object
 */
var ItemMyDSpaceResult = /** @class */ (function (_super) {
    tslib_1.__extends(ItemMyDSpaceResult, _super);
    function ItemMyDSpaceResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemMyDSpaceResult = tslib_1.__decorate([
        searchResultFor(Item, MyDSpaceConfigurationValueType.Workspace)
    ], ItemMyDSpaceResult);
    return ItemMyDSpaceResult;
}(SearchResult));
export { ItemMyDSpaceResult };
//# sourceMappingURL=item-my-dspace-result.model.js.map