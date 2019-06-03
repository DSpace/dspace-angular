/**
 * Represents a search filter
 */
import { hasValue } from '../shared/empty.util';
var SearchFilter = /** @class */ (function () {
    function SearchFilter(key, values, operator) {
        this.key = key;
        this.values = values;
        if (hasValue(operator)) {
            this.operator = operator;
        }
        else {
            this.operator = 'query';
        }
    }
    return SearchFilter;
}());
export { SearchFilter };
//# sourceMappingURL=search-filter.model.js.map