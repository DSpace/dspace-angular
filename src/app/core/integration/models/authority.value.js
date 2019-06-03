import * as tslib_1 from "tslib";
import { IntegrationModel } from './integration.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
/**
 * Class representing an authority object
 */
var AuthorityValue = /** @class */ (function (_super) {
    tslib_1.__extends(AuthorityValue, _super);
    function AuthorityValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * This method checks if authority has an identifier value
     *
     * @return boolean
     */
    AuthorityValue.prototype.hasAuthority = function () {
        return isNotEmpty(this.id);
    };
    /**
     * This method checks if authority has a value
     *
     * @return boolean
     */
    AuthorityValue.prototype.hasValue = function () {
        return isNotEmpty(this.value);
    };
    /**
     * This method checks if authority has related information object
     *
     * @return boolean
     */
    AuthorityValue.prototype.hasOtherInformation = function () {
        return isNotEmpty(this.otherInformation);
    };
    /**
     * This method checks if authority has a placeholder as value
     *
     * @return boolean
     */
    AuthorityValue.prototype.hasPlaceholder = function () {
        return this.hasValue() && this.value === PLACEHOLDER_PARENT_METADATA;
    };
    return AuthorityValue;
}(IntegrationModel));
export { AuthorityValue };
//# sourceMappingURL=authority.value.js.map