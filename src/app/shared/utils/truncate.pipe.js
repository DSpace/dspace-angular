import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
import { hasValue } from '../empty.util';
/**
 * Pipe to truncate a value in Angular. (Take a substring, starting at 0)
 * Default value: 10
 */
var TruncatePipe = /** @class */ (function () {
    function TruncatePipe() {
    }
    /**
     *
     */
    TruncatePipe.prototype.transform = function (value, args) {
        if (hasValue(value)) {
            var limit = (args && args.length > 0) ? parseInt(args[0], 10) : 10; // 10 as default truncate value
            return value.length > limit ? value.substring(0, limit) + '...' : value;
        }
        else {
            return value;
        }
    };
    TruncatePipe = tslib_1.__decorate([
        Pipe({
            name: 'dsTruncate'
        })
    ], TruncatePipe);
    return TruncatePipe;
}());
export { TruncatePipe };
//# sourceMappingURL=truncate.pipe.js.map