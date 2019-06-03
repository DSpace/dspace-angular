import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
var IntegrationModel = /** @class */ (function () {
    function IntegrationModel() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], IntegrationModel.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], IntegrationModel.prototype, "uuid", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], IntegrationModel.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], IntegrationModel.prototype, "_links", void 0);
    return IntegrationModel;
}());
export { IntegrationModel };
//# sourceMappingURL=integration.model.js.map