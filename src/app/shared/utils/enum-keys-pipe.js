import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var EnumKeysPipe = /** @class */ (function () {
    /**
     * Pipe for parsing all values of an enumeration to an array of key-value pairs
     */
    function EnumKeysPipe() {
    }
    /**
     * @param value An enumeration
     * @returns {any} Array with all keys and values of the input enumeration
     */
    EnumKeysPipe.prototype.transform = function (value) {
        var keys = [];
        for (var enumMember in value) {
            if (!isNaN(parseInt(enumMember, 10))) {
                keys.push({ key: +enumMember, value: value[enumMember] });
            }
            else {
                keys.push({ key: enumMember, value: value[enumMember] });
            }
        }
        return keys;
    };
    EnumKeysPipe = tslib_1.__decorate([
        Pipe({ name: 'dsKeys' })
        /**
         * Pipe for parsing all values of an enumeration to an array of key-value pairs
         */
    ], EnumKeysPipe);
    return EnumKeysPipe;
}());
export { EnumKeysPipe };
//# sourceMappingURL=enum-keys-pipe.js.map