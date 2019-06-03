import * as tslib_1 from "tslib";
import { MetadataSchema } from './metadataschema.model';
import { autoserialize } from 'cerialize';
import { isNotEmpty } from '../../shared/empty.util';
var MetadataField = /** @class */ (function () {
    function MetadataField() {
    }
    MetadataField.prototype.toString = function (separator) {
        if (separator === void 0) { separator = '.'; }
        var key = this.schema.prefix + separator + this.element;
        if (isNotEmpty(this.qualifier)) {
            key += separator + this.qualifier;
        }
        return key;
    };
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], MetadataField.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataField.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataField.prototype, "element", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataField.prototype, "qualifier", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataField.prototype, "scopeNote", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", MetadataSchema)
    ], MetadataField.prototype, "schema", void 0);
    return MetadataField;
}());
export { MetadataField };
//# sourceMappingURL=metadatafield.model.js.map