import * as tslib_1 from "tslib";
import { DSpaceObject } from '../../shared/dspace-object.model';
var EPerson = /** @class */ (function (_super) {
    tslib_1.__extends(EPerson, _super);
    function EPerson() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(EPerson.prototype, "name", {
        /**
         * Getter to retrieve the EPerson's full name as a string
         */
        get: function () {
            return this.firstMetadataValue('eperson.firstname') + ' ' + this.firstMetadataValue('eperson.lastname');
        },
        enumerable: true,
        configurable: true
    });
    return EPerson;
}(DSpaceObject));
export { EPerson };
//# sourceMappingURL=eperson.model.js.map