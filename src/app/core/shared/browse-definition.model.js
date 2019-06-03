import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs } from 'cerialize';
var BrowseDefinition = /** @class */ (function () {
    function BrowseDefinition() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], BrowseDefinition.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], BrowseDefinition.prototype, "metadataBrowse", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], BrowseDefinition.prototype, "sortOptions", void 0);
    tslib_1.__decorate([
        autoserializeAs('order'),
        tslib_1.__metadata("design:type", String)
    ], BrowseDefinition.prototype, "defaultSortOrder", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], BrowseDefinition.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserializeAs('metadata'),
        tslib_1.__metadata("design:type", Array)
    ], BrowseDefinition.prototype, "metadataKeys", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], BrowseDefinition.prototype, "_links", void 0);
    return BrowseDefinition;
}());
export { BrowseDefinition };
//# sourceMappingURL=browse-definition.model.js.map