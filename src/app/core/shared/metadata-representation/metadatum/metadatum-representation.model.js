import * as tslib_1 from "tslib";
import { MetadataRepresentationType } from '../metadata-representation.model';
import { hasValue } from '../../../../shared/empty.util';
import { MetadataValue } from '../../metadata.models';
/**
 * This class defines the way the metadatum it extends should be represented
 */
var MetadatumRepresentation = /** @class */ (function (_super) {
    tslib_1.__extends(MetadatumRepresentation, _super);
    function MetadatumRepresentation(itemType) {
        var _this = _super.call(this) || this;
        _this.itemType = itemType;
        return _this;
    }
    Object.defineProperty(MetadatumRepresentation.prototype, "representationType", {
        /**
         * Fetch the way this metadatum should be rendered as in a list
         */
        get: function () {
            if (hasValue(this.authority)) {
                return MetadataRepresentationType.AuthorityControlled;
            }
            else {
                return MetadataRepresentationType.PlainText;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the value to display
     */
    MetadatumRepresentation.prototype.getValue = function () {
        return this.value;
    };
    return MetadatumRepresentation;
}(MetadataValue));
export { MetadatumRepresentation };
//# sourceMappingURL=metadatum-representation.model.js.map