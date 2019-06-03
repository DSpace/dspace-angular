import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ITEM } from '../../items/switcher/item-type-switcher.component';
var MetadataRepresentationListElementComponent = /** @class */ (function () {
    function MetadataRepresentationListElementComponent(metadataRepresentation) {
        this.metadataRepresentation = metadataRepresentation;
    }
    MetadataRepresentationListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-representation-list-element',
            template: ''
        })
        /**
         * An abstract class for displaying a single MetadataRepresentation
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], MetadataRepresentationListElementComponent);
    return MetadataRepresentationListElementComponent;
}());
export { MetadataRepresentationListElementComponent };
//# sourceMappingURL=metadata-representation-list-element.component.js.map