import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { renderStartsWithFor, StartsWithType } from '../starts-with-decorator';
import { StartsWithAbstractComponent } from '../starts-with-abstract.component';
import { hasValue } from '../../empty.util';
/**
 * A switchable component rendering StartsWith options for the type "Text".
 */
var StartsWithTextComponent = /** @class */ (function (_super) {
    tslib_1.__extends(StartsWithTextComponent, _super);
    function StartsWithTextComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get startsWith as text;
     */
    StartsWithTextComponent.prototype.getStartsWith = function () {
        if (hasValue(this.startsWith)) {
            return this.startsWith;
        }
        else {
            return '';
        }
    };
    /**
     * Add/Change the url query parameter startsWith using the local variable
     */
    StartsWithTextComponent.prototype.setStartsWithParam = function () {
        if (this.startsWith === '0-9') {
            this.startsWith = '0';
        }
        _super.prototype.setStartsWithParam.call(this);
    };
    /**
     * Checks whether the provided option is equal to the current startsWith
     * @param option
     */
    StartsWithTextComponent.prototype.isSelectedOption = function (option) {
        if (this.startsWith === '0' && option === '0-9') {
            return true;
        }
        return option === this.startsWith;
    };
    StartsWithTextComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-starts-with-text',
            styleUrls: ['./starts-with-text.component.scss'],
            templateUrl: './starts-with-text.component.html'
        }),
        renderStartsWithFor(StartsWithType.text)
    ], StartsWithTextComponent);
    return StartsWithTextComponent;
}(StartsWithAbstractComponent));
export { StartsWithTextComponent };
//# sourceMappingURL=starts-with-text.component.js.map