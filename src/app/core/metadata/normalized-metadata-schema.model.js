import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { mapsTo } from '../cache/builders/build-decorators';
import { MetadataSchema } from './metadataschema.model';
/**
 * Normalized class for a DSpace MetadataSchema
 */
var NormalizedMetadataSchema = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedMetadataSchema, _super);
    function NormalizedMetadataSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedMetadataSchema.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedMetadataSchema.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedMetadataSchema.prototype, "prefix", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedMetadataSchema.prototype, "namespace", void 0);
    NormalizedMetadataSchema = tslib_1.__decorate([
        mapsTo(MetadataSchema)
    ], NormalizedMetadataSchema);
    return NormalizedMetadataSchema;
}(NormalizedObject));
export { NormalizedMetadataSchema };
//# sourceMappingURL=normalized-metadata-schema.model.js.map