import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { License } from '../../shared/license.model';
/**
 * Normalized model class for a Collection License
 */
var NormalizedLicense = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedLicense, _super);
    function NormalizedLicense() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedLicense.prototype, "custom", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedLicense.prototype, "text", void 0);
    NormalizedLicense = tslib_1.__decorate([
        mapsTo(License),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedLicense);
    return NormalizedLicense;
}(NormalizedDSpaceObject));
export { NormalizedLicense };
//# sourceMappingURL=normalized-license.model.js.map