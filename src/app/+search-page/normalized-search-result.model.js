import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
import { MetadataMap } from '../core/shared/metadata.models';
/**
 * Represents a normalized version of a search result object of a certain DSpaceObject
 */
var NormalizedSearchResult = /** @class */ (function () {
    function NormalizedSearchResult() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedSearchResult.prototype, "indexableObject", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", MetadataMap)
    ], NormalizedSearchResult.prototype, "hitHighlights", void 0);
    return NormalizedSearchResult;
}());
export { NormalizedSearchResult };
//# sourceMappingURL=normalized-search-result.model.js.map