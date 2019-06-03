import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var CapitalizePipe = /** @class */ (function () {
    /**
     * Pipe for capizalizing a string
     */
    function CapitalizePipe() {
    }
    /**
     * @param {string} value String to be capitalized
     * @returns {string} Capitalized version of the input value
     */
    CapitalizePipe.prototype.transform = function (value) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    };
    CapitalizePipe = tslib_1.__decorate([
        Pipe({
            name: 'dsCapitalize'
        })
        /**
         * Pipe for capizalizing a string
         */
    ], CapitalizePipe);
    return CapitalizePipe;
}());
export { CapitalizePipe };
//# sourceMappingURL=capitalize.pipe.js.map