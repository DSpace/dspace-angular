import * as tslib_1 from "tslib";
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { MetadataRepresentationType } from '../../../../../core/shared/metadata-representation/metadata-representation.model';
var OrgUnitMetadataListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(OrgUnitMetadataListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type OrgUnit
     */
    function OrgUnitMetadataListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrgUnitMetadataListElementComponent = tslib_1.__decorate([
        rendersItemType('OrgUnit', ItemViewMode.Element, MetadataRepresentationType.Item),
        Component({
            selector: 'ds-orgunit-metadata-list-element',
            templateUrl: './orgunit-metadata-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type OrgUnit
         */
    ], OrgUnitMetadataListElementComponent);
    return OrgUnitMetadataListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { OrgUnitMetadataListElementComponent };
//# sourceMappingURL=orgunit-metadata-list-element.component.js.map