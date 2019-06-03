import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs } from 'cerialize';
/**
 * Class representing possible values for a certain filter
 */
var FacetValue = /** @class */ (function () {
    function FacetValue() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FacetValue.prototype, "label", void 0);
    tslib_1.__decorate([
        autoserializeAs(String, 'label'),
        tslib_1.__metadata("design:type", String)
    ], FacetValue.prototype, "value", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], FacetValue.prototype, "count", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FacetValue.prototype, "search", void 0);
    return FacetValue;
}());
export { FacetValue };
//# sourceMappingURL=facet-value.model.js.map