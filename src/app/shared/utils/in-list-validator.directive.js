import * as tslib_1 from "tslib";
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { inListValidator } from './validator.functions';
/**
 * Directive for validating if a ngModel value is in a given list
 */
var InListValidator = /** @class */ (function () {
    function InListValidator() {
    }
    InListValidator_1 = InListValidator;
    /**
     * The function that checks if the form control's value is currently valid
     * @param c The FormControl
     */
    InListValidator.prototype.validate = function (c) {
        return inListValidator(this.dsInListValidator)(c);
    };
    var InListValidator_1;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], InListValidator.prototype, "dsInListValidator", void 0);
    InListValidator = InListValidator_1 = tslib_1.__decorate([
        Directive({
            selector: '[ngModel][dsInListValidator]',
            // We add our directive to the list of existing validators
            providers: [
                { provide: NG_VALIDATORS, useExisting: InListValidator_1, multi: true }
            ]
        })
    ], InListValidator);
    return InListValidator;
}());
export { InListValidator };
//# sourceMappingURL=in-list-validator.directive.js.map