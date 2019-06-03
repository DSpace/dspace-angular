import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
import { ResourceType } from '../../shared/resource-type';
/**
 * An abstract model class for a NormalizedObject.
 */
var NormalizedObject = /** @class */ (function () {
    function NormalizedObject() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedObject.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedObject.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], NormalizedObject.prototype, "_links", void 0);
    return NormalizedObject;
}());
export { NormalizedObject };
//# sourceMappingURL=normalized-object.model.js.map