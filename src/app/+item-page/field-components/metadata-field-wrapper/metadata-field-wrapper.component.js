import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { hasNoValue } from '../../../shared/empty.util';
/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
var MetadataFieldWrapperComponent = /** @class */ (function () {
    function MetadataFieldWrapperComponent() {
    }
    /**
     * Make hasNoValue() available in the template
     */
    MetadataFieldWrapperComponent.prototype.hasNoValue = function (o) {
        return hasNoValue(o);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MetadataFieldWrapperComponent.prototype, "label", void 0);
    MetadataFieldWrapperComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-field-wrapper',
            styleUrls: ['./metadata-field-wrapper.component.scss'],
            templateUrl: './metadata-field-wrapper.component.html'
        })
    ], MetadataFieldWrapperComponent);
    return MetadataFieldWrapperComponent;
}());
export { MetadataFieldWrapperComponent };
//# sourceMappingURL=metadata-field-wrapper.component.js.map