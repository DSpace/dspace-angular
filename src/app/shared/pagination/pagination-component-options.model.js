import * as tslib_1 from "tslib";
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
var PaginationComponentOptions = /** @class */ (function (_super) {
    tslib_1.__extends(PaginationComponentOptions, _super);
    function PaginationComponentOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The active page.
         */
        _this.currentPage = 1;
        /**
         * Maximum number of pages to display.
         */
        _this.maxSize = 10;
        /**
         * A number array that represents options for a context pagination limit.
         */
        _this.pageSizeOptions = [1, 5, 10, 20, 40, 60, 80, 100];
        return _this;
    }
    return PaginationComponentOptions;
}(NgbPaginationConfig));
export { PaginationComponentOptions };
//# sourceMappingURL=pagination-component-options.model.js.map