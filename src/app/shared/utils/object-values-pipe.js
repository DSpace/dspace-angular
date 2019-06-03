import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var ObjectValuesPipe = /** @class */ (function () {
    /**
     * Pipe for parsing all values of an object to an array of values
     */
    function ObjectValuesPipe() {
    }
    /**
     * @param value An object
     * @returns {any} Array with all values of the input object
     */
    ObjectValuesPipe.prototype.transform = function (value, args) {
        var values = [];
        Object.values(value).forEach(function (v) { return values.push(v); });
        return values;
    };
    ObjectValuesPipe = tslib_1.__decorate([
        Pipe({ name: 'dsObjectValues' })
        /**
         * Pipe for parsing all values of an object to an array of values
         */
    ], ObjectValuesPipe);
    return ObjectValuesPipe;
}());
export { ObjectValuesPipe };
//# sourceMappingURL=object-values-pipe.js.map