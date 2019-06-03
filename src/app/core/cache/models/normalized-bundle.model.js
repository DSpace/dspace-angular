import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { Bundle } from '../../shared/bundle.model';
import { mapsTo, relationship } from '../builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
/**
 * Normalized model class for a DSpace Bundle
 */
var NormalizedBundle = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedBundle, _super);
    function NormalizedBundle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Bitstream, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedBundle.prototype, "primaryBitstream", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Bitstream, true),
        tslib_1.__metadata("design:type", Array)
    ], NormalizedBundle.prototype, "bitstreams", void 0);
    NormalizedBundle = tslib_1.__decorate([
        mapsTo(Bundle),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedBundle);
    return NormalizedBundle;
}(NormalizedDSpaceObject));
export { NormalizedBundle };
//# sourceMappingURL=normalized-bundle.model.js.map