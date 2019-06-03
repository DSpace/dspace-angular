import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { IntegrationModel } from './integration.model';
import { mapsTo } from '../../cache/builders/build-decorators';
import { AuthorityValue } from './authority.value';
/**
 * Normalized model class for an Authority Value
 */
var NormalizedAuthorityValue = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedAuthorityValue, _super);
    function NormalizedAuthorityValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthorityValue.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthorityValue.prototype, "display", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthorityValue.prototype, "value", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], NormalizedAuthorityValue.prototype, "otherInformation", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthorityValue.prototype, "language", void 0);
    NormalizedAuthorityValue = tslib_1.__decorate([
        mapsTo(AuthorityValue),
        inheritSerialization(IntegrationModel)
    ], NormalizedAuthorityValue);
    return NormalizedAuthorityValue;
}(IntegrationModel));
export { NormalizedAuthorityValue };
//# sourceMappingURL=normalized-authority-value.model.js.map