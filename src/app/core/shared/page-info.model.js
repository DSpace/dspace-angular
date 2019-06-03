import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs } from 'cerialize';
/**
 * Represents the state of a paginated response
 */
var PageInfo = /** @class */ (function () {
    function PageInfo() {
    }
    tslib_1.__decorate([
        autoserializeAs(Number, 'size'),
        tslib_1.__metadata("design:type", Number)
    ], PageInfo.prototype, "elementsPerPage", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], PageInfo.prototype, "totalElements", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], PageInfo.prototype, "totalPages", void 0);
    tslib_1.__decorate([
        autoserializeAs(Number, 'number'),
        tslib_1.__metadata("design:type", Number)
    ], PageInfo.prototype, "currentPage", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], PageInfo.prototype, "last", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], PageInfo.prototype, "next", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], PageInfo.prototype, "prev", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], PageInfo.prototype, "first", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], PageInfo.prototype, "self", void 0);
    return PageInfo;
}());
export { PageInfo };
//# sourceMappingURL=page-info.model.js.map