import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs } from 'cerialize';
var BrowseEntry = /** @class */ (function () {
    function BrowseEntry() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], BrowseEntry.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], BrowseEntry.prototype, "authority", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], BrowseEntry.prototype, "value", void 0);
    tslib_1.__decorate([
        autoserializeAs('valueLang'),
        tslib_1.__metadata("design:type", String)
    ], BrowseEntry.prototype, "language", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], BrowseEntry.prototype, "count", void 0);
    return BrowseEntry;
}());
export { BrowseEntry };
//# sourceMappingURL=browse-entry.model.js.map