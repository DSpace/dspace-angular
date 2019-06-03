import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ResourcePolicy } from '../../shared/resource-policy.model';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedObject } from './normalized-object.model';
import { IDToUUIDSerializer } from '../id-to-uuid-serializer';
import { ActionType } from './action-type.model';
/**
 * Normalized model class for a Resource Policy
 */
var NormalizedResourcePolicy = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedResourcePolicy, _super);
    function NormalizedResourcePolicy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedResourcePolicy.prototype, "action", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedResourcePolicy.prototype, "name", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedResourcePolicy.prototype, "groupUUID", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedResourcePolicy.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserializeAs(new IDToUUIDSerializer('resource-policy'), 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedResourcePolicy.prototype, "uuid", void 0);
    NormalizedResourcePolicy = tslib_1.__decorate([
        mapsTo(ResourcePolicy),
        inheritSerialization(NormalizedObject)
    ], NormalizedResourcePolicy);
    return NormalizedResourcePolicy;
}(NormalizedObject));
export { NormalizedResourcePolicy };
//# sourceMappingURL=normalized-resource-policy.model.js.map