import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
var ItemReinstateComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemReinstateComponent, _super);
    function ItemReinstateComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageKey = 'reinstate';
        _this.predicate = function (rd) { return !rd.payload.isWithdrawn; };
        return _this;
    }
    /**
     * Perform the reinstate action to the item
     */
    ItemReinstateComponent.prototype.performAction = function () {
        var _this = this;
        this.itemDataService.setWithDrawn(this.item.id, false).pipe(first()).subscribe(function (response) {
            _this.processRestResponse(response);
        });
    };
    ItemReinstateComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-reinstate',
            templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
        })
        /**
         * Component responsible for rendering the Item Reinstate page
         */
    ], ItemReinstateComponent);
    return ItemReinstateComponent;
}(AbstractSimpleItemActionComponent));
export { ItemReinstateComponent };
//# sourceMappingURL=item-reinstate.component.js.map