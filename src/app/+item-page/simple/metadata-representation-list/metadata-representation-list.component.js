import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ItemViewMode } from '../../../shared/items/item-type-decorator';
var MetadataRepresentationListComponent = /** @class */ (function () {
    function MetadataRepresentationListComponent() {
        /**
         * The view-mode we're currently on
         * @type {ElementViewMode}
         */
        this.viewMode = ItemViewMode.Metadata;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], MetadataRepresentationListComponent.prototype, "representations", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MetadataRepresentationListComponent.prototype, "label", void 0);
    MetadataRepresentationListComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-representation-list',
            templateUrl: './metadata-representation-list.component.html'
        })
        /**
         * This component is used for displaying metadata
         * It expects a list of MetadataRepresentation objects and a label to put on top of the list
         */
    ], MetadataRepresentationListComponent);
    return MetadataRepresentationListComponent;
}());
export { MetadataRepresentationListComponent };
//# sourceMappingURL=metadata-representation-list.component.js.map