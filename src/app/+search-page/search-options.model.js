import { isNotEmpty } from '../shared/empty.util';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import 'core-js/library/fn/object/entries';
import { SetViewMode } from '../shared/view-mode';
/**
 * This model class represents all parameters needed to request information about a certain search request
 */
var SearchOptions = /** @class */ (function () {
    function SearchOptions(options) {
        this.view = SetViewMode.List;
        this.configuration = options.configuration;
        this.scope = options.scope;
        this.query = options.query;
        this.dsoType = options.dsoType;
        this.filters = options.filters;
        this.fixedFilter = options.fixedFilter;
    }
    /**
     * Method to generate the URL that can be used request information about a search request
     * @param {string} url The URL to the REST endpoint
     * @param {string[]} args A list of query arguments that should be included in the URL
     * @returns {string} URL with all search options and passed arguments as query parameters
     */
    SearchOptions.prototype.toRestUrl = function (url, args) {
        if (args === void 0) { args = []; }
        if (isNotEmpty(this.configuration)) {
            args.push("configuration=" + this.configuration);
        }
        if (isNotEmpty(this.fixedFilter)) {
            args.push(this.fixedFilter);
        }
        if (isNotEmpty(this.query)) {
            args.push("query=" + this.query);
        }
        if (isNotEmpty(this.scope)) {
            args.push("scope=" + this.scope);
        }
        if (isNotEmpty(this.dsoType)) {
            args.push("dsoType=" + this.dsoType);
        }
        if (isNotEmpty(this.filters)) {
            this.filters.forEach(function (filter) {
                filter.values.forEach(function (value) {
                    var filterValue = value.includes(',') ? "" + value : value + "," + filter.operator;
                    args.push(filter.key + "=" + filterValue);
                });
            });
        }
        if (isNotEmpty(args)) {
            url = new URLCombiner(url, "?" + args.join('&')).toString();
        }
        return url;
    };
    return SearchOptions;
}());
export { SearchOptions };
//# sourceMappingURL=search-options.model.js.map