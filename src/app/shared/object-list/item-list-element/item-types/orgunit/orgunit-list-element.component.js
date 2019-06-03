import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var OrgUnitListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(OrgUnitListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Organisation Unit
     */
    function OrgUnitListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrgUnitListElementComponent = tslib_1.__decorate([
        rendersItemType('OrgUnit', ItemViewMode.Element),
        Component({
            selector: 'ds-orgunit-list-element',
            styleUrls: ['./orgunit-list-element.component.scss'],
            templateUrl: './orgunit-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Organisation Unit
         */
    ], OrgUnitListElementComponent);
    return OrgUnitListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { OrgUnitListElementComponent };
//# sourceMappingURL=orgunit-list-element.component.js.map