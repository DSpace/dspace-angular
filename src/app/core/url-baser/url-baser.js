import { isEmpty } from '../../shared/empty.util';
/**
 * Extracts the base URL
 * from a URL with query parameters
 */
var URLBaser = /** @class */ (function () {
    /**
     * Creates a new URLBaser
     *
     * @param originalURL
     *      a string representing the original URL with possible query parameters
     */
    function URLBaser(originalURL) {
        this.original = originalURL;
    }
    /**
     * Removes the query parameters from the original URL of this URLBaser
     *
     * @return {string}
     *      The base URL
     */
    URLBaser.prototype.toString = function () {
        if (isEmpty(this.original)) {
            return '';
        }
        else {
            var index = this.original.indexOf('?');
            if (index < 0) {
                return this.original;
            }
            else {
                return this.original.substring(0, index);
            }
        }
    };
    return URLBaser;
}());
export { URLBaser };
//# sourceMappingURL=url-baser.js.map