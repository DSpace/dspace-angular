import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { MetadataValuesComponent } from '../metadata-values/metadata-values.component';
/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component as a link.
 * It puts the given 'separator' between each two values
 * and creates an 'a' tag for each value,
 * using the 'linktext' as it's value (if it exists)
 * and using the values as the 'href' attribute (and as value of the tag when no 'linktext' is defined)
 */
var MetadataUriValuesComponent = /** @class */ (function (_super) {
    tslib_1.__extends(MetadataUriValuesComponent, _super);
    function MetadataUriValuesComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], MetadataUriValuesComponent.prototype, "linktext", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], MetadataUriValuesComponent.prototype, "mdValues", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MetadataUriValuesComponent.prototype, "separator", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MetadataUriValuesComponent.prototype, "label", void 0);
    MetadataUriValuesComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-uri-values',
            styleUrls: ['./metadata-uri-values.component.scss'],
            templateUrl: './metadata-uri-values.component.html'
        })
    ], MetadataUriValuesComponent);
    return MetadataUriValuesComponent;
}(MetadataValuesComponent));
export { MetadataUriValuesComponent };
//# sourceMappingURL=metadata-uri-values.component.js.map