import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
var SelfLink = /** @class */ (function () {
    function SelfLink() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SelfLink.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SelfLink.prototype, "uuid", void 0);
    return SelfLink;
}());
export { SelfLink };
//# sourceMappingURL=self-link.model.js.map