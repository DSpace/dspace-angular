import * as tslib_1 from "tslib";
import { URLCombiner } from './url-combiner';
/**
 * Combines a variable number of strings representing parts
 * of a relative UI URL in to a single, absolute UI URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
var UIURLCombiner = /** @class */ (function (_super) {
    tslib_1.__extends(UIURLCombiner, _super);
    function UIURLCombiner(EnvConfig) {
        var parts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parts[_i - 1] = arguments[_i];
        }
        return _super.apply(this, [EnvConfig.ui.baseUrl].concat(parts)) || this;
    }
    return UIURLCombiner;
}(URLCombiner));
export { UIURLCombiner };
//# sourceMappingURL=ui-url-combiner.js.map