import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs } from 'cerialize';
import { PageInfo } from '../../core/shared/page-info.model';
import { NormalizedSearchResult } from '../normalized-search-result.model';
/**
 * Class representing the response returned by the server when performing a search request
 */
var SearchQueryResponse = /** @class */ (function () {
    function SearchQueryResponse() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "scope", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "query", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], SearchQueryResponse.prototype, "appliedFilters", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], SearchQueryResponse.prototype, "sort", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "configuration", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "type", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", PageInfo)
    ], SearchQueryResponse.prototype, "page", void 0);
    tslib_1.__decorate([
        autoserializeAs(NormalizedSearchResult),
        tslib_1.__metadata("design:type", Array)
    ], SearchQueryResponse.prototype, "objects", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], SearchQueryResponse.prototype, "facets", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "self", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "next", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "previous", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "first", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], SearchQueryResponse.prototype, "last", void 0);
    return SearchQueryResponse;
}());
export { SearchQueryResponse };
//# sourceMappingURL=search-query-response.model.js.map