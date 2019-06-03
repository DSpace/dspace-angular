import * as tslib_1 from "tslib";
import { isNotUndefined } from '../../../shared/empty.util';
import { URLCombiner } from '../../url-combiner/url-combiner';
/**
 * Combines a variable number of strings representing parts
 * of a JSON-PATCH path
 */
var JsonPatchOperationPathCombiner = /** @class */ (function (_super) {
    tslib_1.__extends(JsonPatchOperationPathCombiner, _super);
    function JsonPatchOperationPathCombiner(rootElement) {
        var subRootElements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            subRootElements[_i - 1] = arguments[_i];
        }
        var _this = _super.apply(this, [rootElement].concat(subRootElements)) || this;
        _this._rootElement = rootElement;
        _this._subRootElement = subRootElements.join('/');
        return _this;
    }
    Object.defineProperty(JsonPatchOperationPathCombiner.prototype, "rootElement", {
        get: function () {
            return this._rootElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonPatchOperationPathCombiner.prototype, "subRootElement", {
        get: function () {
            return this._subRootElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Combines the parts of this JsonPatchOperationPathCombiner in to a JSON-PATCH path member
     *
     * e.g.   new JsonPatchOperationPathCombiner('sections', 'basic').getPath(['dc.title', '0'])
     * returns: {rootElement: 'sections', subRootElement: 'basic', path: '/sections/basic/dc.title/0'}
     *
     * @return {JsonPatchOperationPathObject}
     *      The combined path object
     */
    JsonPatchOperationPathCombiner.prototype.getPath = function (fragment) {
        if (isNotUndefined(fragment) && Array.isArray(fragment)) {
            fragment = fragment.join('/');
        }
        var path = '/' + this.toString();
        if (isNotUndefined(fragment)) {
            path += '/' + fragment;
        }
        return { rootElement: this._rootElement, subRootElement: this._subRootElement, path: path };
    };
    return JsonPatchOperationPathCombiner;
}(URLCombiner));
export { JsonPatchOperationPathCombiner };
//# sourceMappingURL=json-patch-operation-path-combiner.js.map