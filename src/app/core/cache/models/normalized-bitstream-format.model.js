import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { BitstreamFormat } from '../../shared/bitstream-format.model';
import { mapsTo } from '../builders/build-decorators';
import { IDToUUIDSerializer } from '../id-to-uuid-serializer';
import { NormalizedObject } from './normalized-object.model';
import { SupportLevel } from './support-level.model';
/**
 * Normalized model class for a Bitstream Format
 */
var NormalizedBitstreamFormat = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedBitstreamFormat, _super);
    function NormalizedBitstreamFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstreamFormat.prototype, "shortDescription", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstreamFormat.prototype, "description", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstreamFormat.prototype, "mimetype", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedBitstreamFormat.prototype, "supportLevel", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedBitstreamFormat.prototype, "internal", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstreamFormat.prototype, "extensions", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstreamFormat.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserializeAs(new IDToUUIDSerializer('bitstream-format'), 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstreamFormat.prototype, "uuid", void 0);
    NormalizedBitstreamFormat = tslib_1.__decorate([
        mapsTo(BitstreamFormat),
        inheritSerialization(NormalizedObject)
    ], NormalizedBitstreamFormat);
    return NormalizedBitstreamFormat;
}(NormalizedObject));
export { NormalizedBitstreamFormat };
//# sourceMappingURL=normalized-bitstream-format.model.js.map