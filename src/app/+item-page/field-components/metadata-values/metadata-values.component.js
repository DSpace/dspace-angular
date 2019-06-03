import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component.
 * It puts the given 'separator' between each two values.
 */
var MetadataValuesComponent = /** @class */ (function () {
    function MetadataValuesComponent() {
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], MetadataValuesComponent.prototype, "mdValues", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MetadataValuesComponent.prototype, "separator", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MetadataValuesComponent.prototype, "label", void 0);
    MetadataValuesComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-values',
            styleUrls: ['./metadata-values.component.scss'],
            templateUrl: './metadata-values.component.html'
        })
    ], MetadataValuesComponent);
    return MetadataValuesComponent;
}());
export { MetadataValuesComponent };
//# sourceMappingURL=metadata-values.component.js.map