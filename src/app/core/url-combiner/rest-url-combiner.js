import * as tslib_1 from "tslib";
import { URLCombiner } from './url-combiner';
/**
 * Combines a variable number of strings representing parts
 * of a relative REST URL in to a single, absolute REST URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
var RESTURLCombiner = /** @class */ (function (_super) {
    tslib_1.__extends(RESTURLCombiner, _super);
    function RESTURLCombiner(EnvConfig) {
        var parts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parts[_i - 1] = arguments[_i];
        }
        return _super.apply(this, [EnvConfig.rest.baseUrl].concat(parts)) || this;
    }
    return RESTURLCombiner;
}(URLCombiner));
export { RESTURLCombiner };
//# sourceMappingURL=rest-url-combiner.js.map