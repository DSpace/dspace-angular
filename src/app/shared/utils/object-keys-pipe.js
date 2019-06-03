import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var ObjectKeysPipe = /** @class */ (function () {
    /**
     * Pipe for parsing all keys of an object to an array of key-value pairs
     */
    function ObjectKeysPipe() {
    }
    /**
     * @param value An object
     * @returns {any} Array with all keys the input object
     */
    ObjectKeysPipe.prototype.transform = function (value, args) {
        var keys = [];
        Object.keys(value).forEach(function (k) { return keys.push(k); });
        return keys;
    };
    ObjectKeysPipe = tslib_1.__decorate([
        Pipe({ name: 'dsObjectKeys' })
        /**
         * Pipe for parsing all keys of an object to an array of key-value pairs
         */
    ], ObjectKeysPipe);
    return ObjectKeysPipe;
}());
export { ObjectKeysPipe };
//# sourceMappingURL=object-keys-pipe.js.map