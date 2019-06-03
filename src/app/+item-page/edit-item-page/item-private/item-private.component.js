import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
var ItemPrivateComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemPrivateComponent, _super);
    function ItemPrivateComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageKey = 'private';
        _this.predicate = function (rd) { return !rd.payload.isDiscoverable; };
        return _this;
    }
    /**
     * Perform the make private action to the item
     */
    ItemPrivateComponent.prototype.performAction = function () {
        var _this = this;
        this.itemDataService.setDiscoverable(this.item.id, false).pipe(first()).subscribe(function (response) {
            _this.processRestResponse(response);
        });
    };
    ItemPrivateComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-private',
            templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
        })
        /**
         * Component responsible for rendering the make item private page
         */
    ], ItemPrivateComponent);
    return ItemPrivateComponent;
}(AbstractSimpleItemActionComponent));
export { ItemPrivateComponent };
//# sourceMappingURL=item-private.component.js.map