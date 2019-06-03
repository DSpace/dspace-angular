import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
var ItemPublicComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPublicComponent, _super);
    function ItemPublicComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageKey = 'public';
        _this.predicate = function (rd) { return rd.payload.isDiscoverable; };
        return _this;
    }
    /**
     * Perform the make public action to the item
     */
    ItemPublicComponent.prototype.performAction = function () {
        var _this = this;
        this.itemDataService.setDiscoverable(this.item.id, true).pipe(first()).subscribe(function (response) {
            _this.processRestResponse(response);
        });
    };
    ItemPublicComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-public',
            templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
        })
        /**
         * Component responsible for rendering the make item public page
         */
    ], ItemPublicComponent);
    return ItemPublicComponent;
}(AbstractSimpleItemActionComponent));
export { ItemPublicComponent };
//# sourceMappingURL=item-public.component.js.map