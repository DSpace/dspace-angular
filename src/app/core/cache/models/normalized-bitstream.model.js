import * as tslib_1 from "tslib";
import { inheritSerialization, autoserialize } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Bitstream } from '../../shared/bitstream.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
/**
 * Normalized model class for a DSpace Bitstream
 */
var NormalizedBitstream = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedBitstream, _super);
    function NormalizedBitstream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedBitstream.prototype, "sizeBytes", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstream.prototype, "content", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.BitstreamFormat, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstream.prototype, "format", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstream.prototype, "description", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Item, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedBitstream.prototype, "parents", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Item, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstream.prototype, "owner", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedBitstream.prototype, "bundleName", void 0);
    NormalizedBitstream = tslib_1.__decorate([
        mapsTo(Bitstream),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedBitstream);
    return NormalizedBitstream;
}(NormalizedDSpaceObject));
export { NormalizedBitstream };
//# sourceMappingURL=normalized-bitstream.model.js.map