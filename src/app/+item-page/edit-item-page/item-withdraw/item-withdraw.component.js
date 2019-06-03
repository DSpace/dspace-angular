import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
var ItemWithdrawComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemWithdrawComponent, _super);
    function ItemWithdrawComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageKey = 'withdraw';
        _this.predicate = function (rd) { return rd.payload.isWithdrawn; };
        return _this;
    }
    /**
     * Perform the withdraw action to the item
     */
    ItemWithdrawComponent.prototype.performAction = function () {
        var _this = this;
        this.itemDataService.setWithDrawn(this.item.id, true).pipe(first()).subscribe(function (response) {
            _this.processRestResponse(response);
        });
    };
    ItemWithdrawComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-withdraw',
            templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
        })
        /**
         * Component responsible for rendering the Item Withdraw page
         */
    ], ItemWithdrawComponent);
    return ItemWithdrawComponent;
}(AbstractSimpleItemActionComponent));
export { ItemWithdrawComponent };
//# sourceMappingURL=item-withdraw.component.js.map