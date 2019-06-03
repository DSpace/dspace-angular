import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var PersonListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PersonListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Person
     */
    function PersonListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PersonListElementComponent = tslib_1.__decorate([
        rendersItemType('Person', ItemViewMode.Element),
        Component({
            selector: 'ds-person-list-element',
            styleUrls: ['./person-list-element.component.scss'],
            templateUrl: './person-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Person
         */
    ], PersonListElementComponent);
    return PersonListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { PersonListElementComponent };
//# sourceMappingURL=person-list-element.component.js.map