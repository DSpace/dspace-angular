import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
var GenericItemPageFieldComponent = /** @class */ (function (_super) {
    tslib_1.__extends(GenericItemPageFieldComponent, _super);
    /**
     * This component can be used to represent metadata on a simple item page.
     * It is the most generic way of displaying metadata values
     * It expects 4 parameters: The item, a seperator, the metadata keys and an i18n key
     */
    function GenericItemPageFieldComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], GenericItemPageFieldComponent.prototype, "item", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], GenericItemPageFieldComponent.prototype, "separator", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], GenericItemPageFieldComponent.prototype, "fields", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], GenericItemPageFieldComponent.prototype, "label", void 0);
    GenericItemPageFieldComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-generic-item-page-field',
            templateUrl: '../item-page-field.component.html'
        })
        /**
         * This component can be used to represent metadata on a simple item page.
         * It is the most generic way of displaying metadata values
         * It expects 4 parameters: The item, a seperator, the metadata keys and an i18n key
         */
    ], GenericItemPageFieldComponent);
    return GenericItemPageFieldComponent;
}(ItemPageFieldComponent));
export { GenericItemPageFieldComponent };
//# sourceMappingURL=generic-item-page-field.component.js.map