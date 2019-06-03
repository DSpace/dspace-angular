import * as tslib_1 from "tslib";
import { AuthStatus } from './auth-status.model';
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedObject } from '../../cache/models/normalized-object.model';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
var NormalizedAuthStatus = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedAuthStatus, _super);
    function NormalizedAuthStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthStatus.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserializeAs(new IDToUUIDSerializer('auth-status'), 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthStatus.prototype, "uuid", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedAuthStatus.prototype, "okay", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedAuthStatus.prototype, "authenticated", void 0);
    tslib_1.__decorate([
        relationship(ResourceType.EPerson, false),
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedAuthStatus.prototype, "eperson", void 0);
    NormalizedAuthStatus = tslib_1.__decorate([
        mapsTo(AuthStatus),
        inheritSerialization(NormalizedObject)
    ], NormalizedAuthStatus);
    return NormalizedAuthStatus;
}(NormalizedObject));
export { NormalizedAuthStatus };
//# sourceMappingURL=normalized-auth-status.model.js.map