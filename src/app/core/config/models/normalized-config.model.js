import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedObject } from '../../cache/models/normalized-object.model';
import { ResourceType } from '../../shared/resource-type';
/**
 * Normalized abstract class for a configuration object
 */
var NormalizedConfigObject = /** @class */ (function () {
    function NormalizedConfigObject() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedConfigObject.prototype, "name", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedConfigObject.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], NormalizedConfigObject.prototype, "_links", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedConfigObject.prototype, "self", void 0);
    NormalizedConfigObject = tslib_1.__decorate([
        inheritSerialization(NormalizedObject)
    ], NormalizedConfigObject);
    return NormalizedConfigObject;
}());
export { NormalizedConfigObject };
//# sourceMappingURL=normalized-config.model.js.map