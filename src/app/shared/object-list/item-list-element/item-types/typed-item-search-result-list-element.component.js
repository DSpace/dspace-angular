import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { hasValue } from '../../../empty.util';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { MetadataMap } from '../../../../core/shared/metadata.models';
/**
 * A generic component for displaying item list elements
 */
var TypedItemSearchResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(TypedItemSearchResultListElementComponent, _super);
    function TypedItemSearchResultListElementComponent(truncatableService, obj) {
        var _this = _super.call(this, undefined, truncatableService) || this;
        _this.truncatableService = truncatableService;
        _this.obj = obj;
        if (hasValue(obj.indexableObject)) {
            _this.object = obj;
            _this.dso = _this.object.indexableObject;
        }
        else {
            _this.object = {
                indexableObject: obj,
                hitHighlights: new MetadataMap()
            };
            _this.dso = obj;
        }
        _this.item = _this.dso;
        return _this;
    }
    TypedItemSearchResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-search-result',
            template: ''
        }),
        tslib_1.__param(1, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [TruncatableService, Object])
    ], TypedItemSearchResultListElementComponent);
    return TypedItemSearchResultListElementComponent;
}(SearchResultListElementComponent));
export { TypedItemSearchResultListElementComponent };
//# sourceMappingURL=typed-item-search-result-list-element.component.js.map