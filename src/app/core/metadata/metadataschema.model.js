import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
var MetadataSchema = /** @class */ (function () {
    function MetadataSchema() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], MetadataSchema.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataSchema.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataSchema.prototype, "prefix", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataSchema.prototype, "namespace", void 0);
    return MetadataSchema;
}());
export { MetadataSchema };
//# sourceMappingURL=metadataschema.model.js.map