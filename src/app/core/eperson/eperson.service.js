import * as tslib_1 from "tslib";
import { DataService } from '../data/data.service';
/**
 * An abstract class that provides methods to make HTTP request to eperson endpoint.
 */
var EpersonService = /** @class */ (function (_super) {
    tslib_1.__extends(EpersonService, _super);
    function EpersonService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EpersonService.prototype.getBrowseEndpoint = function (options) {
        return this.halService.getEndpoint(this.linkPath);
    };
    return EpersonService;
}(DataService));
export { EpersonService };
//# sourceMappingURL=eperson.service.js.map