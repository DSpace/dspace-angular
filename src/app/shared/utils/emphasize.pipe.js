import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var EmphasizePipe = /** @class */ (function () {
    function EmphasizePipe() {
        /**
         * Characters that should be escaped
         */
        this.specials = [
            // order matters for these
            '-',
            '[',
            ']'
            // order doesn't matter for any of these
            ,
            '/',
            '{',
            '}',
            '(',
            ')',
            '*',
            '+',
            '?',
            '.',
            '\\',
            '^',
            '$',
            '|'
        ];
        /**
         * Regular expression for escaping the string we're trying to find
         */
        this.regex = RegExp('[' + this.specials.join('\\') + ']', 'g');
    }
    /**
     *
     * @param haystack The string which we want to partly highlight
     * @param needle The string that should become emphasized in the haystack string
     * @returns {any} Transformed haystack with the needle emphasized
     */
    EmphasizePipe.prototype.transform = function (haystack, needle) {
        var escaped = this.escapeRegExp(needle);
        var reg = new RegExp(escaped, 'gi');
        return haystack.replace(reg, '<em>$&</em>');
    };
    /**
     *
     * @param str Escape special characters in the string we're looking for
     * @returns {any} The escaped version of the input string
     */
    EmphasizePipe.prototype.escapeRegExp = function (str) {
        return str.replace(this.regex, '\\$&');
    };
    EmphasizePipe = tslib_1.__decorate([
        Pipe({ name: 'dsEmphasize' })
        /**
         * Pipe for emphasizing a part of a string by surrounding it with <em> tags
         */
    ], EmphasizePipe);
    return EmphasizePipe;
}());
export { EmphasizePipe };
//# sourceMappingURL=emphasize.pipe.js.map