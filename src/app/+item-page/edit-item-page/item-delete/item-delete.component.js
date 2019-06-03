import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
import { getItemEditPath } from '../../item-page-routing.module';
var ItemDeleteComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemDeleteComponent, _super);
    function ItemDeleteComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageKey = 'delete';
        return _this;
    }
    /**
     * Perform the delete action to the item
     */
    ItemDeleteComponent.prototype.performAction = function () {
        var _this = this;
        this.itemDataService.delete(this.item).pipe(first()).subscribe(function (succeeded) {
            _this.notify(succeeded);
        });
    };
    /**
     * When the item is successfully delete, navigate to the homepage, otherwise navigate back to the item edit page
     * @param response
     */
    ItemDeleteComponent.prototype.notify = function (succeeded) {
        if (succeeded) {
            this.notificationsService.success(this.translateService.get('item.edit.' + this.messageKey + '.success'));
            this.router.navigate(['']);
        }
        else {
            this.notificationsService.error(this.translateService.get('item.edit.' + this.messageKey + '.error'));
            this.router.navigate([getItemEditPath(this.item.id)]);
        }
    };
    ItemDeleteComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-delete',
            templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
        })
        /**
         * Component responsible for rendering the item delete page
         */
    ], ItemDeleteComponent);
    return ItemDeleteComponent;
}(AbstractSimpleItemActionComponent));
export { ItemDeleteComponent };
//# sourceMappingURL=item-delete.component.js.map