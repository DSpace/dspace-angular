import * as tslib_1 from "tslib";
import { isNotEmpty } from '../shared/empty.util';
import { SearchOptions } from './search-options.model';
/**
 * This model class represents all parameters needed to request information about a certain page of a search request, in a certain order
 */
var PaginatedSearchOptions = /** @class */ (function (_super) {
    tslib_1.__extends(PaginatedSearchOptions, _super);
    function PaginatedSearchOptions(options) {
        var _this = _super.call(this, options) || this;
        _this.pagination = options.pagination;
        _this.sort = options.sort;
        return _this;
    }
    /**
     * Method to generate the URL that can be used to request a certain page with specific sort options
     * @param {string} url The URL to the REST endpoint
     * @param {string[]} args A list of query arguments that should be included in the URL
     * @returns {string} URL with all paginated search options and passed arguments as query parameters
     */
    PaginatedSearchOptions.prototype.toRestUrl = function (url, args) {
        if (args === void 0) { args = []; }
        if (isNotEmpty(this.sort)) {
            args.push("sort=" + this.sort.field + "," + this.sort.direction);
        }
        if (isNotEmpty(this.pagination)) {
            args.push("page=" + (this.pagination.currentPage - 1));
            args.push("size=" + this.pagination.pageSize);
        }
        return _super.prototype.toRestUrl.call(this, url, args);
    };
    return PaginatedSearchOptions;
}(SearchOptions));
export { PaginatedSearchOptions };
//# sourceMappingURL=paginated-search-options.model.js.map