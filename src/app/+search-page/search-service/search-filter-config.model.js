import * as tslib_1 from "tslib";
import { FilterType } from './filter-type.model';
import { autoserialize, autoserializeAs } from 'cerialize';
/**
 * The configuration for a search filter
 */
var SearchFilterConfig = /** @class */ (function () {
    function SearchFilterConfig() {
        /**
         * @type {number} The page size used for this facet
         */
        this.pageSize = 5;
    }
    Object.defineProperty(SearchFilterConfig.prototype, "paramName", {
        /**
         * Name of this configuration that can be used in a url
         * @returns Parameter name
         */
        get: function () {
            return 'f.' + this.name;
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchFilterConfig.prototype, "name", void 0);
    tslib_1.__decorate([
        autoserializeAs(String, 'facetType'),
        tslib_1.__metadata("design:type", String)
    ], SearchFilterConfig.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], SearchFilterConfig.prototype, "hasFacets", void 0);
    tslib_1.__decorate([
        autoserializeAs(String, 'facetLimit'),
        tslib_1.__metadata("design:type", Object)
    ], SearchFilterConfig.prototype, "pageSize", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], SearchFilterConfig.prototype, "isOpenByDefault", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchFilterConfig.prototype, "maxValue", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchFilterConfig.prototype, "minValue", void 0);
    return SearchFilterConfig;
}());
export { SearchFilterConfig };
//# sourceMappingURL=search-filter-config.model.js.map