import * as tslib_1 from "tslib";
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { MetadataRepresentationType } from '../../../../../core/shared/metadata-representation/metadata-representation.model';
var PersonMetadataListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PersonMetadataListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Person
     */
    function PersonMetadataListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PersonMetadataListElementComponent = tslib_1.__decorate([
        rendersItemType('Person', ItemViewMode.Element, MetadataRepresentationType.Item),
        Component({
            selector: 'ds-person-metadata-list-element',
            templateUrl: './person-metadata-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Person
         */
    ], PersonMetadataListElementComponent);
    return PersonMetadataListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { PersonMetadataListElementComponent };
//# sourceMappingURL=person-metadata-list-element.component.js.map